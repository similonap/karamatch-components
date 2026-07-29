import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../theme/ThemeProvider";
import type { IconName } from "../../icons/types";
import { TabBarButton } from "./TabBarButton";

export type TabKey = "venues" | "parties" | "match" | "friends" | "mine";

export const TABS: { key: TabKey; label: string; icon: IconName }[] = [
    { key: "venues", label: "Venues", icon: "pin" },
    { key: "parties", label: "Parties", icon: "mic" },
    { key: "match", label: "Match", icon: "spark" },
    { key: "friends", label: "Friends", icon: "users" },
    { key: "mine", label: "Mine", icon: "calendar" }
];

// Ported from karamatch-web/src/screens/MainTabs.tsx's inline `TabBar` — flat
// and opaque, hairline on top, icon over label, the selected tab marked by a
// filled glyph and the tint colour. Deliberately not a floating translucent
// pill: that's an iOS-only idiom that renders differently wherever
// backdrop-filter/blur is unsupported, breaking the "identical on both
// platforms" requirement the web version calls out.
export function BottomTabBar({ current, onSelect }: { current: TabKey; onSelect: (tab: TabKey) => void }) {
    const { C, CTRL, LAYOUT } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "stretch",
                height: LAYOUT.tabBar + insets.bottom,
                paddingBottom: insets.bottom,
                backgroundColor: C.surface,
                borderTopWidth: CTRL.border.hairline,
                borderTopColor: C.border
            }}
        >
            {TABS.map(tab => (
                <TabBarButton
                    key={tab.key}
                    icon={tab.icon}
                    label={tab.label}
                    selected={tab.key === current}
                    onPress={() => onSelect(tab.key)}
                />
            ))}
        </View>
    );
}
