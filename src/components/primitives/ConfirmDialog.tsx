import { Modal, Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppPressable } from "./AppPressable";
import { Button } from "./Button";

// Ported from karamatch-web/src/ui.tsx's `ConfirmDialog` — a blocking
// confirm styled as a native alert: centred, short, two actions, the
// destructive one on the right and tinted. Uses a real `<Modal>` instead of
// the web version's hand-rolled scrim.
export function ConfirmDialog({
    visible = true,
    title,
    body,
    confirmLabel,
    busy,
    onConfirm,
    onCancel
}: {
    visible?: boolean;
    title: string;
    body: string;
    confirmLabel: string;
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const { C, CTRL, RADII, S, SHADOW, T } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
            <AppPressable
                onPress={onCancel}
                press="none"
                style={{
                    flex: 1,
                    backgroundColor: C.scrim,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: S.lg
                }}
            >
                <AppPressable
                    onPress={() => {}}
                    press="none"
                    style={{
                        width: "100%",
                        maxWidth: 300,
                        backgroundColor: C.surface1,
                        borderWidth: CTRL.border.regular,
                        borderColor: C.border,
                        borderRadius: RADII.sheet,
                        borderCurve: "continuous",
                        padding: S.lg,
                        gap: S.sm,
                        boxShadow: SHADOW.e3
                    }}
                >
                    <Text style={[T.heading, { color: C.text, textAlign: "center" }]}>{title}</Text>
                    <Text style={[T.caption, { color: C.textDim, textAlign: "center" }]}>{body}</Text>
                    <View style={{ flexDirection: "row", gap: S.sm, marginTop: S.sm }}>
                        <Button label="Cancel" variant="secondary" size="md" onPress={onCancel} disabled={busy} style={{ flex: 1 }} />
                        <Button
                            label={confirmLabel}
                            variant="danger"
                            size="md"
                            onPress={onConfirm}
                            busy={busy}
                            style={{ flex: 1 }}
                        />
                    </View>
                </AppPressable>
            </AppPressable>
        </Modal>
    );
}
