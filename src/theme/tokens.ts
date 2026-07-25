import type { TextStyle } from "react-native";

// Ported from karamatch-web/src/design/tokens.ts. The scales themselves
// (4pt spacing grid, fixed type ramp, small radius set) are the ones a
// React Native app would carry natively, so they cross over unchanged.
//
// Everything here is the *default* value of a token. A theme (see
// createTheme.ts) may replace any of it, which is why each group has an
// exported type: it's the contract a theme author fills in, and the shape
// `useTheme()` hands back to components. Nothing in src/components may
// hardcode a value that appears in this file — if a component needs a
// number, it needs a token.

// ---------------------------------------------------------------------------
// Space, radius, layout
// ---------------------------------------------------------------------------

export interface SpaceScale {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

// 4pt grid. `S.md` (16) is the screen gutter and the default gap between cards.
export const S: SpaceScale = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
};

export interface HalfStepScale {
    s6: number;
    s10: number;
    s12: number;
    s14: number;
    s20: number;
    s28: number;
}

// Half-steps, for the places where 4pt granularity genuinely reads better.
export const S2: HalfStepScale = { s6: 6, s10: 10, s12: 12, s14: 14, s20: 20, s28: 28 };

export interface RadiusScale {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    full: number;
}

// The raw radius scale. Components don't reach for these directly — they use
// the semantic `Radii` roles below, which are what a theme actually reshapes.
export const R: RadiusScale = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    full: 999
};

export interface LayoutScale {
    /** Screen side gutter. One number, used by every screen. */
    gutter: number;
    /** Standard navigation bar height, matching a native stack header. */
    appBar: number;
    /** Tab bar content height, before the bottom safe-area inset. */
    tabBar: number;
    /** Smallest thing a thumb should have to hit. */
    touch: number;
    /** Default vertical gap between a screen's stacked blocks. */
    screenGap: number;
}

export const LAYOUT: LayoutScale = {
    gutter: 20,
    appBar: 56,
    tabBar: 58,
    touch: 44,
    screenGap: 12
};

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

// Semantic radii: one entry per *kind of thing*, not per size. This is the
// single biggest lever a theme has over the look of the shelf — a theme that
// sets every role to `R.full` reads as pillowy, one that sets them to 2 reads
// as a printed form.
export interface Radii {
    /** Buttons, steppers, segmented container. */
    control: number;
    /** Text and search fields. */
    field: number;
    /** Cards and grouped lists. */
    card: number;
    /** Chips, badges, small metadata pills. */
    chip: number;
    /** Fully-pill things: removable chips, crew chips, the chat composer. */
    pill: number;
    /** Album art and other small thumbnails. */
    tile: number;
    /** Medium squares: icon tiles, venue thumbnails, icon plates. */
    plate: number;
    /** Dialogs, toasts, sheets. */
    sheet: number;
    /** Chat bubbles. */
    bubble: number;
    /**
     * Avatars. Capped at half the avatar's size, so `R.full` is a circle and
     * anything smaller is a squircle.
     */
    avatar: number;
    /**
     * Anything the design would otherwise draw as a circle — check rings,
     * icon buttons, badges, the send button. Capped the same way as `avatar`.
     */
    round: number;
    /** Progress tracks (step header, match ring). */
    track: number;
}

// Derived from the raw scale, so a theme that only rescales `R` still gets a
// coherent set of roles out of it.
export function makeRadii(r: RadiusScale): Radii {
    return {
        control: r.md,
        field: r.md,
        card: r.lg,
        chip: r.sm,
        pill: r.full,
        tile: r.sm,
        plate: r.md,
        sheet: r.xl,
        bubble: r.lg,
        avatar: r.full,
        round: r.full,
        track: 2
    };
}

export const RADII: Radii = makeRadii(R);

// ---------------------------------------------------------------------------
// Control geometry
// ---------------------------------------------------------------------------

// Every fixed dimension a control has. Bumping `buttonHeight` and
// `fieldHeight` together is how a theme goes from compact to generous
// without touching a single component.
export interface Controls {
    buttonHeight: { lg: number; md: number; sm: number };
    buttonPaddingX: { lg: number; md: number; sm: number };
    /** Label size per button size. The family/tracking come from `T.button`. */
    buttonFontSize: { lg: number; md: number; sm: number };
    buttonGap: number;
    /** Icon drawn inside a button, per size. */
    buttonIcon: number;

