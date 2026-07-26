import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Button } from "./Button";

// A decorator rather than a per-story `render`, so an args-only story below
// gets the same framing instead of Storybook's bare default renderer.
function Backdrop({ children }: { children: React.ReactNode }) {
    const { C, S } = useTheme();
    return <View style={{ padding: S.lg, backgroundColor: C.surface, gap: S.sm }}>{children}</View>;
}

const meta: Meta<typeof Button> = {
    title: "Primitives/Button",
    component: Button,
    decorators: [Story => <Backdrop><Story /></Backdrop>],
    argTypes: {
        onPress: { action: "pressed" },
        variant: { control: "select", options: ["primary", "tinted", "secondary", "ghost", "danger"] },
        size: { control: "select", options: ["lg", "md", "sm"] },
        icon: { control: "select", options: [undefined, "mic", "check", "plus", "trash"] }
    },
    args: {
        label: "Book this room",
        variant: "primary",
        size: "lg",
        disabled: false,
        busy: false
    }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const AllVariants: Story = {
    render: args => {
        const { S } = useTheme();
        const variants = ["primary", "tinted", "secondary", "ghost", "danger"] as const;
        return (
            <View style={{ gap: S.sm }}>
                {variants.map(variant => (
                    <Button key={variant} {...args} variant={variant} label={variant} />
                ))}
            </View>
        );
    }
};

export const Busy: Story = {
    args: { busy: true }
};
