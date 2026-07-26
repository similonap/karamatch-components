import { createTheme } from "../createTheme";

// ── Soft Aurora ────────────────────────────────────────────────────────────
// The other end of every dial from the default: pillowy, pastel and
// unhurried. Periwinkle→blossom gradients, diffuse coloured shadows, and
// Quicksand over Nunito — two rounded-terminal typefaces with no corners in
// them at all.
//
// What makes it read as a *different app* rather than a recolour:
// - Every control is a full pill (RADII.control/chip/pill = 999) and cards
//   carry a 24px corner, so nothing on screen has a right angle.
// - Controls are taller and roomier across the board (CTRL, LAYOUT.gutter).
// - Shadows are big, soft and violet-tinted rather than black.
// - Section headers drop the tracked-out uppercase rule and become plain
//   friendly labels (T.sectionHeader).
// - Presses dip deep and release slowly (MOTION), and the brand glow is
//   turned up to "strong".
// - The app bar loses its underline entirely (DECOR.appBarBorder).
//
// Fonts: @expo-google-fonts/quicksand (600, 700) + /nunito (400, 500, 700,
// 800).
export const softAurora = createTheme({
    name: "soft-aurora",
    label: "Soft Aurora",

    fonts: {
        displayExtraBold: "Quicksand_700Bold",
        displayBold: "Quicksand_600SemiBold",
        bodyRegular: "Nunito_400Regular",
        bodyMedium: "Nunito_500Medium",
        bodyBold: "Nunito_700Bold",
        bodyExtraBold: "Nunito_800ExtraBold"
    },

    // Rounded geometric faces need far less negative tracking than Unbounded,
    // and more leading — the airiness is half the theme.
    type: {
        display: { fontSize: 31, letterSpacing: -0.2, lineHeight: 39 },
        title: { fontSize: 23, letterSpacing: -0.1, lineHeight: 30 },
        heading: { fontSize: 17, letterSpacing: 0, lineHeight: 23 },
        navTitle: { fontSize: 17, letterSpacing: 0 },
        bodyStrong: { fontSize: 15, lineHeight: 22 },
        body: { fontSize: 15, lineHeight: 24 },
        callout: { fontSize: 14.5, lineHeight: 22 },
        caption: { fontSize: 13.5, lineHeight: 19 },
        captionStrong: { fontSize: 13.5, lineHeight: 19 },
        footnote: { fontSize: 11.5, lineHeight: 16 },
        input: { fontSize: 15, lineHeight: 24 },
        // A soft app labels its sections; it doesn't stamp them.
        sectionHeader: { fontFamily: "Nunito_700Bold", fontSize: 13.5, letterSpacing: 0.2, textTransform: "none" },
        button: { letterSpacing: 0.2 },
        chip: { fontSize: 12.5 },
        tab: { fontSize: 10.5, letterSpacing: 0.2 },
        numeric: { fontSize: 22, letterSpacing: 0 },
        wordmark: { fontSize: 20, letterSpacing: -0.2 }
    },

    radius: { sm: 14, md: 18, lg: 24, xl: 30, xxl: 36, full: 999 },
    // Pills everywhere. `field` stops short of a full pill so a multiline
    // text area doesn't clip its own first line.
    radii: { control: 999, field: 22, chip: 999, tile: 18, plate: 22, bubble: 22, track: 999 },

    space: { lg: 26 },
    layout: { gutter: 22, screenGap: 14, tabBar: 62 },

    controls: {
        buttonHeight: { lg: 54, md: 46, sm: 38 },
        buttonPaddingX: { lg: 28, md: 24, sm: 16 },
        buttonFontSize: { lg: 16.5, md: 15.5, sm: 13.5 },
        fieldHeight: 52,
        fieldPaddingX: 18,
        searchHeight: 48,
        chipHeight: 28,
        chipPaddingX: 13,
        segmentHeight: 38,
        segmentPad: 4,
        rowMinHeight: 58,
        rowPaddingY: 13,
        rowPaddingX: 14,
        tileHeight: 68,
        plateSize: 60,
        trackHeight: 6,
        bubbleTail: 8,
        toggle: { width: 52, height: 32, thumb: 26, inset: 3 },
        border: { hairline: 1, regular: 1, strong: 1.5 }
    },

    // Soft things squash, and take their time coming back.
    motion: {
        press: {
            button: { scale: 0.94, opacity: 0.9 },
            control: { scale: 0.93, opacity: 0.85 },
            snap: { scale: 0.86, opacity: 0.8 },
            surface: { scale: 0.975, opacity: 0.95 },
            row: { scale: 0.995, opacity: 0.8 }
        },
        pressInMs: 90,
        pressOutMs: 260,
        toggleMs: 260
    },

    decor: {
        glow: "strong",
        iconStroke: 1.5,
        iconStrokeStrong: 2,
        brandRadiusRatio: 0.34,
        appBarBorder: false
    },

    schemes: {
        light: {
            colors: {
                bg: "#f5f3ff",
                surface: "#ffffff",
                surface1: "#ffffff",
                surface2: "#f2f0fe",
                surface3: "#e7e4fb",
                surfacePress: "#dcd6f8",

                border: "rgba(94, 76, 160, 0.1)",
                borderStrong: "rgba(94, 76, 160, 0.2)",

                text: "#2b2450",
                textDim: "#5b5285",
                // Pastel palettes tempt you into pale grey-violet text. These
                // are pitched to clear 4.5:1 on `surface2`, the palest ground
                // any of them can land on.
                textMuted: "#66608c",
                textFaint: "#918ab0",
                onTint: "#ffffff",

                tint: "#7b6cf6",
                tintSoft: "#5a4ad2",
                tintPale: "#a79bff",
                tintBg: "rgba(123, 108, 246, 0.1)",
                tintBorder: "rgba(123, 108, 246, 0.28)",
                tintGlow: "rgba(123, 108, 246, 0.38)",

                purple: "#a06cf6",
                violet: "#8b5cf6",
                cyan: "#1c7887",
                cyanBg: "rgba(58, 169, 189, 0.12)",
                cyanBorder: "rgba(58, 169, 189, 0.3)",
                green: "#1f7d5e",
                gold: "#8a6212",

                danger: "#b52c53",
                dangerBg: "rgba(224, 84, 119, 0.12)",
                dangerBorder: "rgba(224, 84, 119, 0.3)",

                scrim: "rgba(43, 36, 80, 0.4)",
                skeleton: "#ebe8fa",

                selectBg: "rgba(123, 108, 246, 0.12)",
                selectBorder: "rgba(123, 108, 246, 0.45)",
                selectText: "#5343c5",
                selectTextDim: "#66608c",
                focus: "rgba(123, 108, 246, 0.5)",
                knob: "#ffffff",
                onAvatar: "#2b2450",
                overlay: "rgba(43, 36, 80, 0.66)",
                onOverlay: "#ffffff",
                track: "#e7e4fb"
            },
            // Wide, low-opacity, violet-tinted: light coming through frosted
            // glass rather than an object casting a shadow.
            shadows: {
                e1: "0 2px 10px rgba(94, 76, 160, 0.1)",
                e2: "0 10px 30px rgba(94, 76, 160, 0.16)",
                e3: "0 24px 60px rgba(94, 76, 160, 0.24)"
            },
            gradient: "linear-gradient(120deg, #7B6CF6, #F49AC2)",
            tileGradient: "linear-gradient(150deg, #9AD9F4, #F49AC2)",
            avatarColors: ["#A99BFF", "#9AD9F4", "#F49AC2", "#9BE7C4", "#FFD79A", "#C9B8FF"]
        },

        dark: {
            colors: {
                bg: "#131028",
                surface: "#1a1636",
                surface1: "#221d45",
                surface2: "#2a2455",
                surface3: "#332c66",
                surfacePress: "#3d3577",

                border: "rgba(198, 190, 255, 0.12)",
                borderStrong: "rgba(198, 190, 255, 0.24)",

                text: "#f2effd",
                textDim: "#c5bdf0",
                textMuted: "#9a92c6",
                textFaint: "#726a9c",
                onTint: "#1b1638",

                tint: "#a99bff",
                tintSoft: "#c0b5ff",
                tintPale: "#d8d2ff",
                tintBg: "rgba(169, 155, 255, 0.16)",
                tintBorder: "rgba(169, 155, 255, 0.4)",
                tintGlow: "rgba(169, 155, 255, 0.45)",

                purple: "#c79bff",
                violet: "#a98bff",
                cyan: "#6fe3f0",
                cyanBg: "rgba(111, 227, 240, 0.14)",
                cyanBorder: "rgba(111, 227, 240, 0.32)",
                green: "#6fe0b4",
                gold: "#ffcf7a",

                danger: "#ff92ad",
                dangerBg: "rgba(255, 146, 173, 0.14)",
                dangerBorder: "rgba(255, 146, 173, 0.34)",

                scrim: "rgba(10, 7, 24, 0.62)",
                skeleton: "#2a2455",

                selectBg: "rgba(169, 155, 255, 0.18)",
                selectBorder: "rgba(169, 155, 255, 0.45)",
                selectText: "#c0b5ff",
                selectTextDim: "#aca4d6",
                focus: "rgba(169, 155, 255, 0.55)",
                knob: "#ffffff",
                onAvatar: "#241c4a",
                overlay: "rgba(10, 7, 24, 0.6)",
                onOverlay: "#f2effd",
                track: "#332c66"
            },
            shadows: {
                e1: "0 2px 12px rgba(0, 0, 0, 0.35)",
                e2: "0 12px 32px rgba(0, 0, 0, 0.45)",
                e3: "0 28px 70px rgba(0, 0, 0, 0.55)"
            },
            gradient: "linear-gradient(120deg, #A99BFF, #FF9EC4)",
            tileGradient: "linear-gradient(150deg, #7FE3F0, #FF9EC4)",
            avatarColors: ["#A99BFF", "#7FE3F0", "#FF9EC4", "#9BE7C4", "#FFD79A", "#C9B8FF"]
        }
    }
});
