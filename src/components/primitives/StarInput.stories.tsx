import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { StarInput } from "./StarInput";

const meta: Meta<typeof StarInput> = {
    title: "Primitives/StarInput",
    component: StarInput,
    args: { value: 3 }
};

export default meta;
type Story = StoryObj<typeof StarInput>;

export const Default: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof StarInput>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <StarInput {...args} onChange={value => updateArgs({ value })} />
            </View>
        );
    }
};
