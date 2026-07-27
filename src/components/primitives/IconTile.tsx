
import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import type { IconName } from "../../icons/types";
import { AppPressable } from "./AppPressable";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/screens/Profile.tsx's inline theme-picker
// tile — an icon-over-label option, tinted when selected. Generic enough for
// any small icon+label choice; the web only ever used it for Dark/Light.
export function IconTile({
    icon,
    label,
    selected,
    onPress
}: {
    icon: IconName;
    label: string;
    selected: boolean;
    onPress: () => void;
}) {
    const { C, CTRL, RADII } = useTheme();

    return (
        <AppPressable
            onPress={onPress}
            press="surface"
            style={{
                flex: 1,
                height: CTRL.tileHeight,
                borderRadius: RADII.plate,
                borderCurve: "continuous",
                borderWidth: CTRL.border.regular,
                borderColor: selected ? C.selectBorder : C.border,
                backgroundColor: selected ? C.selectBg : C.surface1,
                alignItems: "center",
                justifyContent: "center",
                gap: 4
            }}
        >
            <Icon name={icon} size={20} color={selected ? C.selectText : C.textDim} />
            <AppText variant="footnote" weight="bold" tone={selected ? "selectText" : "textDim"}>
                {label}
            </AppText>
        </AppPressable>
    );
}
