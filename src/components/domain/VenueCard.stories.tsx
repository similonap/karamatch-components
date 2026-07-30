import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { MOCK_VENUE } from "../../mocks/data";
import { VenueCard } from "./VenueCard";

// A decorator rather than a per-story `render`, so an args-only story below
// gets the same framing instead of Storybook's bare default renderer.
function Backdrop({ children }: { children: React.ReactNode }) {
    const { C, S } = useTheme();
    return <View style={{ padding: S.lg, backgroundColor: C.surface }}>{children}</View>;
}

const meta: Meta<typeof VenueCard> = {
    title: "Domain/VenueCard",
    component: VenueCard,
    decorators: [Story => <Backdrop><Story /></Backdrop>],
    // An action arg, so both stories render the tappable form of the card.
    argTypes: { onPress: { action: "pressed" } },
    args: {
        name: MOCK_VENUE.name,
        imageUrl: MOCK_VENUE.imageUrl,
        rating: MOCK_VENUE.rating,
        reviewsCount: MOCK_VENUE.reviewsCount,
        distanceKm: MOCK_VENUE.distanceKm,
        fromPrice: MOCK_VENUE.fromPrice,
        roomsCount: MOCK_VENUE.rooms.length
    }
};

export default meta;
type Story = StoryObj<typeof VenueCard>;

export const Default: Story = {};

export const Unrated: Story = {
    args: { reviewsCount: 0 }
};
