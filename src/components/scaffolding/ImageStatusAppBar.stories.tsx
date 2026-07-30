import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

import { MOCK_VENUE } from "../../mocks/data";
import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "../primitives/AppText";
import { Card } from "../primitives/Card";
import { HERO_HEIGHT, ImageStatusAppBar, ImageStatusHero } from "./ImageStatusAppBar";
import type { ImageStatusAppBarProps } from "./ImageStatusAppBar";

// `MOCK_VENUE.imageUrl` is empty, so these stories also stand in for the
// photo-less venue: the hero falls back to a mic glyph on `C.surface3` and the
// bar behaves identically over it.
const meta: Meta<typeof ImageStatusAppBar> = {
    title: "Scaffolding/ImageStatusAppBar",
    component: ImageStatusAppBar,
    args: { title: MOCK_VENUE.name, scrollY: 0, imageHeight: HERO_HEIGHT }
};

export default meta;
type Story = StoryObj<typeof ImageStatusAppBar>;

// Both halves frozen at whatever the `scrollY` control says: 0 is a bare
// chevron floating on the photo, 200 is an ordinary AppBar. Static on purpose
// — the handover is a function of that one number, and this is the story that
// can stop anywhere inside it.
function FrozenDemo({ scrollY, imageHeight, ...bar }: ImageStatusAppBarProps) {
    return (
        <View style={{ height: 260, overflow: "hidden" }}>
            {/* The hero sits where the scroller would have pushed it to. */}
            <View style={{ marginTop: -scrollY }}>
                <ImageStatusHero imageUrl={MOCK_VENUE.imageUrl} height={imageHeight} />
            </View>
            <ImageStatusAppBar {...bar} scrollY={scrollY} imageHeight={imageHeight} onBack={() => {}} />
        </View>
    );
}

// The real pairing, driven by a real scroller. A screen would reach for
// `Screen` here (`pad={false} gap={0} underStatusBar onScroll={setScrollY}`);
// a plain ScrollView keeps this story to the two components under test.
function ScrollingDemo({ imageHeight, ...bar }: ImageStatusAppBarProps) {
    const { C, LAYOUT, S } = useTheme();
    const [scrollY, setScrollY] = useState(0);

    return (
        <View style={{ height: 320, backgroundColor: C.bg }}>
            <ScrollView
                onScroll={event => setScrollY(event.nativeEvent.contentOffset.y)}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <ImageStatusHero imageUrl={MOCK_VENUE.imageUrl} height={imageHeight} />
                <View style={{ padding: LAYOUT.gutter, gap: S.md }}>
                    <AppText variant="title">{MOCK_VENUE.name}</AppText>
                    {["When", "Room", "Reviews"].map(section => (
                        <Card key={section}>
                            <AppText variant="sectionHeader">{section}</AppText>
                            <AppText variant="caption">Keep scrolling — the bar takes over as the photo goes.</AppText>
                        </Card>
                    ))}
                </View>
            </ScrollView>
            <ImageStatusAppBar {...bar} scrollY={scrollY} imageHeight={imageHeight} />
        </View>
    );
}

export const Default: Story = {
    render: args => <FrozenDemo {...args} />
};

export const Collapsed: Story = {
    args: { scrollY: 200 },
    render: args => <FrozenDemo {...args} />
};

export const Scrolling: Story = {
    render: args => <ScrollingDemo {...args} onBack={() => {}} />
};

// The regression the stories above cannot show: the bar reserves the
// status-bar inset on top of `LAYOUT.appBar`, so a 180pt hero has only ~65pt
// of travel left on a notched device. The fade window has to shorten with it —
// pinned to the web's 60–124pt it would be over before it began.
export const WithStatusBarInset: Story = {
    name: "With status bar inset",
    render: args => (
        <SafeAreaInsetsContext.Provider value={{ top: 59, bottom: 34, left: 0, right: 0 }}>
            <ScrollingDemo {...args} onBack={() => {}} />
        </SafeAreaInsetsContext.Provider>
    )
};
