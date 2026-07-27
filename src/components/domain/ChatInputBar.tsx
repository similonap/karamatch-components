import { TextInput, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import { AppPressable } from "../primitives/AppPressable";
import { useTextStyle } from "../primitives/AppText";

// Ported from karamatch-web/src/screens/PartyRoom.tsx's inline chat composer
// — a pill text field plus a circular send button that tints once there's a
// draft to send.
export function ChatInputBar({
    value,
    onChangeText,
    onSend,
    placeholder = "Message the party…"
}: {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    placeholder?: string;
}) {
    const { C, CTRL, RADII, S } = useTheme();
    const inputStyle = useTextStyle({ variant: "input" });
    const canSend = value.trim().length > 0;

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSend}
                placeholder={placeholder}
                placeholderTextColor={C.textFaint}
                style={[
                    inputStyle,
                    {
                        flex: 1,
                        height: CTRL.searchHeight,
                        borderRadius: Math.min(RADII.pill, CTRL.searchHeight / 2),
                        borderCurve: "continuous",
                        borderWidth: CTRL.border.regular,
                        borderColor: C.border,
                        backgroundColor: C.surface2,
                        paddingHorizontal: CTRL.fieldPaddingX + 2
                    }
                ]}
            />
            <AppPressable
                onPress={onSend}
                disabled={!canSend}
                accessibilityLabel="Send message"
                press="snap"
                style={{
                    width: CTRL.searchHeight,
                    height: CTRL.searchHeight,
                    borderRadius: Math.min(RADII.round, CTRL.searchHeight / 2),
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: canSend ? C.tint : C.surface3
                }}
            >
                <Icon name="send" size={19} color={canSend ? C.onTint : C.textFaint} />
            </AppPressable>
        </View>
    );
}
