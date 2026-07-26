import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Chip } from "./Chip";
import { ListRow } from "./ListRow";

// A decorator rather than a per-story `render`, so an args-only story below
// gets the same framing instead of Storybook's bare default renderer. `surface1`
// because a ListRow's home is the inside of a Group/Card, not the page.
function Backdrop({ children }: { children: React.ReactNode }) {
    const { C, S } = useTheme();
    return <View style={{ padding: S.lg, backgroundColor: C.surface1 }}>{children}</View>;
}

const meta: Meta<typeof ListRow> = {
    title: "Primitives/ListRow",
    component: ListRow,
    decorators: [Story => <Backdrop><Story /></Backdrop>],
    argTypes: { onPress: { action: "pressed" } },
    args: {
        icon: "calendar",
        title: "Friday night session",
        subtitle: "Neon Nights · 21:00",
        chevron: true,
        danger: false,
        last: true
    }
};

export default meta;
type Story = StoryObj<typeof ListRow>;

export const Default: Story = {};

// `trailing` takes an element, which can't come from `args`, so this one keeps
// a `render` — for the element, not for the framing.
export const WithTrailing: Story = {
    args: { chevron: false },
    render: args => <ListRow {...args} trailing={<Chip label="2 spots" tone="cyan" />} />
};

export const Danger: Story = {
    args: { icon: "trash", title: "Delete account", subtitle: undefined, danger: true }
};
