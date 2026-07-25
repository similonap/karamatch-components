import { Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { money } from "../../utils/format";
import type { Room } from "../../types";
import { AppPressable } from "../primitives/AppPressable";

// Ported from karamatch-web/src/screens/VenueDetail.tsx's inline room-picker
// row — name and seat count on the left, price/hr on the right, tinted when
// selected.
export function RoomOptionRow({ room, selected, onPress }: { room: Room; selected: boolean; onPress: () => void }) {
    const { C, CTRL, RADII, S, T } = useTheme();

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
                <Text style={[T.bodyStrong, { color: C.text }]}>{room.name}</Text>
                <Text style={[T.footnote, { color: C.textMuted }]}>{room.seats} seats</Text>
            </View>
            <Text style={[T.captionStrong, { color: C.cyan, flexShrink: 0 }]}>{money(room.pricePerHour)}/hr</Text>
        </AppPressable>
    );
}
