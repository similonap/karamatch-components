import { createTheme } from "../createTheme";

// ── Wireframe ──────────────────────────────────────────────────────────────
// A lo-fi wireframe kit: greyscale only, one hairline everywhere, no fills
// worth the name, no elevation and no animation. For sketching a screen's
// structure before anyone has decided what it looks like — and, in this shelf,
// for proving that "themeable" reaches further than colour.
//
// What it switches off, and how:
// - No hue at all. Every accent role (`cyan`, `green`, `gold`, `danger`, even
//   `tint`) resolves to a step on the same grey ramp, so nothing on screen
//   can lean on colour to carry meaning.
// - No elevation: all three `shadows` are transparent, so cards and dialogs
//   are held apart by their outline alone.
// - No motion: every `press` role scales 1 and just dims, over ~30ms.
// - No gradient and no glow (`DECOR.primaryFill`/`glow`) — the primary action
//   is a flat dark-grey box.
// - Selection is a grey fill under a full-strength outline (`C.select*`) —
//   without colour, contrast of *outline* is what marks state, and unlike an
//   inversion it keeps the accents inside a composite row legible.
// - Thin, uniform 1px borders (`CTRL.border`) and a flat 4px radius on
//   everything except avatars, which stay circles the way a wireframe draws
//   people.
// - A flattened type ramp in one neutral grotesque: no display face, barely
//   any tracking, sizes close together.
//
// Fonts: @expo-google-fonts/inter (400, 500, 600, 700).
export const wireframe = createTheme({
    name: "wireframe",
    label: "Wireframe",

    fonts: {
        displayExtraBold: "Inter_600SemiBold",
        displayBold: "Inter_600SemiBold",
        bodyRegular: "Inter_400Regular",
        bodyMedium: "Inter_500Medium",
        bodyBold: "Inter_600SemiBold",
        bodyExtraBold: "Inter_700Bold"
    },

    // A wireframe doesn't shout: the hierarchy is there, but compressed, and
    // nothing is set in a display face.
    type: {
        display: { fontSize: 26, letterSpacing: -0.3, lineHeight: 32 },
        title: { fontSize: 20, letterSpacing: -0.2, lineHeight: 26 },
        heading: { fontSize: 16, letterSpacing: -0.1, lineHeight: 21 },
        navTitle: { fontSize: 16, letterSpacing: -0.1 },
        bodyStrong: { fontSize: 14.5, lineHeight: 20 },
        body: { fontSize: 14.5, lineHeight: 21 },
        callout: { fontSize: 14, lineHeight: 20 },
        caption: { fontSize: 13, lineHeight: 18 },
        captionStrong: { fontSize: 13, lineHeight: 18 },
        footnote: { fontSize: 11, lineHeight: 15 },
        input: { fontSize: 14.5, lineHeight: 21 },
        // Annotation labels, the way a wireframe marks up a region.
        sectionHeader: { fontFamily: "Inter_600SemiBold", fontSize: 10.5, letterSpacing: 0.9 },
        button: { fontFamily: "Inter_500Medium", letterSpacing: 0.1 },
        chip: { fontSize: 11.5, letterSpacing: 0.1 },
        tab: { fontSize: 10, letterSpacing: 0.1 },
        numeric: { fontSize: 19, letterSpacing: -0.2 },
        wordmark: { fontSize: 18, letterSpacing: -0.3 }
    },

    // One radius, applied flat — except avatars and the things a wireframe
    // draws as circles.
    radius: { sm: 4, md: 4, lg: 4, xl: 6, xxl: 8, full: 999 },
    radii: { track: 2 },

    layout: { screenGap: 12 },

    controls: {
        // A single hairline weight. Nothing is emphasised by getting thicker.
        border: { hairline: 1, regular: 1, strong: 1 },
        buttonHeight: { lg: 44, md: 38, sm: 30 },
        buttonPaddingX: { lg: 18, md: 16, sm: 10 },
        buttonFontSize: { lg: 14.5, md: 14, sm: 12.5 },
        fieldHeight: 42,
        fieldMultilineHeight: 80,
        fieldPaddingX: 12,
        searchHeight: 40,
        chipHeight: 24,
        chipPaddingX: 9,
        segmentHeight: 32,
        segmentPad: 2,
        rowMinHeight: 48,
        rowPaddingY: 9,
        rowPaddingX: 11,
        tileHeight: 56,
        plateSize: 48,
        trackHeight: 4,
        bubbleTail: 2,
        avatarRing: 1,
        toggle: { width: 44, height: 24, thumb: 18, inset: 3 }
    },

    // Static by design: a wireframe is a drawing, so a press only dims.
    motion: {
        press: {
            button: { scale: 1, opacity: 0.65 },
            control: { scale: 1, opacity: 0.65 },
            snap: { scale: 1, opacity: 0.55 },
            surface: { scale: 1, opacity: 0.8 },
            row: { scale: 1, opacity: 0.6 }
        },
        pressInMs: 30,
        pressOutMs: 80,
        toggleMs: 90,
        skeletonMs: 900
    },

    decor: {
        primaryFill: "solid",
        glow: "none",
        iconStroke: 1.5,
        iconStrokeStrong: 1.75,
        brandRadiusRatio: 0.08,
        placeholderBorder: "dashed"
    },

    schemes: {
        // Paper: white page, grey ink, grey "image goes here" blocks.
        light: {
            colors: {
                bg: "#fafafa",
                surface: "#ffffff",
                surface1: "#ffffff",
                surface2: "#f3f4f5",
                surface3: "#e7e8ea",
                surfacePress: "#dcdee1",

                border: "#c8cbcf",
                borderStrong: "#9aa0a6",

                text: "#1f2226",
                textDim: "#4b5057",
                // Grey-on-white has to work harder than grey-on-violet did:
                // these are pitched so muted text clears 5:1 on the page and
                // even `textFaint` (placeholders, chevrons) stays readable.
                textMuted: "#686e75",
                textFaint: "#8b9199",
                onTint: "#ffffff",

                // The "brand" colour is just the darkest grey on the ramp.
                tint: "#3f444b",
                tintSoft: "#2c3035",
                tintPale: "#5b6169",
                tintBg: "#eceef0",
                tintBorder: "#9aa0a6",
                tintGlow: "rgba(0, 0, 0, 0)",

                // Every hue role collapses onto the same ramp on purpose.
                purple: "#4b5057",
                violet: "#3f444b",
                cyan: "#565c63",
                cyanBg: "#eceef0",
                cyanBorder: "#c8cbcf",
                green: "#4b5057",
                gold: "#6b7178",

                danger: "#2c3035",
                dangerBg: "#eceef0",
                dangerBorder: "#9aa0a6",

                scrim: "rgba(31, 34, 38, 0.45)",
                skeleton: "#e4e6e8",

                // Grey fill, full-strength outline, ordinary dark text.
                selectBg: "#e7e8ea",
                selectBorder: "#1f2226",
                selectText: "#1f2226",
                selectTextDim: "#4b5057",
                focus: "#1f2226",
                knob: "#ffffff",
                onAvatar: "#ffffff",
                overlay: "rgba(31, 34, 38, 0.8)",
                onOverlay: "#ffffff",
                track: "#e7e8ea"
            },
            // Transparent rather than absent: the token still exists, it just
            // draws nothing, so outlines do all the separating.
            shadows: {
                e1: "0 0 0 rgba(0, 0, 0, 0)",
                e2: "0 0 0 rgba(0, 0, 0, 0)",
                e3: "0 0 0 rgba(0, 0, 0, 0)"
            },
            gradient: "linear-gradient(100deg, #4b5057, #1f2226)",
            // Mid greys only: light enough to read as a placeholder, dark
            // enough for white initials.
            avatarColors: ["#767c85", "#5b6169", "#7b828a", "#4b5057", "#6b7178", "#3f444b"]
        },

        // Blueprint: the same drawing, inverted.
        dark: {
            colors: {
                bg: "#0f1113",
                surface: "#15181b",
                surface1: "#191c20",
                surface2: "#20242a",
                surface3: "#2a2f36",
                surfacePress: "#343a42",

                border: "#3f464f",
                borderStrong: "#5d6670",

                text: "#eceef0",
                textDim: "#b9bfc7",
                textMuted: "#8b939c",
                textFaint: "#666e77",

                onTint: "#0f1113",
                tint: "#d5dae0",
                tintSoft: "#eceef0",
                tintPale: "#ffffff",
                tintBg: "#22272d",
                tintBorder: "#5d6670",
                tintGlow: "rgba(0, 0, 0, 0)",

                purple: "#b9bfc7",
                violet: "#a7aeb6",
                cyan: "#b9bfc7",
                cyanBg: "#22272d",
                cyanBorder: "#3f464f",
                green: "#b9bfc7",
                gold: "#8b939c",

                danger: "#eceef0",
                dangerBg: "#22272d",
                dangerBorder: "#5d6670",

                scrim: "rgba(6, 7, 9, 0.6)",
                skeleton: "#20242a",

                selectBg: "#2a2f36",
                selectBorder: "#eceef0",
                selectText: "#eceef0",
                selectTextDim: "#b9bfc7",
                focus: "#eceef0",
                knob: "#eceef0",
                onAvatar: "#0f1113",
                overlay: "rgba(6, 7, 9, 0.82)",
                onOverlay: "#eceef0",
                track: "#2a2f36"
            },
            shadows: {
                e1: "0 0 0 rgba(0, 0, 0, 0)",
                e2: "0 0 0 rgba(0, 0, 0, 0)",
                e3: "0 0 0 rgba(0, 0, 0, 0)"
            },
            gradient: "linear-gradient(100deg, #d5dae0, #8b939c)",
            // Inverted: light plates, dark initials (see onAvatar).
            avatarColors: ["#8b939c", "#a3a8af", "#767c85", "#b4b9bf", "#9aa0a6", "#7b828a"]
        }
    }
});
