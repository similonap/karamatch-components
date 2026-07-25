import { Text } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";

// Ported from karamatch-web/src/ui.tsx's `Wordmark`. The web version let
// "Kara" inherit whatever text colour surrounded it via CSS; RN has no
// inheritance, so that segment takes an explicit `color` instead (default:
// the theme's primary text colour).
export function Wordmark({ size, color }: { size?: number; color?: string }) {
    const { C, T } = useTheme();
    return (
        <Text style={[T.wordmark, size === undefined ? null : { fontSize: size }]}>
            <Text style={{ color: color ?? C.text }}>Kara</Text>
            <Text style={{ color: C.tint }}>Match</Text>
        </Text>
    );
}
