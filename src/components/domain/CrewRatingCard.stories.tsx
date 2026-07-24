import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useArgs } from "storybook/preview-api";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { MOCK_CREW_MEMBER } from "../../mocks/data";
import { CrewRatingCard } from "./CrewRatingCard";

const meta: Meta<typeof CrewRatingCard> = {
    title: "Domain/CrewRatingCard",
    component: CrewRatingCard,
    args: { member: MOCK_CREW_MEMBER, stars: 0, text: "" }
};

export default meta;
type Story = StoryObj<typeof CrewRatingCard>;

export const Interactive: Story = {
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof CrewRatingCard>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <CrewRatingCard {...args} onStarsChange={stars => updateArgs({ stars })} onTextChange={text => updateArgs({ text })} />
            </View>
        );
    }
};

export const Rated: Story = {
    args: { stars: 4, text: "Carried the whole room on Mr. Brightside." },
    render: _args => {
        const { C } = useTheme();
        const [args, updateArgs] = useArgs<ComponentProps<typeof CrewRatingCard>>();
        return (
            <View style={{ padding: 24, backgroundColor: C.surface }}>
                <CrewRatingCard {...args} onStarsChange={stars => updateArgs({ stars })} onTextChange={text => updateArgs({ text })} />
            </View>
        );
    }
};
