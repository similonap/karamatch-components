import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
    title: "Primitives/ConfirmDialog",
    component: ConfirmDialog,
    args: {
        title: "Leave this party?",
        body: "You'll give up your spot and it may be claimed by someone else.",
        confirmLabel: "Leave party",
        busy: false,
        visible: false
    }
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
    render: _args => {
        const [args, updateArgs] = useArgs<ComponentProps<typeof ConfirmDialog>>();
        return (
            <View style={{ flex: 1, padding: 24 }}>
                <Button label="Open dialog" variant="danger" onPress={() => updateArgs({ visible: true })} />
                <ConfirmDialog {...args} onCancel={() => updateArgs({ visible: false })} onConfirm={() => updateArgs({ visible: false })} />
            </View>
        );
    }
};
