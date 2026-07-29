import { useMemo } from "react";
import type { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../theme/ThemeProvider";

export type ScreenLayoutOptions = {
    /** Apply the screen gutter horizontally. Set false for full-bleed content. */
    pad?: boolean;
    /** Override the bottom pad. Defaults to the device's bottom inset plus `S.md`. */
    bottomPad?: number;
    /** Override the gap between children. Defaults to `LAYOUT.screenGap`. */
    gap?: number;
};

// The three values that make a screen body look like a screen body: the side
// gutter, the gap between blocks, and the bottom safe-area pad.
//
// `Screen` applies these itself, but a screen built on `FlatList`,
// `SectionList` or any other scroller has to put them on the scroller's
// *content container* rather than on a wrapping view — a pad on the wrapper
// shrinks the scroller's viewport instead of extending its content, so the
// last row stops short of the bottom edge instead of scrolling past it. This
// hook hands back that style object so every screen body agrees on the
// numbers regardless of which scroller renders it.
export function useScreenLayout({ pad = true, bottomPad, gap }: ScreenLayoutOptions = {}): ViewStyle {
    const { LAYOUT, S } = useTheme();
    const insets = useSafeAreaInsets();

    return useMemo(
        () => ({
            gap: gap ?? LAYOUT.screenGap,
            paddingHorizontal: pad ? LAYOUT.gutter : 0,
            paddingBottom: bottomPad ?? insets.bottom + S.md
        }),
        [gap, pad, bottomPad, LAYOUT.screenGap, LAYOUT.gutter, S.md, insets.bottom]
    );
}
