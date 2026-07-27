import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `Wordmark`. The web version let
// "Kara" inherit whatever text colour surrounded it via CSS; RN has no
// inheritance, so that segment takes an explicit `color` instead (default:
// the theme's primary text colour).
export function Wordmark({ size, color }: { size?: number; color?: string }) {
    const { C } = useTheme();
    // Nested runs, each with its own tone — the RN equivalent of the web's
    // two <span>s, and the reason `Wordmark` can't just be one AppText.
    return (
        <AppText variant="wordmark" size={size} tone={color ?? C.text}>
            Kara
            <AppText variant="wordmark" size={size} tone="tint">
                Match
            </AppText>
        </AppText>
    );
}