    fieldHeight: number;
    fieldMultilineHeight: number;
    fieldPaddingX: number;
    searchHeight: number;

    chipHeight: number;
    chipPaddingX: number;
    chipGap: number;
    chipIcon: number;

    segmentHeight: number;
    segmentPad: number;

    /** Minimum height of a `ListRow`. */
    rowMinHeight: number;
    /** Vertical padding inside a bordered selectable row (SongRow etc.). */
    rowPaddingY: number;
    rowPaddingX: number;

    toggle: { width: number; height: number; thumb: number; inset: number };
    checkRingBorder: number;

    /** Height of an `IconTile`. */
    tileHeight: number;
    /** The icon plate in an `EmptyState`. */
    plateSize: number;
    /** Progress track thickness (step header). */
    trackHeight: number;
    /** Tail radius on the outer corner of a chat bubble. */
    bubbleTail: number;
    /** Width of the surface-coloured ring separating stacked avatars. */
    avatarRing: number;

    /** Border widths, by weight. `hairline` is dividers, `regular` is cards. */
    border: { hairline: number; regular: number; strong: number };
}

export const CTRL: Controls = {
    buttonHeight: { lg: 52, md: 44, sm: 36 },
    buttonPaddingX: { lg: S.lg, md: S.lg, sm: S2.s12 },
    buttonFontSize: { lg: 16, md: 15, sm: 13 },
    buttonGap: S.sm,
    buttonIcon: 18,

    fieldHeight: 50,
    fieldMultilineHeight: 88,
    fieldPaddingX: 14,
    searchHeight: 44,

    chipHeight: 26,
    chipPaddingX: 10,
    chipGap: 5,
    chipIcon: 13,

    segmentHeight: 34,
    segmentPad: 3,

    rowMinHeight: 52,
    rowPaddingY: 10,
    rowPaddingX: 12,

    toggle: { width: 46, height: 28, thumb: 22, inset: 2 },
    checkRingBorder: 2,

    tileHeight: 62,
    plateSize: 52,
    trackHeight: 3,
    bubbleTail: 5,
    avatarRing: 2,

    border: { hairline: 1, regular: 1, strong: 2 }
};

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

/** How hard a surface dips when pressed. See `AppPressable`'s `press` prop. */
export type PressRole = "button" | "control" | "snap" | "surface" | "row" | "none";

export interface PressFeedback {
    scale: number;
    opacity: number;
}

export interface Motion {
    /**
     * Press feedback per role, rather than per component: `snap` is a small
     * target that can afford a big dip, `row` is a full-bleed row that would
     * look broken scaling at all.
     */
    press: Record<PressRole, PressFeedback>;
    /** Press-down and release durations, matching the web version's 60/160. */
    pressInMs: number;
    pressOutMs: number;
    toggleMs: number;
    spinnerMs: number;
    /** One skeleton block's pulse, and the stagger between blocks. */
    skeletonMs: number;
    skeletonStaggerMs: number;
}

export const MOTION: Motion = {
    press: {
        button: { scale: 0.98, opacity: 0.72 },
        control: { scale: 0.97, opacity: 0.72 },
        snap: { scale: 0.9, opacity: 0.7 },
        surface: { scale: 0.985, opacity: 0.85 },
        row: { scale: 1, opacity: 0.6 },
        none: { scale: 1, opacity: 1 }
    },
    pressInMs: 60,
    pressOutMs: 160,
    toggleMs: 200,
    spinnerMs: 800,
    skeletonMs: 700,
    skeletonStaggerMs: 120
};

// ---------------------------------------------------------------------------
// Decoration
// ---------------------------------------------------------------------------

// The knobs that aren't a colour or a number: the handful of *choices* that
// carry a theme's personality.
export interface Decor {
    /** Primary button and brand mark: the brand gradient, or a flat fill. */
    primaryFill: "gradient" | "solid";
    /** Coloured bloom under the primary action and brand mark. */
    glow: "none" | "soft" | "strong";
    /** Base icon stroke weight. */
    iconStroke: number;
    /** Heavier stroke, for glyphs that carry meaning on their own (✓, ✕). */
    iconStrokeStrong: number;
    /** Brand mark corner radius, as a fraction of its size. */
    brandRadiusRatio: number;
    /** Outline style for "nothing here yet" affordances. */
    placeholderBorder: "dashed" | "solid";
    /** Draw the app bar's underline as a solid rule or leave it clean. */
    appBarBorder: boolean;
}

