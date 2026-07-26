import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { MOCK_USER_PROFILE } from "../../mocks/data";
import { UserProfileHeader } from "./UserProfileHeader";

// A decorator rather than a per-story `render`, so an args-only story below
// gets the same framing instead of Storybook's bare default renderer.
function Backdrop({ children }: { children: React.ReactNode }) {
    const { C, S } = useTheme();
    return <View style={{ padding: S.lg, backgroundColor: C.surface }}>{children}</View>;
}

const meta: Meta<typeof UserProfileHeader> = {
    title: "Domain/UserProfileHeader",
    component: UserProfileHeader,
    decorators: [Story => <Backdrop><Story /></Backdrop>],
    args: { user: MOCK_USER_PROFILE }
};

export default meta;
type Story = StoryObj<typeof UserProfileHeader>;

export const Default: Story = {};

export const SelfProfile: Story = {
    args: { user: { ...MOCK_USER_PROFILE, isSelf: true, matchPct: null } }
};
