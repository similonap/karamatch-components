import { createTheme } from "../createTheme";

// ── Paper Press ────────────────────────────────────────────────────────────
// A letterpress print shop: cream stock, ink-black rules, one hot red, and
// nothing rounded. Fat serif headlines (Fraunces) over a monospace body (IBM
// Plex Mono), because a print shop sets its body copy on a typewriter.
//
// What makes it read as a *different app* rather than a recolour:
// - Radii collapse to 2-4px, so every pill becomes a rectangle — including
//   avatars, check rings and icon buttons (RADII.avatar / RADII.round).
// - Elevation is a hard offset rule, not a blur: SHADOW.e1 is "2px 2px 0 ink".
// - Selection is a solid ink slab with paper-coloured text (C.select*),
//   instead of the default's translucent tint wash.
// - No gradient and no glow anywhere (DECOR.primaryFill / glow) — the primary
//   button is a flat red slab.
// - Presses don't scale, they just snap darker, fast (MOTION).
// - Buttons, chips and tabs are uppercase and tracked out (T).
//
// Fonts: @expo-google-fonts/fraunces (700, 900) + /ibm-plex-mono (400, 500,
// 600, 700).
export const paperPress = createTheme({
    name: "paper-press",
    label: "Paper Press",

    fonts: {
        displayExtraBold: "Fraunces_900Black",
        displayBold: "Fraunces_700Bold",
        bodyRegular: "IBMPlexMono_400Regular",
        bodyMedium: "IBMPlexMono_500Medium",
        bodyBold: "IBMPlexMono_600SemiBold",
        bodyExtraBold: "IBMPlexMono_700Bold"
    },

    // Mono sets wider per character than Outfit did, so the ramp comes down a
    // point or two; the serif display goes the other way and gets tighter.
    type: {
        display: { fontSize: 30, letterSpacing: -1.1, lineHeight: 34 },
        title: { fontSize: 21, letterSpacing: -0.6, lineHeight: 26 },
        heading: { fontSize: 16, letterSpacing: -0.3, lineHeight: 21 },
        navTitle: { fontSize: 15, letterSpacing: 0.2 },
        bodyStrong: { fontSize: 14, lineHeight: 20 },
        body: { fontSize: 14, lineHeight: 21 },
        callout: { fontSize: 13, lineHeight: 19 },
        caption: { fontSize: 12, lineHeight: 17 },
        captionStrong: { fontSize: 12, lineHeight: 17 },
        footnote: { fontSize: 10.5, lineHeight: 14 },
        input: { fontSize: 14, lineHeight: 21 },
        sectionHeader: { fontSize: 10, letterSpacing: 1.7 },
        button: { letterSpacing: 1.4, textTransform: "uppercase" },
        chip: { fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" },
        tab: { fontSize: 9.5, letterSpacing: 0.6, textTransform: "uppercase" },
        numeric: { fontSize: 22, letterSpacing: -0.5 },
        wordmark: { fontSize: 20, letterSpacing: -0.6 }
    },

    // A trimmed radius scale is most of the look on its own — everything
    // semantic is derived from it, then the few roles that should be *fully*
    // square are pinned below.
    radius: { sm: 2, md: 2, lg: 3, xl: 4, xxl: 6, full: 4 },
    radii: { avatar: 3, round: 3, track: 0 },

    layout: { screenGap: 14 },

    controls: {
        // Ink rules, not hairlines.
        border: { hairline: 1.5, regular: 2, strong: 3 },
        buttonHeight: { lg: 50, md: 42, sm: 34 },
        // Uppercase mono runs wide, so the labels come down a point.
        buttonFontSize: { lg: 14, md: 13, sm: 11.5 },
        chipHeight: 24,
        segmentPad: 0,
        checkRingBorder: 2.5,
        trackHeight: 4,
        bubbleTail: 0,
        toggle: { width: 48, height: 26, thumb: 20, inset: 2 }
    },

    // Print doesn't squash. A press just inks darker, and quickly.
    motion: {
        press: {
            button: { scale: 1, opacity: 0.55 },
            control: { scale: 1, opacity: 0.55 },
            snap: { scale: 1, opacity: 0.5 },
            surface: { scale: 1, opacity: 0.72 },
            row: { scale: 1, opacity: 0.5 }
        },
        pressInMs: 40,
        pressOutMs: 90,
        toggleMs: 110
    },

    decor: {
        primaryFill: "solid",
        glow: "none",
        iconStroke: 2,
        iconStrokeStrong: 2.8,
        brandRadiusRatio: 0.06,
        placeholderBorder: "dashed"
    },

    schemes: {
        // The daylight edition, and the one the theme was drawn for.
        light: {
            colors: {
                bg: "#efe8dc",
                surface: "#faf6ee",
                surface1: "#fffdf8",
                surface2: "#f1eade",
                surface3: "#e4dac6",
                surfacePress: "#d6c9ae",

                border: "#1c1813",
                borderStrong: "#000000",

                text: "#141110",
                textDim: "#3c352d",
                textMuted: "#6b6357",
                textFaint: "#9a9083",
                onTint: "#faf6ee",

                tint: "#cf2016",
                tintSoft: "#a5170f",
                tintPale: "#7c110b",
                tintBg: "#f7ded9",
                tintBorder: "#cf2016",
                tintGlow: "rgba(0, 0, 0, 0)",

                purple: "#3b2fb5",
                violet: "#2b2185",
                cyan: "#0b6b70",
                cyanBg: "#daeceb",
                cyanBorder: "#0b6b70",
                green: "#1f6b3a",
                gold: "#9d6a06",

                danger: "#a5170f",
                dangerBg: "#f7ded9",
                dangerBorder: "#a5170f",

                scrim: "rgba(20, 17, 16, 0.55)",
                skeleton: "#e4dac6",

                // Selected = inked over. The single loudest difference from
                // the default theme's tint wash.
                selectBg: "#141110",
                selectBorder: "#141110",
                selectText: "#faf6ee",
                focus: "#cf2016",
                knob: "#faf6ee",
                onAvatar: "#faf6ee",
                overlay: "rgba(20, 17, 16, 0.86)",
                onOverlay: "#faf6ee",
                track: "#e4dac6"
            },
            // Hard offset rules. No blur — a printed drop shadow is a second
            // impression of the same block.
            shadows: {
                e1: "2px 2px 0 #1c1813",
                e2: "4px 4px 0 #1c1813",
                e3: "8px 8px 0 #1c1813"
            },
            avatarColors: ["#CF2016", "#1C1813", "#0B6B70", "#1F6B3A", "#9D6A06", "#3B2FB5"]
        },

        // The night edition: same press, inked stock.
        dark: {
            colors: {
                bg: "#100e0b",
                surface: "#17140f",
                surface1: "#1f1b15",
                surface2: "#28231b",
                surface3: "#352f25",
                surfacePress: "#443c2f",

                border: "#a3947a",
                borderStrong: "#efe6d5",

                text: "#f5efe1",
                textDim: "#cbc0aa",
                textMuted: "#9b8f7d",
                textFaint: "#6f6555",
                onTint: "#100e0b",

                tint: "#ff4a33",
                tintSoft: "#ff7a63",
                tintPale: "#ffab99",
                tintBg: "#3a1a13",
                tintBorder: "#ff4a33",
                tintGlow: "rgba(0, 0, 0, 0)",

                purple: "#8f86ff",
                violet: "#7b71f0",
                cyan: "#5ad6cd",
                cyanBg: "#12332f",
                cyanBorder: "#5ad6cd",
                green: "#6cc286",
                gold: "#e8b23c",

                danger: "#ff7a63",
                dangerBg: "#3a1a13",
                dangerBorder: "#ff7a63",

                scrim: "rgba(8, 7, 5, 0.7)",
                skeleton: "#28231b",

                selectBg: "#f5efe1",
                selectBorder: "#f5efe1",
                selectText: "#100e0b",
                focus: "#ff4a33",
                knob: "#f5efe1",
                onAvatar: "#100e0b",
                overlay: "rgba(8, 7, 5, 0.86)",
                onOverlay: "#f5efe1",
                track: "#352f25"
            },
            shadows: {
                e1: "2px 2px 0 rgba(239, 230, 213, 0.22)",
                e2: "4px 4px 0 rgba(239, 230, 213, 0.26)",
                e3: "8px 8px 0 rgba(0, 0, 0, 0.65)"
            },
            avatarColors: ["#FF4A33", "#E8B23C", "#5AD6CD", "#6CC286", "#8F86FF", "#F5EFE1"]
        }
    }
});
