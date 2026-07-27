import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { money } from "../../utils/format";
import type { Room } from "../../types";
import { AppPressable } from "../primitives/AppPressable";
import { AppText } from "../primitives/AppText";

// Ported from karamatch-web/src/screens/VenueDetail.tsx's inline room-picker
// row — name and seat count on the left, price/hr on the right, tinted when
// selected.
export function RoomOptionRow({ room, selected, onPress }: { room: Room; selected: boolean; onPress: () => void }) {
    const { C, CTRL, RADII, S } = useTheme();
    // A theme may fill a selected row solid, so the text inside takes the
    // palette's selection colours rather than the surface ones.
    const dim = selected ? C.selectTextDim : C.textMuted;

    return (
        <AppPressable
            onPress={onPress}
            press="surface"
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: S.sm,
                minHeight: CTRL.rowMinHeight,
                paddingHorizontal: S.md,
                borderRadius: RADII.card,
                borderCurve: "continuous",
                borderWidth: CTRL.border.regular,
                borderColor: selected ? C.selectBorder : C.border,
                backgroundColor: selected ? C.selectBg : C.surface1
            }}
        >
            <View style={{ minWidth: 0 }}>
                <AppText variant="bodyStrong" tone={selected ? "selectText" : "text"}>
                    {room.name}
                </AppText>
                <AppText variant="footnote" tone={dim}>
                    {room.seats} seats
                </AppText>
            </View>
            <AppText variant="captionStrong" tone={selected ? "selectText" : "cyan"} style={{ flexShrink: 0 }}>
                {money(room.pricePerHour)}/hr
            </AppText>
        </AppPressable>
    );
}
