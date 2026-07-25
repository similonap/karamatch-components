import type { TextStyle } from "react-native";

import { AVATAR_COLORS, GRAD, GRAD_TILE, PALETTES, SHADOWS } from "./colors";
import type { ColorScheme, Palette, Shadows } from "./colors";
import { CTRL, DECOR, FONT, LAYOUT, MOTION, R, S, S2, makeRadii, makeTypeScale } from "./tokens";
import type {
    Controls,
    Decor,
    FontFamilies,
    HalfStepScale,
    LayoutScale,
    Motion,
    PressFeedback,
    PressRole,
    Radii,
    RadiusScale,
    SpaceScale,
    TypeRole,
    TypeScale
} from "./tokens";

// A theme is a *description of the differences* from the default (the neon
// KaraMatch look, i.e. the values in tokens.ts + colors.ts). `createTheme`
// resolves that description into the complete, fully-populated object
// `ThemeProvider` hands to `useTheme()`, so a theme author can write six
// lines or six hundred and components never have to check whether a token
// exists.
//
// Nothing here is React-aware on purpose: a theme is plain data, so it can be
// created at module scope, shared, snapshot-tested, or built at runtime from
// something else (a brand config, a server response).

// ---------------------------------------------------------------------------
// What a theme author writes
// ---------------------------------------------------------------------------

export interface ThemeSchemeSpec {
    /** Only the roles that move; the rest come from the default palette. */
    colors?: Partial<Palette>;
    shadows?: Partial<Shadows>;
    /**
     * Primary-action gradient, as a CSS gradient string (RN parses these for
     * `experimental_backgroundImage`). Ignored when `decor.primaryFill` is
     * `"solid"`.
     */
    gradient?: string;
    /** Brand mark / album art gradient. */
    tileGradient?: string;
    /** The rotation of generated avatar colours. */
    avatarColors?: string[];
}

export interface ControlsSpec
    extends Partial<Omit<Controls, "buttonHeight" | "buttonPaddingX" | "buttonFontSize" | "toggle" | "border">> {
    buttonHeight?: Partial<Controls["buttonHeight"]>;
    buttonPaddingX?: Partial<Controls["buttonPaddingX"]>;
    buttonFontSize?: Partial<Controls["buttonFontSize"]>;
    toggle?: Partial<Controls["toggle"]>;
    border?: Partial<Controls["border"]>;
}

export interface MotionSpec extends Partial<Omit<Motion, "press">> {
    press?: Partial<Record<PressRole, Partial<PressFeedback>>>;
}

export interface ThemeSpec {
    /** Stable id, used to select the theme by name. */
    name: string;
    /** Human label, for a theme picker. */
    label?: string;

    /**
     * Typefaces. The whole type ramp is rebuilt on top of these, so swapping
     * families is a four-line change — but every `type` role is still
     * individually overridable below.
     */
    fonts?: Partial<FontFamilies>;
    /** Per-role type overrides, merged over the ramp built from `fonts`. */
    type?: Partial<Record<TypeRole, TextStyle>>;

    space?: Partial<SpaceScale>;
    halfSteps?: Partial<HalfStepScale>;
    /** The raw radius scale. Overriding it reshapes every semantic radius. */
    radius?: Partial<RadiusScale>;
    /** Semantic radii, merged over whatever `radius` produced. */
    radii?: Partial<Radii>;
    layout?: Partial<LayoutScale>;
    controls?: ControlsSpec;
    motion?: MotionSpec;
    decor?: Partial<Decor>;

    /**
     * Colours per scheme. A theme may define one scheme only — asking for the
     * missing one falls back to the one it does define, so a dark-only theme
     * simply ignores the light/dark switch.
     */
    schemes?: Partial<Record<ColorScheme, ThemeSchemeSpec>>;
}

// ---------------------------------------------------------------------------
// What components get
// ---------------------------------------------------------------------------

/** The scheme-independent half of a theme. */
export interface ThemeTokens {
    T: TypeScale;
    S: SpaceScale;
    S2: HalfStepScale;
    R: RadiusScale;
    LAYOUT: LayoutScale;
    FONT: FontFamilies;
    RADII: Radii;
    CTRL: Controls;
    MOTION: Motion;
    DECOR: Decor;
}

