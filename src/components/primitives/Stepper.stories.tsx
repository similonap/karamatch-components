import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = {
    title: "Primitives/Stepper",
    component: Stepper,
    args: { min: 1, max: 6, suffix: "spots", value: 2 }
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof Stepper>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <Stepper {...args} onChange={value => updateArgs({ value })} />
            </View>
        );
    }
};
