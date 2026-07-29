import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { StarIcon } from "../../icons/StarIcon";
import { Stat, StatStrip } from "./Stat";

const meta: Meta<typeof Stat> = {
    title: "Primitives/Stat",
    component: Stat,
    args: { label: "nights out", value: "27" }
};

export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
    render: args => {
        const { C } = useTheme();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <StatStrip>
                    <Stat {...args} last />
                </StatStrip>
            </View>
        );
    }
};

export const Strip: Story = {
    render: () => {
        const { C } = useTheme();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <StatStrip>
                    <Stat label="rating" value="4.8" icon={<StarIcon size={13} color={C.gold} />} tone="gold" />
                    <Stat label="nights out" value="27" />
                    <Stat label="taste match" value="78%" tone="tintSoft" last />
                </StatStrip>
            </View>
        );
    }
};

export const TwoUp: Story = {
    render: () => {
        const { C } = useTheme();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <StatStrip>
                    <Stat label="rating" value="4.6" icon={<StarIcon size={13} color={C.gold} />} tone="gold" />
                    <Stat label="nights out" value="12" last />
                </StatStrip>
            </View>
        );
    }
};