/** The half of a theme that changes with dark/light. */
export interface ThemeScheme {
    C: Palette;
    SHADOW: Shadows;
    GRAD: string;
    GRAD_TILE: string;
    AVATARS: string[];
}

export interface Theme extends ThemeTokens {
    name: string;
    label: string;
    /** Which schemes this theme actually defined colours for. */
    schemeNames: ColorScheme[];
    schemes: Record<ColorScheme, ThemeScheme>;
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

function merge<Value extends object>(base: Value, override: Partial<Value> | undefined): Value {
    return override ? { ...base, ...override } : base;
}

function resolveType(fonts: FontFamilies, overrides: ThemeSpec["type"]): TypeScale {
    const ramp = makeTypeScale(fonts);
    if (!overrides) {
        return ramp;
    }
    // Per role, not per ramp: an override that only sets `fontSize` keeps the
    // family and line height the ramp derived from `fonts`.
    const resolved = { ...ramp };
    for (const [role, style] of Object.entries(overrides) as [TypeRole, TextStyle][]) {
        resolved[role] = { ...ramp[role], ...style };
    }
    return resolved;
}

function resolveControls(spec: ControlsSpec | undefined): Controls {
    if (!spec) {
        return CTRL;
    }
    return {
        ...CTRL,
        ...spec,
        buttonHeight: merge(CTRL.buttonHeight, spec.buttonHeight),
        buttonPaddingX: merge(CTRL.buttonPaddingX, spec.buttonPaddingX),
        buttonFontSize: merge(CTRL.buttonFontSize, spec.buttonFontSize),
        toggle: merge(CTRL.toggle, spec.toggle),
        border: merge(CTRL.border, spec.border)
    };
}

function resolveMotion(spec: MotionSpec | undefined): Motion {
    if (!spec) {
        return MOTION;
    }
    const press = { ...MOTION.press };
    for (const [role, feedback] of Object.entries(spec.press ?? {}) as [PressRole, Partial<PressFeedback>][]) {
        press[role] = { ...MOTION.press[role], ...feedback };
    }
    return { ...MOTION, ...spec, press };
}

function resolveScheme(scheme: ColorScheme, spec: ThemeSchemeSpec | undefined): ThemeScheme {
    return {
        C: merge(PALETTES[scheme], spec?.colors),
        SHADOW: merge(SHADOWS[scheme], spec?.shadows),
        GRAD: spec?.gradient ?? GRAD,
        GRAD_TILE: spec?.tileGradient ?? spec?.gradient ?? GRAD_TILE,
        AVATARS: spec?.avatarColors ?? AVATAR_COLORS
    };
}

export function createTheme(spec: ThemeSpec): Theme {
    const fonts = merge(FONT, spec.fonts);
    const radius = merge(R, spec.radius);

    const defined = (["dark", "light"] as ColorScheme[]).filter(scheme => spec.schemes?.[scheme]);
    // A theme with no colours at all is the default palette in both schemes.
    const schemeNames = defined.length > 0 ? defined : (["dark", "light"] as ColorScheme[]);

    return {
        name: spec.name,
        label: spec.label ?? spec.name,
        schemeNames,
        T: resolveType(fonts, spec.type),
        S: merge(S, spec.space),
        S2: merge(S2, spec.halfSteps),
        R: radius,
        LAYOUT: merge(LAYOUT, spec.layout),
        FONT: fonts,
        RADII: merge(makeRadii(radius), spec.radii),
        CTRL: resolveControls(spec.controls),
        MOTION: resolveMotion(spec.motion),
        DECOR: merge(DECOR, spec.decor),
        schemes: {
            dark: resolveScheme("dark", spec.schemes?.dark),
            light: resolveScheme("light", spec.schemes?.light)
        }
    };
}

/**
 * The scheme a theme should render for a requested one — a theme that only
 * defines `dark` stays dark even when the OS asks for light, rather than
 * falling back to a palette it never designed.
 */
export function resolveSchemeName(theme: Theme, wanted: ColorScheme): ColorScheme {
    return theme.schemeNames.includes(wanted) ? wanted : theme.schemeNames[0];
}
