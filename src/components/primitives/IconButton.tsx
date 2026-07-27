import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import type { IconName } from "../../icons/types";
import { AppPressable } from "./AppPressable";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `IconButton` — a circular icon
// button for an app bar or an overlay.
export function IconButton({
    icon,
    onPress,
    label,
    badge,
    tone = "plain",
    size
}: {
    icon: IconName;
    onPress: () => void;
    label: string;
    badge?: number;
    tone?: "plain" | "filled";
    size?: number;
}) {
    const { C, CTRL, LAYOUT, RADII } = useTheme();
    const resolvedSize = size ?? LAYOUT.touch;

    return (
        <AppPressable
            onPress={onPress}
            accessibilityLabel={label}
            style={{
                width: resolvedSize,
                height: resolvedSize,
                borderRadius: Math.min(RADII.round, resolvedSize / 2),
                borderCurve: "continuous",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: tone === "filled" ? C.surface2 : "transparent",
                borderWidth: tone === "filled" ? CTRL.border.regular : 0,
                borderColor: C.border
            }}
        >
            <Icon name={icon} size={22} color={C.text} />
            {badge && badge > 0 ? (
                <View
                    style={{
                        position: "absolute",
                        top: 5,
                        right: 4,
                        minWidth: 17,
                        height: 17,
                        borderRadius: Math.min(RADII.round, 8.5),
                        backgroundColor: C.tint,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 4,
                        borderWidth: CTRL.border.strong,
                        borderColor: C.surface
                    }}
                >
                    <AppText variant="sectionHeader" size={10} tone="onTint" transform="none" style={{ letterSpacing: 0 }}>
                        {badge > 9 ? "9+" : badge}
                    </AppText>
                </View>
            ) : null}
        </AppPressable>
    );
}
