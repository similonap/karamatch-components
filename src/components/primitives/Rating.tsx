import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { StarIcon } from "../../icons/StarIcon";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `Rating` — a single star + number.
export function Rating({ value, size = 13, showValue = true }: { value: number; size?: number; showValue?: boolean }) {
    const { C } = useTheme();
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <StarIcon size={size} color={C.gold} />
            {showValue ? <AppText variant="chip" tone="gold">{value.toFixed(1)}</AppText> : null}
        </View>
    );
}
