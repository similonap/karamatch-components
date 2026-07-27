import { useState } from "react";
import { TextInput, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText, useTextStyle } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `TextField`. The web version forced
// 16px text so mobile Safari wouldn't zoom the page on focus — moot on
// native, so that constraint is dropped.
export function TextField({
    value,
    onChange,
    placeholder,
    label,
    type = "text",
    onEnter,
    autoFocus,
    multiline,
    maxLength
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    type?: "text" | "password" | "email";
    onEnter?: () => void;
    autoFocus?: boolean;
    multiline?: boolean;
    maxLength?: number;
}) {
    const { C, CTRL, RADII, S2 } = useTheme();
    // A TextInput can't be an AppText, so it takes the resolved style instead.
    const inputStyle = useTextStyle({ variant: "input" });
    const [focused, setFocused] = useState(false);

    return (
        <View style={{ gap: S2.s6 }}>
            {label ? (
                <AppText variant="captionStrong" tone="textMuted" style={{ paddingLeft: 2 }}>
                    {label}
                </AppText>
            ) : null}
            <TextInput
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onSubmitEditing={onEnter}
                placeholder={placeholder}
                placeholderTextColor={C.textFaint}
                maxLength={maxLength}
                autoFocus={autoFocus}
                multiline={multiline}
                numberOfLines={multiline ? 3 : undefined}
                secureTextEntry={type === "password"}
                keyboardType={type === "email" ? "email-address" : "default"}
                autoCapitalize={type === "email" ? "none" : "sentences"}
                style={[
                    inputStyle,
                    {
                        width: "100%",
                        borderRadius: RADII.field,
                        borderCurve: "continuous",
                        borderWidth: CTRL.border.regular,
                        borderColor: focused ? C.focus : C.border,
                        backgroundColor: C.surface2,
                        paddingHorizontal: CTRL.fieldPaddingX,
                        paddingVertical: multiline ? S2.s12 : 0,
                        height: multiline ? CTRL.fieldMultilineHeight : CTRL.fieldHeight,
                        textAlignVertical: multiline ? "top" : "center"
                    }
                ]}
            />
        </View>
    );
}
