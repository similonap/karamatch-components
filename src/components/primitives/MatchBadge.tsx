import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `MatchBadge` — taste compatibility
// as a compact pill, for singers listed in a row. Renders nothing when pct
// is null (that singer is you).
export function MatchBadge({ pct }: { pct: number | null | undefined }) {
    const { C, CTRL, RADII } = useTheme();
    if (pct === null || pct === undefined) {
        return null;
    }
    const strong = pct >= 60;

    return (
        <View
            style={{
                borderRadius: RADII.chip,
                borderCurve: "continuous",
                paddingHorizontal: CTRL.chipPaddingX - 2,
                paddingVertical: 2,
                borderWidth: CTRL.border.regular,
                borderColor: strong ? C.tintBorder : C.border,
                backgroundColor: strong ? C.tintBg : C.surface2
            }}
        >
            <AppText variant="chip" tone={strong ? "tintSoft" : "textMuted"}>
                {pct}%
            </AppText>
        </View>
    );
}
