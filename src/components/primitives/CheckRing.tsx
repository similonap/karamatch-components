import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";

// Ported from karamatch-web/src/ui.tsx's `CheckRing` — the check affordance
// used by the song picker and invite list.
export function CheckRing({ on, size = 22 }: { on: boolean; size?: number }) {
    const { C, CTRL, RADII } = useTheme();
    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: Math.min(RADII.round, size / 2),
                borderWidth: CTRL.checkRingBorder,
                borderColor: on ? C.tint : C.borderStrong,
                backgroundColor: on ? C.tint : "transparent",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {on ? <Icon name="check" size={size * 0.6} weight="strong" color={C.onTint} /> : null}
        </View>
    );
}
