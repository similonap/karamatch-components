import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
    title: "Primitives/TextField",
    component: TextField,
    argTypes: { type: { control: "select", options: ["text", "password", "email"] } },
    args: { label: "Bio", placeholder: "Tell other singers about yourself", type: "text", multiline: false, value: "" }
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof TextField>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <TextField {...args} onChange={value => updateArgs({ value })} />
            </View>
        );
    }
};

export const Multiline: Story = {
    args: { multiline: true, label: "About you" },
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof TextField>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <TextField {...args} onChange={value => updateArgs({ value })} />
            </View>
        );
    }
};
