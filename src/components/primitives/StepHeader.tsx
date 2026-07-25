import { Text, View } from "react-native";
import type { ReactNode } from "react";

import { useTheme } from "../../theme/ThemeProvider";

// Ported from karamatch-web/src/ui.tsx's `StepHeader` — onboarding progress
// as a filled track instead of tracked-out "STEP 1 OF 3" caps.
export function StepHeader({
    step,
    total,
    title,
    subtitle,
    trailing
}: {
    step: number;
    total: number;
    title: string;
    subtitle?: string;
    trailing?: ReactNode;
}) {
    const { C, CTRL, RADII, S2, T } = useTheme();
    return (
        <View style={{ gap: S2.s10 }}>
            <View
                style={{ flexDirection: "row", gap: 4 }}
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 1, max: total, now: step }}
            >
                {Array.from({ length: total }, (_, index) => (
                    <View
                        key={index}
                        style={{
                            flex: 1,
                            height: CTRL.trackHeight,
                            borderRadius: RADII.track,
                            backgroundColor: index < step ? C.tint : C.track
                        }}
                    />
                ))}
            </View>
            <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                <Text style={[T.title, { color: C.text }]}>{title}</Text>
                {trailing}
            </View>
            {subtitle ? <Text style={[T.callout, { color: C.textMuted }]}>{subtitle}</Text> : null}
        </View>
    );
}
