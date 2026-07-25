import { Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";

// Ported from karamatch-web/src/ui.tsx's `ErrorNote`.
export function ErrorNote({ message }: { message: string }) {
    const { C, CTRL, RADII, S, S2, T } = useTheme();
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: S.sm,
                backgroundColor: C.tintBg,
                borderWidth: CTRL.border.regular,
                borderColor: C.tintBorder,
                borderRadius: RADII.card,
                borderCurve: "continuous",
                paddingVertical: S2.s10,
                paddingHorizontal: CTRL.fieldPaddingX
            }}
        >
            <Icon name="info" size={16} color={C.tintSoft} />
            <Text style={[T.caption, { flex: 1, color: C.tintSoft }]}>{message}</Text>
        </View>
    );
}
