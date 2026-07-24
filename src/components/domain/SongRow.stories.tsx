import { useState } from "react";
import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { MOCK_SONGS } from "../../mocks/data";
import { SongRow } from "./SongRow";

const meta: Meta<typeof SongRow> = {
    title: "Domain/SongRow",
    component: SongRow,
    args: { song: MOCK_SONGS[0], selected: false }
};

export default meta;
type Story = StoryObj<typeof SongRow>;

export const Default: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof SongRow>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <SongRow {...args} onToggle={() => updateArgs({ selected: !args.selected })} />
            </View>
        );
    }
};

export const List: Story = {
    render: () => {
        const { C, S } = useTheme();
        const [picked, setPicked] = useState<string[]>([MOCK_SONGS[1].id]);
        const toggle = (id: string) => setPicked(ids => (ids.includes(id) ? ids.filter(other => other !== id) : [...ids, id]));
        return (
            <View style={{ padding: 24, backgroundColor: C.surface, gap: S.sm }}>
                {MOCK_SONGS.map(song => (
                    <SongRow key={song.id} song={song} selected={picked.includes(song.id)} onToggle={() => toggle(song.id)} />
                ))}
            </View>
        );
    }
};
