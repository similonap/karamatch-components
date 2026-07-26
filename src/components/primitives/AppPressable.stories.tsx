import type { Meta, StoryObj } from "@storybook/react-native";
import { Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppPressable } from "./AppPressable";

const PRESS_ROLES = ["button", "control", "snap", "surface", "row", "none"] as const;

const meta: Meta<typeof AppPressable> = {
    title: "Primitives/AppPressable",
    component: AppPressable,
    argTypes: {
        onPress: { action: "pressed" },
        press: { control: "select", options: PRESS_ROLES }
    },
    args: {
        disabled: false,
        press: "control"
    }
};

export default meta;
type Story = StoryObj<typeof AppPressable>;

function Demo(props: React.ComponentProps<typeof AppPressable>) {
    const { C, RADII, S } = useTheme();
    return (
        <AppPressable
            {...props}
            style={[
                { backgroundColor: C.surface2, borderRadius: RADII.card, padding: S.md, borderCurve: "continuous" },
                props.style
            ]}
        >
            <Text style={{ color: C.text }}>{props.children ?? "Press me"}</Text>
        </AppPressable>
    );
}

export const Default: Story = {
    render: args => (
        <View style={{ padding: 24 }}>
            <Demo {...args} />
        </View>
    )
};

// How far each role dips is the theme's call, not this component's — the same
// six rows feel completely different under Neon Nights (a tight, quick dip),
// Soft Aurora (a deep, slow squash) and Wireframe (no scale at all).
export const PressRoles: Story = {
    render: args => {
        const { C, MOTION, S, T } = useTheme();
        return (
            <View style={{ padding: 24, gap: S.sm }}>
                {PRESS_ROLES.map(role => (
                    <Demo key={role} {...args} press={role}>
                        <Text style={[T.bodyStrong, { color: C.text }]}>
                            {role} — scale {MOTION.press[role].scale}, opacity {MOTION.press[role].opacity}
                        </Text>
                    </Demo>
                ))}
            </View>
        );
    }
};

export const Disabled: Story = {
    args: { disabled: true },
    render: args => (
        <View style={{ padding: 24 }}>
            <Demo {...args} />
        </View>
    )
};
