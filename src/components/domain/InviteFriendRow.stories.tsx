import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { MOCK_MATCHED_USER } from "../../mocks/data";
import { InviteFriendRow } from "./InviteFriendRow";

const meta: Meta<typeof InviteFriendRow> = {
    title: "Domain/InviteFriendRow",
    component: InviteFriendRow,
    args: {
        id: MOCK_MATCHED_USER.id,
        name: MOCK_MATCHED_USER.name,
        username: MOCK_MATCHED_USER.username,
        photoUrl: MOCK_MATCHED_USER.photoUrl,
        matchPct: MOCK_MATCHED_USER.matchPct,
        singerRating: MOCK_MATCHED_USER.singerRating
    }
};

export default meta;
type Story = StoryObj<typeof InviteFriendRow>;

export const Unselected: Story = {
    args: { selected: false },
    render: args => {
        const { C } = useTheme();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <InviteFriendRow {...args} onToggle={() => {}} />
            </View>
        );
    }
};

export const Selected: Story = {
    args: { selected: true },
    render: args => {
        const { C } = useTheme();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <InviteFriendRow {...args} onToggle={() => {}} />
            </View>
        );
    }
};

export const List: Story = {
    render: () => {
        const { C, S } = useTheme();
        const friends = [MOCK_MATCHED_USER, { ...MOCK_MATCHED_USER, id: 3, name: "Priya Nair", username: "priyanair", matchPct: 54 }];
        const [selected, setSelected] = useState<number[]>([]);
        return (
            <View style={{ padding: 24, backgroundColor: C.surface, gap: S.sm }}>
                {friends.map(friend => (
                    // Spread: the fixture carries email/bio/location too, and
                    // the row simply ignores what it doesn't declare.
                    <InviteFriendRow
                        key={friend.id}
                        {...friend}
                        selected={selected.includes(friend.id)}
                        onToggle={() =>
                            setSelected(current =>
                                current.includes(friend.id) ? current.filter(id => id !== friend.id) : [...current, friend.id]
                            )
                        }
                    />
                ))}
            </View>
        );
    }
};
