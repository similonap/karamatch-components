import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `ErrorNote`.
export function ErrorNote({ message }: { message: string }) {
    const { C, CTRL, RADII, S, S2 } = useTheme();
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
            <AppText variant="caption" tone="tintSoft" style={{ flex: 1 }}>
                {message}
            </AppText>
        </View>
    );
}
