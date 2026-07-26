// Checks every foreground/background pair the components in src/ actually
// draw, for every theme in src/theme/themes/, in both schemes — so a theme
// can't ship text that lands invisible on its own surfaces.
//
// This exists because the shelf's palette is a set of *roles*, and a role only
// makes sense against the role it sits on: `selectText` is legible or not
// depending entirely on what `selectBg` resolved to. A screenshot only proves
// the one state that happened to be on screen; this proves all of them.
//
// Plain Node/CommonJS on purpose, matching build-registry.js: the repo has no
// TS script runner, and the `typescript` package (already a devDependency) can
// transpile the theme sources on the fly — see the require hook below.
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const ROOT = path.join(__dirname, "..");

// The themes are TypeScript, and everything they import is either another
// theme file or a type-only import (which transpiles away), so a one-file
// require hook is enough to load them without a build step.
require.extensions[".ts"] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
        fileName: filename
    });
    module._compile(outputText, filename);
};

const { BUILT_IN_THEMES } = require(path.join(ROOT, "src/theme/themes/index.ts"));

// ---------------------------------------------------------------------------
// Colour maths (WCAG 2.1 relative luminance + contrast ratio)
// ---------------------------------------------------------------------------

function channel(value) {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function parse(color) {
    if (color.startsWith("#")) {
        const hex = color.slice(1);
        const parts = hex.length === 3 ? [...hex].map(c => c + c) : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)];
        return [...parts.map(p => parseInt(p, 16)), 1];
    }
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (!match) {
        throw new Error(`check-contrast: cannot parse colour "${color}"`);
    }
    const values = match[1].split(",").map(Number);
    return [values[0], values[1], values[2], values.length > 3 ? values[3] : 1];
}

// Backgrounds are given as layers, topmost first, opaque base last. Half the
// palette is translucent (`tintBg`, `selectBg`, `border`…), and measuring one
// of those against nothing gives a meaningless number — what the eye sees is
// the composite over whatever surface it was laid on.
function flatten(layers) {
    let result = parse(layers[layers.length - 1]).slice(0, 3);
    for (let i = layers.length - 2; i >= 0; i--) {
        const [r, g, b, alpha] = parse(layers[i]);
        result = [
            r * alpha + result[0] * (1 - alpha),
            g * alpha + result[1] * (1 - alpha),
            b * alpha + result[2] * (1 - alpha)
        ];
    }
    return result;
}