export const DECOR: Decor = {
    primaryFill: "gradient",
    glow: "soft",
    iconStroke: 1.75,
    iconStrokeStrong: 2.4,
    brandRadiusRatio: 0.28,
    placeholderBorder: "dashed",
    appBarBorder: true
};

/**
 * The coloured bloom under a brand surface, as a `boxShadow` string — or
 * `fallback` (usually a plain elevation shadow) for a theme that doesn't glow.
 * Two call sites need this decision, so it lives here rather than in either.
 */
export function glowShadow(decor: Decor, color: string, fallback?: string) {
    if (decor.glow === "none") {
        return fallback;
    }
    return (decor.glow === "strong" ? "0 12px 36px " : "0 6px 20px ") + color;
}

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

// Google Fonts' static weight files are loaded through @expo-google-fonts,
// one JS-registered family name per weight (see App.tsx's useFonts call).
// Unlike CSS, React Native can't fake a weight onto a single font file, so
// every entry below names the exact weighted family instead of pairing a
// base family with a `fontWeight`.
export interface FontFamilies {
    displayExtraBold: string;
    displayBold: string;
    bodyRegular: string;
    bodyMedium: string;
    bodyBold: string;
    bodyExtraBold: string;
}

export const FONT: FontFamilies = {
    displayExtraBold: "Unbounded_800ExtraBold",
    displayBold: "Unbounded_700Bold",
    bodyRegular: "Outfit_400Regular",
    bodyMedium: "Outfit_500Medium",
    bodyBold: "Outfit_700Bold",
    bodyExtraBold: "Outfit_800ExtraBold"
};

export type TypeRole =
    | "display"
    | "title"
    | "heading"
    | "navTitle"
    | "bodyStrong"
    | "body"
    | "callout"
    | "caption"
    | "captionStrong"
    | "footnote"
    | "sectionHeader"
    | "button"
    | "chip"
    | "tab"
    | "input"
    | "numeric"
    | "wordmark";

export type TypeScale = Record<TypeRole, TextStyle>;

// A fixed ramp. `title` is a screen heading, `body` is 15 (native default is
// 15-17; 15 keeps dense list rows readable), `caption` is metadata.
//
// Built from the font families rather than closing over `FONT`, so a theme
// that swaps typefaces gets a ramp pointing at *its* families without having
// to restate all seventeen roles.
export function makeTypeScale(fonts: FontFamilies): TypeScale {
    return {
        display: { fontFamily: fonts.displayExtraBold, fontSize: 32, letterSpacing: -0.8, lineHeight: 37 },
        title: { fontFamily: fonts.displayBold, fontSize: 22, letterSpacing: -0.3, lineHeight: 28 },
        heading: { fontFamily: fonts.displayBold, fontSize: 17, letterSpacing: -0.2, lineHeight: 22 },
        /** Nav-bar title. */
        navTitle: { fontFamily: fonts.bodyBold, fontSize: 17, letterSpacing: -0.2 },
        bodyStrong: { fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 21 },
        body: { fontFamily: fonts.bodyRegular, fontSize: 15, lineHeight: 23 },
        callout: { fontFamily: fonts.bodyRegular, fontSize: 14, lineHeight: 20 },
        caption: { fontFamily: fonts.bodyRegular, fontSize: 13, lineHeight: 18 },
        captionStrong: { fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 18 },
        footnote: { fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 15 },
        /** All-caps section header above a grouped list. */
        sectionHeader: {
            fontFamily: fonts.bodyExtraBold,
            fontSize: 11,
            letterSpacing: 0.9,
            textTransform: "uppercase"
        },
        /** Button label. Its size comes from `CTRL.buttonFontSize` per size. */
        button: { fontFamily: fonts.bodyBold, letterSpacing: 0 },
        /** Chip / badge label. */
        chip: { fontFamily: fonts.bodyMedium, fontSize: 12 },
        /** Tab bar label. */
        tab: { fontFamily: fonts.bodyMedium, fontSize: 10, letterSpacing: 0.1 },
        /** Text typed into a field. */
        input: { fontFamily: fonts.bodyRegular, fontSize: 15, lineHeight: 23 },
        /** A number that is the point of its row (a stepper's value). */
        numeric: { fontFamily: fonts.displayBold, fontSize: 20 },
        /** The KaraMatch wordmark. */
        wordmark: { fontFamily: fonts.displayExtraBold, fontSize: 19, letterSpacing: -0.4 }
    };
}

export const T: TypeScale = makeTypeScale(FONT);
