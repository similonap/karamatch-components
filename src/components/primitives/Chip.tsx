import { View } from "react-native";
import type { ReactNode } from "react";

import { useTheme } from "../../theme/ThemeProvider";
import type { ThemeValue } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import type { IconName } from "../../icons/types";
import { AppPressable } from "./AppPressable";
import { AppText } from "./AppText";

type ChipTone = "neutral" | "tint" | "cyan" | "gold" | "green";

const bodyStyleFor = (C: ThemeValue["C"]): Record<ChipTone, { backgroundColor: string; borderColor: string }> => ({
    neutral: { backgroundColor: C.surface2, borderColor: C.border },
    tint: { backgroundColor: C.tintBg, borderColor: C.tintBorder },
    cyan: { backgroundColor: C.cyanBg, borderColor: C.cyanBorder },
    gold: { backgroundColor: "transparent", borderColor: C.border },
    green: { backgroundColor: "transparent", borderColor: C.border }
});

const iconColorFor = (C: ThemeValue["C"]): Record<ChipTone, string> => ({
    neutral: C.textDim,
    tint: C.tintSoft,
    cyan: C.cyan,
    gold: C.gold,
    green: C.green
});

// Ported from karamatch-web/src/ui.tsx's `Chip` — a small status/metadata pill.
export function Chip({
    label,
    icon,
    tone = "neutral",
    onPress,
    selected,
    chevron
}: {
    label: ReactNode;
    icon?: IconName;
    tone?: ChipTone;
    onPress?: () => void;
    selected?: boolean;
    /** Trailing chevron, for a chip that opens something (e.g. a location picker). */
    chevron?: boolean;
}) {
    const { C, CTRL, RADII } = useTheme();
    // A selected chip takes the theme's selection roles rather than the "tint"
    // tone, so a theme that fills selections solid gets a solid chip.
    const iconColor = selected ? C.selectText : iconColorFor(C)[tone];

    const body = (
        <View
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: CTRL.chipGap,
                    height: CTRL.chipHeight,
                    paddingHorizontal: CTRL.chipPaddingX,
                    borderRadius: Math.min(RADII.chip, CTRL.chipHeight / 2),
                    borderWidth: CTRL.border.regular,
                    borderCurve: "continuous"
                },
                selected ? { backgroundColor: C.selectBg, borderColor: C.selectBorder } : bodyStyleFor(C)[tone]
            ]}
        >
            {icon ? <Icon name={icon} size={CTRL.chipIcon} color={iconColor} /> : null}
            {typeof label === "string" ? (
                <AppText variant="chip" tone={iconColor}>
                    {label}
                </AppText>
            ) : (
                label
            )}
            {chevron ? <Icon name="chevronRight" size={12} color={iconColor} /> : null}
        </View>
    );

    if (!onPress) {
        return body;
    }
    return <AppPressable onPress={onPress}>{body}</AppPressable>;
}
