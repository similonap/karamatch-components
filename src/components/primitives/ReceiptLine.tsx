import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/screens/VenueDetail.tsx's inline `Line` — a
// receipt-style label/value row for the booking screen's price breakdown.
export function ReceiptLine({
    label,
    value,
    strong,
    accent
}: {
    label: string;
    value: string;
    strong?: boolean;
    accent?: boolean;
}) {
    const { S } = useTheme();

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: S.sm }}>
            <AppText variant="caption" style={{ flexShrink: 1 }}>
                {label}
            </AppText>
            <AppText
                variant={strong ? "bodyStrong" : "captionStrong"}
                tone={accent ? "cyan" : "text"}
                style={{ flexShrink: 0 }}
            >
                {value}
            </AppText>
        </View>
    );
}
