import { View } from "react-native";
import type { ReactNode } from "react";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `Section` — a titled block of
// content within a screen.
export function Section({
    title,
    hint,
    children,
    gap
}: {
    title: string;
    hint?: ReactNode;
    children: ReactNode;
    gap?: number;
}) {
    const { S } = useTheme();
    return (
        <View style={{ gap: gap ?? S.sm }}>
            <AppText variant="sectionHeader">{title}</AppText>
            {children}
            {hint ? (
                typeof hint === "string" ? <AppText variant="footnote" tone="textFaint">{hint}</AppText> : hint
            ) : null}
        </View>
    );
}
