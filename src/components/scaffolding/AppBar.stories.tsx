import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

import { useTheme } from "../../theme/ThemeProvider";
import { IconButton } from "../primitives/IconButton";
import { AppBar } from "./AppBar";

const meta: Meta<typeof AppBar> = {
    title: "Scaffolding/AppBar",
    component: AppBar,
    args: { title: "Venue detail", large: false, bordered: true }
};

export default meta;
type Story = StoryObj<typeof AppBar>;

export const Default: Story = {
    render: args => {
        const { C } = useTheme();
        return (
            <View style={{ backgroundColor: C.surface }}>
                <AppBar {...args} onBack={() => {}} right={<IconButton icon="share" label="Share" onPress={() => {}} />} />
            </View>
        );
    }
};

export const Large: Story = {
    args: { title: "My parties", large: true, subtitle: "2 upcoming, 5 past" },
    render: args => {
        const { C } = useTheme();
        return (
            <View style={{ backgroundColor: C.surface }}>
                <AppBar {...args} />
            </View>
        );
    }
};

// The two things the stories above cannot show, and which broke in a
// consuming app because of it:
//
//   1. Storybook's canvas is already `C.bg` (see .rnstorybook/preview.tsx) and
//      the stories above sit the bar on a `C.surface` block, so a bar that
//      paints no background of its own still looks right. Here the bar sits on
//      a deliberately contrasting body — if it stops painting, the body colour
//      runs straight through it.
//   2. Storybook runs with no notch, so a bar that folds the safe-area inset
//      into its own height looks fine. `SafeAreaInsetsContext` forces a real
//      device's inset, which is what collapses the row: at 59pt of inset a
//      56pt-tall bar has nothing left to lay the title and chevron out in.
//
// Both regressions are visible in the gallery rather than only on a phone.
export const WithStatusBarInset: Story = {
    name: "With status bar inset",
    args: { title: "Venue detail" },
    render: args => {
        const { C } = useTheme();
        return (
            <SafeAreaInsetsContext.Provider value={{ top: 59, bottom: 34, left: 0, right: 0 }}>
                <View style={{ backgroundColor: C.surface3, height: 220 }}>
                    <AppBar {...args} onBack={() => {}} right={<IconButton icon="share" label="Share" onPress={() => {}} />} />
                </View>
            </SafeAreaInsetsContext.Provider>
        );
    }
};
