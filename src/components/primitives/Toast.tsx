import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `Toast`. The web version was a
// hand-rolled absolutely-positioned overlay; RN uses a real, transparent,
// fade `<Modal>` instead, which is why this needs an explicit `visible`.
export function Toast({ message, visible = true }: { message: string; visible?: boolean }) {
    const { C, CTRL, LAYOUT, RADII, S, S2, SHADOW } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <View
                pointerEvents="none"
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    paddingHorizontal: LAYOUT.gutter,
                    paddingBottom: insets.bottom + LAYOUT.tabBar + S.md
                }}
            >
                <View
                    accessibilityRole="alert"
                    style={{
                        backgroundColor: C.surface3,
                        borderWidth: CTRL.border.regular,
                        borderColor: C.borderStrong,
                        borderRadius: RADII.sheet,
                        borderCurve: "continuous",
                        paddingVertical: S2.s12,
                        paddingHorizontal: S.md,
                        boxShadow: SHADOW.e2
                    }}
                >
                    <AppText variant="caption" tone="text" align="center">
                        {message}
                    </AppText>
                </View>
            </View>
        </Modal>
    );
}
