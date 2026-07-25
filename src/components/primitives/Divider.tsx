import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";

// Ported from karamatch-web/src/ui.tsx's `Divider`.
export function Divider() {
    const { C, CTRL } = useTheme();
    return <View style={{ height: CTRL.border.hairline, backgroundColor: C.border }} />;
}
