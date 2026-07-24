import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { Button } from "./Button";
import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = {
    title: "Primitives/Toast",
    component: Toast,
    args: { message: "Invite sent to @theolindqvist", visible: false }
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
    render: _args => {
        const [args, updateArgs] = useArgs<ComponentProps<typeof Toast>>();
        return (
            <View style={{ flex: 1, padding: 24 }}>
                <Button
                    label="Show toast for 2s"
                    variant="secondary"
                    onPress={() => {
                        updateArgs({ visible: true });
                        setTimeout(() => updateArgs({ visible: false }), 2000);
                    }}
                />
                <Toast {...args} />
            </View>
        );
    }
};
