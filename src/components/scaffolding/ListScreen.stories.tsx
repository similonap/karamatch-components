import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "../primitives/AppText";
import { Card } from "../primitives/Card";
import { EmptyState } from "../primitives/EmptyState";
import { ListRow } from "../primitives/ListRow";
import { ListScreen } from "./ListScreen";

const meta: Meta<typeof ListScreen> = {
    title: "Scaffolding/ListScreen",
    component: ListScreen
};

export default meta;
type Story = StoryObj<typeof ListScreen>;

type Venue = { id: string; name: string; distance: string };

const VENUES: Venue[] = Array.from({ length: 12 }, (_, index) => ({
    id: String(index),
    name: "Venue " + (index + 1),
    distance: (index * 0.4 + 0.3).toFixed(1) + " km away"
}));

// The VenuesTab shape: a large title in the header, then an open-ended run of
// cards. The header scrolls with the list rather than pinning, matching the
// web screen.
export const Default: Story = {
    render: () => {
        const { C, S } = useTheme();
        return (
            <View style={{ height: 420, backgroundColor: C.surface }}>
                <ListScreen<Venue>
                    data={VENUES}
                    keyExtractor={venue => venue.id}
                    ListHeaderComponent={
                        <View style={{ paddingTop: S.xs, paddingBottom: S.sm }}>
                            <AppText variant="title">Karaoke near you</AppText>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <Card>
                            <ListRow title={item.name} subtitle={item.distance} chevron last />
                        </Card>
                    )}
                />
            </View>
        );
    }
};

// `ListEmptyComponent` replaces the rows but leaves the header in place, so
// the screen keeps its title while the list has nothing to show.
export const Empty: Story = {
    render: () => {
        const { C, S } = useTheme();
        return (
            <View style={{ height: 420, backgroundColor: C.surface }}>
                <ListScreen<Venue>
                    data={[]}
                    keyExtractor={venue => venue.id}
                    ListHeaderComponent={
                        <View style={{ paddingTop: S.xs, paddingBottom: S.sm }}>
                            <AppText variant="title">Karaoke near you</AppText>
                        </View>
                    }
                    ListEmptyComponent={
                        <EmptyState icon="pin" title="Nothing nearby" body="Try widening your search radius." />
                    }
                    renderItem={({ item }) => (
                        <Card>
                            <ListRow title={item.name} subtitle={item.distance} last />
                        </Card>
                    )}
                />
            </View>
        );
    }
};

// Rows draw their own gutter when the list is full-bleed — here the card is
// edge to edge and only its contents stay inset.
export const FullBleed: Story = {
    render: () => {
        const { C } = useTheme();
        return (
            <View style={{ height: 420, backgroundColor: C.surface }}>
                <ListScreen<Venue>
                    pad={false}
                    gap={0}
                    data={VENUES}
                    keyExtractor={venue => venue.id}
                    renderItem={({ item, index }) => (
                        <ListRow title={item.name} subtitle={item.distance} last={index === VENUES.length - 1} />
                    )}
                />
            </View>
        );
    }
};
