import { View } from "react-native";
import type { ReactNode } from "react";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "./AppText";
import type { TextTone } from "./AppText";

// Extracted from domain/UserProfileHeader.tsx, which defined this privately.
// The profile screen needs the same strip, and re-implementing it there is how
// the two drifted apart — so the cell and its container now live here and both
// screens draw the same thing.

/**
 * The container: cells share one rounded surface and are split by the hairlines
 * `Stat` draws, the same arrangement `Group` uses for rows.
 */
export function StatStrip({ children }: { children: ReactNode }) {
    const { C, CTRL, RADII } = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                backgroundColor: C.surface1,
                borderWidth: CTRL.border.regular,
                borderColor: C.border,
                borderRadius: RADII.card,
                borderCurve: "continuous",
                overflow: "hidden"
            }}
        >
            {children}
        </View>
    );
}

export function Stat({
    label,
    value,
    tone,
    icon,
    last
}: {
    label: string;
    value: string;
    /** Colour for the number. Defaults to primary text. */
    tone?: TextTone | (string & {});
    /** A glyph before the number — a star beside a rating, say. */
    icon?: ReactNode;
    /** Drops the trailing divider on the last cell of a strip. */
    last?: boolean;
}) {
    const { C, CTRL, S, S2 } = useTheme();

    return (
        <View
            style={{
                flex: 1,
                paddingVertical: S2.s12,
                paddingHorizontal: S.sm,
                alignItems: "center",
                borderRightWidth: last ? 0 : CTRL.border.hairline,
                borderRightColor: C.border
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                {icon}
                <AppText variant="bodyStrong" size={17} tone={tone ?? "text"}>
                    {value}
                </AppText>
            </View>
            <AppText variant="footnote" size={10} style={{ marginTop: 2 }}>
                {label}
            </AppText>
        </View>
    );
}
