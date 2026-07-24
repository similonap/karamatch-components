import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
    title: "Primitives/Toggle",
    component: Toggle,
    args: { label: "Open to public", on: false }
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof Toggle>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <Toggle {...args} onChange={on => updateArgs({ on })} />
            </View>
        );
    }
};
