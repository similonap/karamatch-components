import type { Meta, StoryObj } from "@storybook/react-native";
import { Text, View } from "react-native";

import { useTheme } from "../theme/ThemeProvider";
import { TABS } from "../components/scaffolding/BottomTabBar";
import { TabIcon } from "./TabIcon";
import type { IconName } from "./types";

// One story per karamatch-web/src/screens/MainTabs.tsx bottom-tab icon, so each
// can be found on its own in the sidebar instead of only inside the
// Icon/AllIcons gallery.
const meta: Meta<typeof TabIcon> = {
    title: "Icons/TabIcon",
    component: TabIcon
};

export default meta;
type Story = StoryObj<typeof TabIcon>;

// Both states side by side: selection swaps the outline glyph for the filled
// one *and* the muted colour for the tint, and the pair is the only way to see
// that both happened.
function TabIconPair({ name, label }: { name: IconName; label: string }) {
    const { C, S, T } = useTheme();
    return (
        <View style={{ padding: 24, backgroundColor: C.surface, flexDirection: "row", gap: S.xl }}>
            <View style={{ alignItems: "center", gap: 6 }}>
                <TabIcon name={name} />
                <Text style={[T.footnote, { color: C.textMuted }]}>{label}</Text>
            </View>
            <View style={{ alignItems: "center", gap: 6 }}>
                <TabIcon name={name} selected />
                <Text style={[T.footnote, { color: C.tint }]}>{label}</Text>
            </View>
        </View>
    );
}

export const Venues: Story = { render: () => <TabIconPair name={TABS[0].icon} label={TABS[0].label} /> };
export const Parties: Story = { render: () => <TabIconPair name={TABS[1].icon} label={TABS[1].label} /> };
export const Match: Story = { render: () => <TabIconPair name={TABS[2].icon} label={TABS[2].label} /> };
export const Friends: Story = { render: () => <TabIconPair name={TABS[3].icon} label={TABS[3].label} /> };
export const Mine: Story = { render: () => <TabIconPair name={TABS[4].icon} label={TABS[4].label} /> };
