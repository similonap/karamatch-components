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

// Hoisted rather than written inline at each call site. These carry the full
// API message shape (id, userId, sentAt), and a *fresh* object literal handed
// straight to a prop gets excess-property-checked against ChatBubbleProps'
// narrow shape, which would reject the extra fields. Through a variable it's
// an ordinary structural check — which is the path real API objects take.
const MY_REPLY = { ...MOCK_CHAT_MESSAGE, userId: MOCK_USER.id, from: MOCK_USER, text: "Sounds good, see you there!" };
const THEIR_FOLLOW_UP = { ...MOCK_CHAT_MESSAGE, id: "m2", text: "Perfect, I'll bring the setlist." };
const MY_CLOSER = { ...MOCK_CHAT_MESSAGE, id: "m3", userId: MOCK_USER.id, from: MOCK_USER, text: "See you at 9!" };

const meta: Meta<typeof ChatBubble> = {
    title: "Domain/ChatBubble",
    component: ChatBubble,
    decorators: [Story => <Backdrop><Story /></Backdrop>],
    args: { message: MOCK_CHAT_MESSAGE, mine: false, showName: true }
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const Theirs: Story = {};

export const Mine: Story = {
    args: { message: MY_REPLY, mine: true }
};

// Composes several bubbles, so it keeps a `render` — but only for the
// composition; the backdrop still comes from the decorator.
export const Conversation: Story = {
    render: () => {
        const { S } = useTheme();
        return (
            <View style={{ gap: S.xs }}>
                <ChatBubble message={MOCK_CHAT_MESSAGE} mine={false} showName />
                <ChatBubble message={THEIR_FOLLOW_UP} mine={false} showName={false} />
                <ChatBubble message={MY_CLOSER} mine showName />
            </View>
        );
    }
};
