import { Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import type { Song } from "../../types";
import { AppPressable } from "../primitives/AppPressable";
import { CheckRing } from "../primitives/CheckRing";
import { SongArt } from "../primitives/SongArt";

// Ported from karamatch-web/src/screens/SongPicker.tsx's `SongRow`, shared
// there with the profile editor — one row of a song list, toggled on tap.
export function SongRow({ song, selected, onToggle }: { song: Song; selected: boolean; onToggle: () => void }) {
    const { C, CTRL, RADII, S2, T } = useTheme();

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
                <Text style={[T.bodyStrong, { color: C.text }]} numberOfLines={1}>
                    {song.title}
                </Text>
                <Text style={[T.caption, { color: C.textMuted }]} numberOfLines={1}>
                    {song.artist}
                </Text>
            </View>
            <CheckRing on={selected} />
        </AppPressable>
    );
}
