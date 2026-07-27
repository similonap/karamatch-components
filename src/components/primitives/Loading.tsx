import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "./AppText";
import { Spinner } from "./Spinner";

// Ported from karamatch-web/src/ui.tsx's `Loading` — centred filler while a
// screen's first fetch is in flight.
export function Loading({ label }: { label?: string }) {
    const { S, S2 } = useTheme();
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: S2.s12, padding: S.xl }}>
            <Spinner size={28} />
            {label ? (
                <AppText variant="caption" align="center">
                    {label}
                </AppText>
            ) : null}
        </View>
    );
}
