import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { TABS } from "./BottomTabBar";
import type { TabKey } from "./BottomTabBar";
import { TabBarButton } from "./TabBarButton";

const meta: Meta<typeof TabBarButton> = {
    title: "Scaffolding/TabBarButton",
    component: TabBarButton,
    args: { icon: "pin", label: "Venues", showLabel: true }
};

export default meta;
type Story = StoryObj<typeof TabBarButton>;

// One tab on its own, in both states. `flex: 1` is baked in for life inside a
// bar, so the story gives it a fixed-width box to sit in.
export const Default: Story = {
    render: args => {
        const { C, S } = useTheme();
        return (
            <View style={{ flexDirection: "row", gap: S.xl, padding: 24, backgroundColor: C.surface }}>
                <View style={{ width: 72 }}>
                    <TabBarButton {...args} selected={false} />
                </View>
                <View style={{ width: 72 }}>
                    <TabBarButton {...args} selected />
                </View>
            </View>
        );
    }
};

// Glyph only. The label still goes to the screen reader, so the tab stays
// announceable.
export const WithoutLabel: Story = {
    name: "Without label",
    args: { showLabel: false },
    render: args => {
        const { C, S } = useTheme();
        return (
            <View style={{ flexDirection: "row", gap: S.xl, padding: 24, backgroundColor: C.surface }}>
                <View style={{ width: 72 }}>
                    <TabBarButton {...args} selected={false} />
                </View>
                <View style={{ width: 72 }}>
                    <TabBarButton {...args} selected />
                </View>
            </View>
        );
    }
};

// The full row, driven by press — what `BottomTabBar` builds internally, and
// what a navigator assembles from five `tabBarButton` slots. Tap to move the
// selection and watch the glyph fill, the tint move and the label thicken
// together.
export const Row: Story = {
    render: () => {
        const { C, CTRL, LAYOUT } = useTheme();
        const [current, setCurrent] = useState<TabKey>("match");
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "stretch",
                    height: LAYOUT.tabBar,
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
                        onPress={() => setCurrent(tab.key)}
                    />
                ))}
            </View>
        );
    }
};