function luminance([r, g, b]) {
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(foregroundLayers, backgroundLayers) {
    const fg = luminance(flatten([...foregroundLayers, ...backgroundLayers]));
    const bg = luminance(flatten(backgroundLayers));
    return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
}

// ---------------------------------------------------------------------------
// What the components actually draw
// ---------------------------------------------------------------------------

// [label, foreground roles, background layers, minimum ratio].
//
// Thresholds follow WCAG 2.1 AA where it applies: 4.5 for body text, 3.0 for
// large/bold text and for glyphs that carry meaning alone. The sub-2 minimums
// aren't accessibility limits — they're "this shape has to be distinguishable
// from its ground at all", which is what catches a knob or a divider going
// invisible in a theme with no elevation.
//
// `__avatars` measures the foreground against the *worst* entry in that
// scheme's generated-avatar rotation.
const PAIRS = [
    ["screen text on bg", ["text"], ["bg"], 4.5],
    ["textDim on card", ["textDim"], ["surface1"], 4.5],
    ["textMuted on card", ["textMuted"], ["surface1"], 4.5],
    ["textMuted on bg", ["textMuted"], ["bg"], 4.5],
    ["textMuted on field", ["textMuted"], ["surface2"], 4.5],
    ["textFaint placeholder on field", ["textFaint"], ["surface2"], 2.8],
    ["button primary label", ["onTint"], ["tint"], 3.0],
    ["button tinted label", ["tintSoft"], ["tintBg", "bg"], 4.5],
    ["button secondary label", ["text"], ["surface2"], 4.5],
    ["button danger label", ["danger"], ["dangerBg", "bg"], 4.5],
    ["button disabled label", ["textFaint"], ["surface3"], 1.8],
    ["chip cyan label", ["cyan"], ["cyanBg", "surface1"], 4.5],
    ["chip neutral label", ["textDim"], ["surface2"], 4.5],
    ["selected row title", ["selectText"], ["selectBg", "surface1"], 4.5],
    ["selected row subtitle", ["selectTextDim"], ["selectBg", "surface1"], 4.5],
    ["selected pill on field", ["selectText"], ["selectBg", "surface2"], 4.5],
    ["check ring glyph", ["onTint"], ["tint"], 3.0],
    ["toggle knob edge vs off-track", ["border"], ["surface3"], 1.12],
    ["toggle knob vs on-track", ["knob"], ["green"], 1.3],
    ["avatar initials (worst plate)", ["onAvatar"], ["__avatars"], 3.0],
    ["overlay chip label", ["onOverlay"], ["overlay", "surface3"], 4.5],
    ["toast text", ["text"], ["surface3"], 4.5],
    ["error note text", ["tintSoft"], ["tintBg", "surface1"], 4.5],
    ["chat bubble mine", ["onTint"], ["tint"], 3.0],
    ["rating value on card", ["gold"], ["surface1"], 4.5],
    ["room price on card", ["cyan"], ["surface1"], 4.5],
    ["card border vs card", ["border"], ["surface1"], 1.12],
    ["divider vs bg", ["border"], ["bg"], 1.12],
    ["empty track vs card", ["track"], ["surface1"], 1.08],
    ["skeleton vs bg", ["skeleton"], ["bg"], 1.04]
];

// Pairs that were already below threshold when this check was written, all of
// them in the default theme's ported-from-the-web-client brand colours (see
// theme/colors.ts). They're reported every run rather than hidden, but don't
// fail the build — deciding to move a brand colour is a design call, not a
// lint fix. Delete an entry once its colour is repitched.
const KNOWN = new Set([
    "neon-nights/light/textMuted on bg",
    "neon-nights/light/textMuted on field",
    "neon-nights/light/textFaint placeholder on field",
    "neon-nights/light/button tinted label",
    "neon-nights/light/button danger label",
    "neon-nights/light/chip cyan label",
    "neon-nights/light/selected pill on field",
    "neon-nights/light/avatar initials (worst plate)",
    "neon-nights/light/room price on card",
    "neon-nights/dark/textFaint placeholder on field",
    "neon-nights/dark/avatar initials (worst plate)"
]);

function check() {
    const failures = [];
    const known = [];

    for (const theme of BUILT_IN_THEMES) {
        for (const scheme of theme.schemeNames) {
            const { C, AVATARS } = theme.schemes[scheme];
            const problems = [];
            let exceptions = 0;

            for (const [label, foreground, background, min] of PAIRS) {
                const fg = foreground.map(role => C[role]);
                const ratio =
                    background[0] === "__avatars"
                        ? Math.min(...AVATARS.map(plate => contrast(fg, [plate])))
                        : contrast(fg, background.map(role => C[role]));

                if (ratio >= min) {
                    continue;
                }
                const id = `${theme.name}/${scheme}/${label}`;
                const line = `    ${ratio.toFixed(2)} < ${min.toFixed(2)}  ${label}`;
                if (KNOWN.has(id)) {
                    exceptions++;
                    known.push(`    ${theme.name}/${scheme}: ${label} (${ratio.toFixed(2)} < ${min.toFixed(2)})`);
                } else {
                    problems.push(line);
                    failures.push(id);
                }
            }

            const passed = PAIRS.length - problems.length - exceptions;
            const status = problems.length
                ? `${problems.length} below threshold`
                : `${passed}/${PAIRS.length} pairs pass` + (exceptions ? `, ${exceptions} known` : "");
            console.log(`${theme.name.padEnd(14)} ${scheme.padEnd(6)} ${status}`);
            problems.forEach(problem => console.log(problem));
        }
    }

    if (known.length) {
        console.log(`\n[check-contrast] ${known.length} known exception${known.length === 1 ? "" : "s"} (see KNOWN in this file):`);
        known.forEach(entry => console.log(entry));
    }

    if (failures.length) {
        console.error(`\n[check-contrast] ${failures.length} pair${failures.length === 1 ? "" : "s"} below threshold`);
        return 1;
    }
    console.log("\n[check-contrast] ok");
    return 0;
}

module.exports = { check, contrast, PAIRS };

if (require.main === module) {
    process.exit(check());
}
