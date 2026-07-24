import { useState } from "react";
import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { OptionPill } from "./OptionPill";

const meta: Meta<typeof OptionPill> = {
    title: "Primitives/OptionPill",
    component: OptionPill,
    args: { label: "20:00", sub: "€18", selected: false, disabled: false }
};

export default meta;
type Story = StoryObj<typeof OptionPill>;

export const Default: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof OptionPill>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface, flexDirection: "row" }}>
                <OptionPill {...args} onPress={() => updateArgs({ selected: !args.selected })} />
            </View>
        );
    }
};

export const Row: Story = {
    render: () => {
        const { C, S } = useTheme();
        const [value, setValue] = useState("20:00");
        const options = ["18:00", "20:00", "22:00"];
        return (
            <View style={{ padding: 24, backgroundColor: C.surface, flexDirection: "row", gap: S.sm }}>
                {options.map(time => (
                    <OptionPill key={time} label={time} selected={value === time} onPress={() => setValue(time)} />
                ))}
            </View>
        );
    }
};
