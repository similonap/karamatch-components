import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { MatchRing } from "./MatchRing";

const meta: Meta<typeof MatchRing> = {
    title: "Primitives/MatchRing",
    component: MatchRing,
    args: { pct: 82 }
};

export default meta;
type Story = StoryObj<typeof MatchRing>;

export const Default: Story = {
    render: args => {
        const { C } = useTheme();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface, flexDirection: "row" }}>
                <MatchRing {...args} />
            </View>
        );
    }
};

export const AllValues: Story = {
    render: () => {
        const { C, S } = useTheme();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface, flexDirection: "row", alignItems: "center", gap: S.md }}>
                <MatchRing pct={0} />
                <MatchRing pct={41} />
                <MatchRing pct={60} />
                <MatchRing pct={82} />
                <MatchRing pct={100} />
            </View>
        );
    }
};

export const Sizes: Story = {
    render: () => {
        const { C, S } = useTheme();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface, flexDirection: "row", alignItems: "center", gap: S.md }}>
                <MatchRing pct={78} size={40} />
                <MatchRing pct={78} />
                <MatchRing pct={78} size={80} />
            </View>
        );
    }
};
