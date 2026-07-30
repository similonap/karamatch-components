import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { MOCK_USER, MOCK_USER_PROFILE } from "../../mocks/data";
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
    args: {
        id: MOCK_USER_PROFILE.id,
        name: MOCK_USER_PROFILE.name,
        username: MOCK_USER_PROFILE.username,
        bio: MOCK_USER_PROFILE.bio,
        photoUrl: MOCK_USER_PROFILE.photoUrl,
        singerRating: MOCK_USER_PROFILE.singerRating,
        eventsCount: MOCK_USER_PROFILE.eventsCount,
        matchPct: MOCK_USER_PROFILE.matchPct
    }
};

export default meta;
type Story = StoryObj<typeof UserProfileHeader>;

export const Default: Story = {};

// Your own profile: no `matchPct` at all — there is nothing to compare
// yourself against, and the strip drops the third stat rather than showing a
// padded zero.
export const SelfProfile: Story = {
    args: {
        id: MOCK_USER.id,
        name: MOCK_USER.name,
        username: MOCK_USER.username,
        bio: MOCK_USER.bio,
        photoUrl: MOCK_USER.photoUrl,
        singerRating: MOCK_USER.singerRating,
        eventsCount: MOCK_USER.eventsCount,
        matchPct: null
    }
};
