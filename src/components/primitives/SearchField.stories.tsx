import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { SearchField } from "./SearchField";

const meta: Meta<typeof SearchField> = {
    title: "Primitives/SearchField",
    component: SearchField,
    args: { placeholder: "Search songs", value: "" }
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof SearchField>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <SearchField {...args} onChange={value => updateArgs({ value })} />
            </View>
        );
    }
};
