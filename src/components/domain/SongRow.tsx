import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppPressable } from "../primitives/AppPressable";
import { AppText } from "../primitives/AppText";
import { CheckRing } from "../primitives/CheckRing";
import { SongArt } from "../primitives/SongArt";

// The shape this row renders, not a song model. Structural typing means your
// own API's song satisfies it as long as it carries these three fields — no
// import, no adapter. See README's "Prop shapes" section.
export type SongRowProps = {
    song: {
        title: string;
        artist: string;
        /** Cover thumbnail. Absent is normal — SongArt draws a placeholder. */
        coverArt?: string;
    };
    selected: boolean;
    onToggle: () => void;
};

// Ported from karamatch-web/src/screens/SongPicker.tsx's `SongRow`, shared
// there with the profile editor — one row of a song list, toggled on tap.
export function SongRow({ song, selected, onToggle }: SongRowProps) {
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
            <SongArt coverArt={song.coverArt} gradient={selected} color={selected ? C.onTint : C.textFaint} />
            <View style={{ flex: 1, minWidth: 0 }}>
                <AppText variant="bodyStrong" tone={selected ? "selectText" : "text"} truncate>
                    {song.title}
                </AppText>
                <AppText variant="caption" tone={selected ? "selectTextDim" : "textMuted"} truncate>
                    {song.artist}
                </AppText>
            </View>
            <CheckRing on={selected} />
        </AppPressable>
    );
}
