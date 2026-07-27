import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `Group` — a grouped-list container:
// rows share one rounded surface, split by hairlines drawn by `ListRow`.
export function Group({ children, title }: { children: React.ReactNode; title?: string }) {
    const { C, CTRL, RADII, S, SHADOW } = useTheme();
    return (
        <View style={{ gap: S.sm }}>
            {title ? (
                <AppText variant="sectionHeader" style={{ paddingLeft: S.xs }}>
                    {title}
                </AppText>
            ) : null}
            <View
                style={{
                    backgroundColor: C.surface1,
                    borderWidth: CTRL.border.regular,
                    borderColor: C.border,
                    borderRadius: RADII.card,
                    borderCurve: "continuous",
                    overflow: "hidden",
                    boxShadow: SHADOW.e1
                }}
            >
                {children}
            </View>
        </View>
    );
}
