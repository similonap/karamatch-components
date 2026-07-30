import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { MOCK_CHAT_MESSAGE, MOCK_USER } from "../../mocks/data";
import { ChatBubble } from "./ChatBubble";

// The padded backdrop is a `decorator`, not a per-story `render`: a story that
// only overrides `args` falls back to Storybook's default renderer, which
// renders the bare component and silently drops whatever framing a sibling
// story set up inside its own `render`.
function Backdrop({ children }: { children: React.ReactNode }) {
    const { C, S } = useTheme();
    return <View style={{ padding: S.lg, backgroundColor: C.surface }}>{children}</View>;
}

const meta: Meta<typeof ChatBubble> = {
    title: "Domain/ChatBubble",
    component: ChatBubble,
    decorators: [Story => <Backdrop><Story /></Backdrop>],
    args: { text: MOCK_CHAT_MESSAGE.text, fromName: MOCK_CHAT_MESSAGE.from.name, mine: false, showName: true }
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const Theirs: Story = {};

export const Mine: Story = {
    args: { text: "Sounds good, see you there!", fromName: MOCK_USER.name, mine: true }
};

// A sender the server couldn't resolve — the name line falls back rather than
// rendering an empty run.
export const UnknownSender: Story = {
    args: { fromName: null }
};

// Composes several bubbles, so it keeps a `render` — but only for the
// composition; the backdrop still comes from the decorator.
export const Conversation: Story = {
    render: () => {
        const { S } = useTheme();
        return (
            <View style={{ gap: S.xs }}>
                <ChatBubble text={MOCK_CHAT_MESSAGE.text} fromName={MOCK_CHAT_MESSAGE.from.name} mine={false} showName />
                <ChatBubble text="Perfect, I'll bring the setlist." fromName={MOCK_CHAT_MESSAGE.from.name} mine={false} showName={false} />
                <ChatBubble text="See you at 9!" fromName={MOCK_USER.name} mine showName />
            </View>
        );
    }
};
