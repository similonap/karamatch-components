import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppPressable } from "../primitives/AppPressable";
import { AppText } from "../primitives/AppText";
import { CheckRing } from "../primitives/CheckRing";
import { SongArt } from "../primitives/SongArt";

// What this row draws, not a song model. Your own API's song can be spread
// straight in — `<SongRow {...song} selected onToggle={...} />` — and the
// fields it carries beyond these three are simply ignored.
export type SongRowProps = {
    title: string;
    artist: string;
    /** Cover thumbnail. Absent is normal — SongArt draws a placeholder. */
    coverArt?: string;
    selected: boolean;
    onToggle: () => void;
};

// Ported from karamatch-web/src/screens/SongPicker.tsx's `SongRow`, shared
// there with the profile editor — one row of a song list, toggled on tap.
export function SongRow({ title, artist, coverArt, selected, onToggle }: SongRowProps) {
    const { C, CTRL, RADII, S2 } = useTheme();

    return (
        <AppPressable
            onPress={onToggle}
            press="surface"
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: S2.s12,
                paddingVertical: CTRL.rowPaddingY,
                paddingHorizontal: CTRL.rowPaddingX,
                borderRadius: RADII.card,
                borderCurve: "continuous",
                borderWidth: CTRL.border.regular,
                borderColor: selected ? C.selectBorder : C.border,
                backgroundColor: selected ? C.selectBg : C.surface1
            }}
        >
            <SongArt coverArt={coverArt} gradient={selected} color={selected ? C.onTint : C.textFaint} />
            <View style={{ flex: 1, minWidth: 0 }}>
                <AppText variant="bodyStrong" tone={selected ? "selectText" : "text"} truncate>
                    {title}
                </AppText>
                <AppText variant="caption" tone={selected ? "selectTextDim" : "textMuted"} truncate>
                    {artist}
                </AppText>
            </View>
            <CheckRing on={selected} />
        </AppPressable>
    );
}
