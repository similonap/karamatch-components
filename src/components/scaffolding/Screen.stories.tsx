import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

import { MOCK_CHAT_MESSAGE } from "../../mocks/data";
import { useTheme } from "../../theme/ThemeProvider";
import { ChatBubble } from "../domain/ChatBubble";
import { ChatInputBar } from "../domain/ChatInputBar";
import { AppText } from "../primitives/AppText";
import { BrandMark } from "../primitives/BrandMark";
import { Button } from "../primitives/Button";
import { Card } from "../primitives/Card";
import { ListRow } from "../primitives/ListRow";
import { SearchField } from "../primitives/SearchField";
import { TextField } from "../primitives/TextField";
import { BottomBar } from "./BottomBar";
import { Screen } from "./Screen";

const meta: Meta<typeof Screen> = {
    title: "Scaffolding/Screen",
    component: Screen,
    args: { pad: true }
};

export default meta;
type Story = StoryObj<typeof Screen>;

export const Default: Story = {
    render: args => {
        const { C } = useTheme();
        return (
            <View style={{ height: 420, backgroundColor: C.surface }}>
                <Screen {...args}>
                    {Array.from({ length: 6 }, (_, index) => (
                        <Card key={index}>
                            <ListRow title={"Row " + (index + 1)} subtitle="Scrollable screen content" last />
                        </Card>
                    ))}
                </Screen>
            </View>
        );
    }
};

// The Welcome shape: a hero centred in whatever space is left over, with the
// calls to action pinned to the bottom. A scroller would collapse to the
// content's height and strand both.
export const Centred: Story = {
    args: { scroll: false },
    render: args => {
        const { C, S } = useTheme();
        return (
            <View style={{ height: 420, backgroundColor: C.surface }}>
                <Screen {...args}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: S.md }}>
                        <BrandMark size={80} />
                        <AppText variant="title">KaraMatch</AppText>
                        <AppText variant="body" tone="textDim" style={{ textAlign: "center", maxWidth: 260 }}>
                            Find people who sing what you sing. Book a party. Split the bill.
                        </AppText>
                    </View>

                    <Button label="Create account" onPress={() => {}} />
                    <Button label="Sign in" variant="secondary" onPress={() => {}} />
                </Screen>
            </View>
        );
    }
};

// The Location shape: a map fills the body edge to edge while its controls
// float on top. `pad={false}` hands the gutter to the overlay, so the tiles
// stay full-bleed.
export const FilledWithOverlay: Story = {
    args: { scroll: false, pad: false, bottomPad: 0, gap: 0 },
    render: args => {
        const { C, LAYOUT, S } = useTheme();
        const [query, setQuery] = useState("");
        return (
            <View style={{ height: 420, backgroundColor: C.surface }}>
                <Screen {...args}>
                    <View style={{ flex: 1, backgroundColor: C.surface3 }}>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <AppText variant="caption" tone="textFaint">
                                Map fills the body
                            </AppText>
                        </View>

                        <View style={{ position: "absolute", top: S.sm, left: LAYOUT.gutter, right: LAYOUT.gutter }}>
                            <SearchField value={query} onChange={setQuery} placeholder="Search a city or address" />
                        </View>

                        <View style={{ position: "absolute", bottom: S.md, left: LAYOUT.gutter, right: LAYOUT.gutter }}>
                            <Button label="Use this location" onPress={() => {}} />
                        </View>
                    </View>
                </Screen>
            </View>
        );
    }
};

// The SignIn / Register shape. `avoidKeyboard` insets the scroller so the
// focused field stays reachable; without it the keyboard covers the lower
// fields and the submit button. Tap a field to see it — the effect needs a
// real keyboard, so it does nothing in a simulator with the hardware keyboard
// attached.
export const KeyboardAvoidingForm: Story = {
    args: { avoidKeyboard: true },
    render: args => {
        const { C } = useTheme();
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        return (
            <View style={{ height: 420, backgroundColor: C.surface }}>
                <Screen {...args}>
                    <AppText variant="title">Welcome back</AppText>
                    <TextField label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
                    <TextField label="Password" value={password} onChange={setPassword} type="password" />
                </Screen>
                <BottomBar>
                    <Button label="Sign in" onPress={() => {}} />
                </BottomBar>
            </View>
        );
    }
};

// The PartyRoom chat shape: the message list scrolls, the composer stays
// docked. The body itself must not scroll, so avoidance falls to
// KeyboardAvoidingView — set `keyboardOffset` to the AppBar height when one
// sits above, or the composer lifts too far.
export const DockedComposer: Story = {
    args: { scroll: false, pad: false, bottomPad: 0, gap: 0, avoidKeyboard: true },
    render: args => {
        const { C, LAYOUT, S } = useTheme();
        const [draft, setDraft] = useState("");
        return (
            <View style={{ height: 420, backgroundColor: C.surface }}>
                <Screen {...args}>
                    <View style={{ flex: 1, justifyContent: "flex-end", gap: S.sm, paddingHorizontal: LAYOUT.gutter }}>
                        <ChatBubble message={MOCK_CHAT_MESSAGE} mine={false} showName />
                        <ChatBubble
                            message={{ ...MOCK_CHAT_MESSAGE, id: "m2", text: "Perfect — see you there." }}
                            mine
                            showName={false}
                        />
                    </View>
                    <ChatInputBar value={draft} onChangeText={setDraft} onSend={() => setDraft("")} />
                </Screen>
            </View>
        );
    }
};
