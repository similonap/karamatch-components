import { View } from "react-native";
import type { ReactNode } from "react";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import type { IconName } from "../../icons/types";
import { AppPressable } from "./AppPressable";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `ListRow` — a row inside a Group:
// leading icon, title/subtitle, trailing value + chevron.
export function ListRow({
    icon,
    iconColor,
    leading,
    title,
    subtitle,
    value,
    onPress,
    chevron,
    danger,
    trailing,
    last
}: {
    icon?: IconName;
    iconColor?: string;
    leading?: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    value?: ReactNode;
    onPress?: () => void;
    chevron?: boolean;
    danger?: boolean;
    trailing?: ReactNode;
    last?: boolean;
}) {
    const { C, CTRL, S, S2 } = useTheme();

    const body = (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: S2.s12,
                minHeight: CTRL.rowMinHeight,
                paddingVertical: CTRL.rowPaddingY,
                paddingHorizontal: S.md,
                borderBottomWidth: last ? 0 : CTRL.border.hairline,
                borderBottomColor: C.border
            }}
        >
            {leading}
            {icon ? <Icon name={icon} size={20} color={danger ? C.tintSoft : iconColor ?? C.textMuted} /> : null}
            <View style={{ flex: 1, minWidth: 0 }}>
                {typeof title === "string" ? (
                    <AppText variant="bodyStrong" tone={danger ? "tintSoft" : "text"} truncate>
                        {title}
                    </AppText>
                ) : (
                    title
                )}
                {subtitle ? (
                    typeof subtitle === "string" ? (
                        <AppText variant="caption" style={{ marginTop: 1 }}>
                            {subtitle}
                        </AppText>
                    ) : (
                        subtitle
                    )
                ) : null}
            </View>
            {value ? (
                typeof value === "string" ? <AppText variant="caption">{value}</AppText> : value
            ) : null}
            {trailing}
            {chevron ? <Icon name="chevronRight" size={18} color={C.textFaint} /> : null}
        </View>
    );

    if (!onPress) {
        return body;
    }
    return (
        <AppPressable onPress={onPress} press="row">
            {body}
        </AppPressable>
    );
}
