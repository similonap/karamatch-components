import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { MOCK_VENUE_REVIEW } from "../../mocks/data";
import { ReviewCard } from "./ReviewCard";

// The padded backdrop is a `decorator`, not a per-story `render`: a story that
// only overrides `args` falls back to Storybook's default renderer, which
// renders the bare component and silently drops whatever framing a sibling
// story set up inside its own `render`.
function Backdrop({ children }: { children: React.ReactNode }) {
    const { C, S } = useTheme();
    return <View style={{ padding: S.lg, backgroundColor: C.surface }}>{children}</View>;
}

const meta: Meta<typeof ReviewCard> = {
    title: "Domain/ReviewCard",
    component: ReviewCard,
    decorators: [Story => <Backdrop><Story /></Backdrop>],
    args: {
        stars: MOCK_VENUE_REVIEW.stars,
        text: MOCK_VENUE_REVIEW.text,
        createdAt: MOCK_VENUE_REVIEW.createdAt,
        authorId: MOCK_VENUE_REVIEW.from.id,
        authorName: MOCK_VENUE_REVIEW.from.name,
        authorPhotoUrl: MOCK_VENUE_REVIEW.from.photoUrl
    }
};

export default meta;
type Story = StoryObj<typeof ReviewCard>;

export const Default: Story = {};

export const Anonymous: Story = {
    args: { authorId: null, authorName: null, authorPhotoUrl: null, text: "" }
};
