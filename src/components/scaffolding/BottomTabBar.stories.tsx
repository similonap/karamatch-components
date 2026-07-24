import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { BottomTabBar } from "./BottomTabBar";

const meta: Meta<typeof BottomTabBar> = {
    title: "Scaffolding/BottomTabBar",
    component: BottomTabBar,
    args: { current: "venues" }
};

export default meta;
type Story = StoryObj<typeof BottomTabBar>;

export const Default: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof BottomTabBar>>();
        return (
            <View style={{ height: 400, justifyContent: "flex-end", backgroundColor: C.surface2 }}>
                <BottomTabBar {...args} onSelect={current => updateArgs({ current })} />
            </View>
        );
    }
};
