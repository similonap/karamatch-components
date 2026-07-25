import { Text } from "react-native";
import type { ReactNode } from "react";

import { useTheme } from "../../theme/ThemeProvider";
import { AppPressable } from "./AppPressable";

// Ported from karamatch-web/src/ui.tsx's `OptionPill` — a selectable option
// pill, e.g. a day, a time, a room.
export function OptionPill({
    label,
    sub,
    selected,
    onPress,
    disabled
}: {
    label: ReactNode;
    sub?: ReactNode;
    selected: boolean;
    onPress: () => void;
    disabled?: boolean;
}) {
    const { C, CTRL, LAYOUT, RADII, T } = useTheme();

    return (
        <AppPressable
            onPress={onPress}
            disabled={disabled}
            press="control"
            style={{
                minHeight: LAYOUT.touch,
                paddingVertical: 8,
                paddingHorizontal: CTRL.fieldPaddingX,
                borderRadius: Math.min(RADII.control, LAYOUT.touch / 2),
                borderCurve: "continuous",
                borderWidth: CTRL.border.regular,
                borderColor: selected ? C.selectBorder : C.border,
                backgroundColor: selected ? C.selectBg : C.surface2,
                alignItems: "center",
                justifyContent: "center",
                gap: 1
            }}
        >
            <Text style={[T.captionStrong, { color: selected ? C.selectText : C.textDim }]}>{label}</Text>
            {sub ? (
                <Text style={[T.footnote, { fontSize: 10, opacity: 0.8, color: selected ? C.selectText : C.textDim }]}>
                    {sub}
                </Text>
            ) : null}
        </AppPressable>
    );
}
