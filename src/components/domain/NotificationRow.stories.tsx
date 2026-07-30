import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { MOCK_INVITE_NOTIFICATION, MOCK_REVIEW_NOTIFICATION } from "../../mocks/data";
import { NotificationRow } from "./NotificationRow";

const meta: Meta<typeof NotificationRow> = {
    title: "Domain/NotificationRow",
    component: NotificationRow,
    argTypes: {
        onOpen: { action: "opened" },
        onPrimary: { action: "primary" },
        onDismiss: { action: "dismissed" }
    },
    args: { busy: false }
};

export default meta;
type Story = StoryObj<typeof NotificationRow>;

export const Invite: Story = {
    args: {
        kind: "invite",
        fromId: MOCK_INVITE_NOTIFICATION.from.id,
        fromName: MOCK_INVITE_NOTIFICATION.from.name,
        fromUsername: MOCK_INVITE_NOTIFICATION.from.username,
        fromPhotoUrl: MOCK_INVITE_NOTIFICATION.from.photoUrl,
        partyTitle: MOCK_INVITE_NOTIFICATION.party.title,
        partyStart: MOCK_INVITE_NOTIFICATION.party.start,
        venueName: MOCK_INVITE_NOTIFICATION.party.venueName,
        share: MOCK_INVITE_NOTIFICATION.party.share
    },
    render: args => {
        const { C } = useTheme();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <NotificationRow {...args} />
            </View>
        );
    }
};

export const Review: Story = {
    args: {
        kind: "review",
        venueName: MOCK_REVIEW_NOTIFICATION.venue.name,
        venueImageUrl: MOCK_REVIEW_NOTIFICATION.venue.imageUrl,
        partyTitle: MOCK_REVIEW_NOTIFICATION.party.title,
        partyStart: MOCK_REVIEW_NOTIFICATION.party.start
    },
    render: args => {
        const { C } = useTheme();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <NotificationRow {...args} />
            </View>
        );
    }
};
