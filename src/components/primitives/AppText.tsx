import { Text } from "react-native";
import type { StyleProp, TextProps, TextStyle } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import type { Palette } from "../../theme/colors";
import type { TypeRole } from "../../theme/tokens";

// The typography primitive. karamatch-web had no equivalent — every screen
// spread a ramp entry and a colour inline (`{...T.caption, color: C.textMuted}`,
// 45 `T.caption` sites alone), which is why the same pairing was retyped
// dozens of times and drifted whenever someone added a `fontWeight` the font
// files couldn't actually render.
//
// Here that pairing *is* the API: pick the role, pick the tone, and both come
// from the live theme. Named `AppText` rather than `Text` for the same reason
// as `AppPressable` — a component called `Text` shadows the React Native
// import it wraps, and every file that uses both ends up aliasing one of them.

/**
 * Palette roles that are legitimately *text* colours. Any other string is
 * accepted too (a generated avatar colour, say), it just isn't suggested.
 */
export type TextTone =
    | "text"
    | "textDim"
    | "textMuted"
    | "textFaint"
    | "onTint"
    | "tint"
    | "tintSoft"
    | "tintPale"
    | "purple"
    | "violet"
    | "cyan"
    | "green"
    | "gold"
    | "danger"
    | "selectText"
    | "selectTextDim"
    | "onOverlay"
    | "onAvatar";

export type TextWeight = "regular" | "medium" | "bold" | "extraBold";

// Roles set in the display face. The rest are body-face, and `weight` resolves
// against whichever group the variant belongs to.
const DISPLAY_ROLES = new Set<TypeRole>(["display", "title", "heading", "numeric", "wordmark"]);

// The tone each role reads best in, taken from what the web actually paired
// them with: metadata roles default muted, everything else defaults to primary
// text. Always overridable with `tone`.
const DEFAULT_TONE: Partial<Record<TypeRole, TextTone>> = {
    caption: "textMuted",
    footnote: "textMuted",
    sectionHeader: "textMuted",
    chip: "textMuted",
    tab: "textMuted"
};

export interface AppTextOptions {
    /** Which entry of the theme's type ramp to set this in. */
    variant?: TypeRole;
    /** A palette text role, or any colour string. */
    tone?: TextTone | (string & {});
    align?: TextStyle["textAlign"];
    /**
     * Overrides the variant's font size — the one-off the web did inline
     * (`{...T.bodyStrong, fontSize: 16}`). Line height scales with it, so a
     * resized role keeps its proportions instead of sitting in the gaps of the
     * original leading.
     */
    size?: number;
    /**
     * React Native can't synthesise a weight onto a font file the way CSS
     * fakes one, so this picks a different registered family rather than
     * setting `fontWeight`. The display face only ships two weights, so
     * `regular`/`medium` resolve to its bold there.
     */
    weight?: TextWeight;
    transform?: TextStyle["textTransform"];
    /**
     * Overrides the leading. Mostly needed where text is centred inside a box
     * it doesn't own — a single initial in an avatar, a number in a ring —
     * and the ramp's leading would push the glyph off centre.
     */
    lineHeight?: number;
}

/**
 * The resolved style for a role, for the places a real `<Text>` can't go —
 * a `TextInput`'s own style, or a `placeholderTextColor` sibling.
 */
export function useTextStyle({
    variant = "body",
    tone,
    align,
    size,
    weight,
    transform,
    lineHeight
}: AppTextOptions = {}): TextStyle {
    const { C, FONT, T } = useTheme();
    const base = T[variant];
    const color = C[(tone ?? DEFAULT_TONE[variant] ?? "text") as keyof Palette] ?? tone;

    const family = weight
        ? DISPLAY_ROLES.has(variant)
            ? weight === "extraBold"
                ? FONT.displayExtraBold
                : FONT.displayBold
            : { regular: FONT.bodyRegular, medium: FONT.bodyMedium, bold: FONT.bodyBold, extraBold: FONT.bodyExtraBold }[weight]
        : base.fontFamily;

    // Keep the role's leading ratio when the size is overridden, rather than
    // pinning a 32pt line height onto 16pt text.
    const scale = size && base.fontSize ? size / base.fontSize : 1;

    return {
        ...base,
        fontFamily: family,
        color,
        ...(size ? { fontSize: size } : null),
        ...(base.lineHeight && scale !== 1 ? { lineHeight: Math.round(base.lineHeight * scale) } : null),
        ...(lineHeight === undefined ? null : { lineHeight }),
        ...(align ? { textAlign: align } : null),
        ...(transform ? { textTransform: transform } : null)
    };
}

export function AppText({
    variant = "body",
    tone,
    align,
    size,
    weight,
    transform,
    lineHeight,
    truncate,
    numberOfLines,
    style,
    children,
    ...rest
}: AppTextOptions &
    Omit<TextProps, "style"> & {
        /** Shorthand for `numberOfLines={1}`. */
        truncate?: boolean;
        style?: StyleProp<TextStyle>;
    }) {
    const resolved = useTextStyle({ variant, tone, align, size, weight, transform, lineHeight });
    const lines = numberOfLines ?? (truncate ? 1 : undefined);

    return (
        <Text
            {...rest}
            numberOfLines={lines}
            // Yoga defaults `flexShrink` to 0, unlike CSS's 1 — without this a
            // truncating label in a row refuses to give up width and overflows
            // its parent instead of ellipsising.
            style={[resolved, lines === undefined ? null : { flexShrink: 1 }, style]}
        >
            {children}
        </Text>
    );
}
