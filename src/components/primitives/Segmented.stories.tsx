import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Segmented } from "./Segmented";

const meta: Meta<typeof Segmented> = {
    title: "Primitives/Segmented",
    component: Segmented,
    args: {
        value: "upcoming",
        items: [
            { key: "upcoming", label: "Upcoming · 2" },
            { key: "past", label: "Past · 5" }
        ]
    }
};

export default meta;
type Story = StoryObj<typeof Segmented>;

export const Default: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof Segmented>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <Segmented {...args} onChange={value => updateArgs({ value })} />
            </View>
        );
    }
};
