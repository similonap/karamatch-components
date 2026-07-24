import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { ChatInputBar } from "./ChatInputBar";

const meta: Meta<typeof ChatInputBar> = {
    title: "Domain/ChatInputBar",
    component: ChatInputBar,
    args: { value: "" }
};

export default meta;
type Story = StoryObj<typeof ChatInputBar>;

export const Default: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof ChatInputBar>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <ChatInputBar {...args} onChangeText={value => updateArgs({ value })} onSend={() => updateArgs({ value: "" })} />
            </View>
        );
    }
};

export const WithDraft: Story = {
    args: { value: "See everyone at 9?" },
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof ChatInputBar>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <ChatInputBar {...args} onChangeText={value => updateArgs({ value })} onSend={() => updateArgs({ value: "" })} />
            </View>
        );
    }
};
