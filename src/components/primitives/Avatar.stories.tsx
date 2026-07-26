import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Avatar } from "./Avatar";

// A decorator rather than a per-story `render`, so an args-only story below
// gets the same framing instead of Storybook's bare default renderer.
function Backdrop({ children }: { children: React.ReactNode }) {
    const { C, S } = useTheme();
    return <View style={{ padding: S.lg, backgroundColor: C.surface }}>{children}</View>;
}

const meta: Meta<typeof Avatar> = {
    title: "Primitives/Avatar",
    component: Avatar,
    decorators: [Story => <Backdrop><Story /></Backdrop>],
    args: { name: "Mara Voss", size: 48, ring: false }
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initial: Story = {};

export const Ringed: Story = {
    args: { ring: true }
};

// Three at once, so this one composes — the backdrop is still the decorator's.
export const Sizes: Story = {
    render: args => {
        const { S } = useTheme();
        return (
            <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
                <Avatar {...args} size={24} />
                <Avatar {...args} size={40} />
                <Avatar {...args} size={64} />
            </View>
        );
    }
};
