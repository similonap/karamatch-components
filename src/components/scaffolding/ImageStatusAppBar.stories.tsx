import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

import { MOCK_VENUE } from "../../mocks/data";
import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "../primitives/AppText";
import { Card } from "../primitives/Card";
import { HERO_HEIGHT, ImageStatusAppBar, ImageStatusHero } from "./ImageStatusAppBar";
import type { ImageStatusAppBarProps } from "./ImageStatusAppBar";
import { Screen } from "./Screen";

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

// The real pairing, wired exactly as a screen wires it: `Screen` full-bleed
// (`pad={false} gap={0}`) so the hero reaches both edges, `underStatusBar` so
// iOS's automatic content inset doesn't push the photo out from under the
// status bar, and `onScroll` feeding the bar. The outer `View` is what the bar
// positions against — a screen's route container does that job, a story has to
// supply it.
function ScrollingDemo({ imageHeight, ...bar }: ImageStatusAppBarProps) {
    const { C, LAYOUT, S } = useTheme();
    const [scrollY, setScrollY] = useState(0);

    return (
        <View style={{ height: 320, backgroundColor: C.bg }}>
            <Screen pad={false} gap={0} underStatusBar onScroll={setScrollY}>
                <ImageStatusHero imageUrl={MOCK_VENUE.imageUrl} height={imageHeight} />
                {/* `pad={false}` gives the gutter up for the hero's sake, so
                    everything below it brings its own. */}
                <View style={{ padding: LAYOUT.gutter, gap: S.md }}>
                    <AppText variant="title">{MOCK_VENUE.name}</AppText>
                    {["When", "Room", "Reviews"].map(section => (
                        <Card key={section}>
                            <AppText variant="sectionHeader">{section}</AppText>
                            <AppText variant="caption">Keep scrolling — the bar takes over as the photo goes.</AppText>
                        </Card>
                    ))}
                </View>
            </Screen>
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

// What the stories above cannot show on an inset-less viewport: the photo runs
// all the way to the top of the window, *behind* the status bar, with no strip
// of `C.bg` boxing it in — while still leaving a full `imageHeight` of visible
// frame below the cutout, and keeping the chevron (and the title, once the bar
// is solid) clear of it. Both failure modes are visible here: a background band
// above the photo means the inset got padded in instead of added to the height,
// and a chevron under the island means the bar stopped reserving it.
export const WithStatusBarInset: Story = {
    name: "With status bar inset",
    render: args => (
        <SafeAreaInsetsContext.Provider value={{ top: 59, bottom: 34, left: 0, right: 0 }}>
            <ScrollingDemo {...args} onBack={() => {}} />
        </SafeAreaInsetsContext.Provider>
    )
};

// The other half of that: the handover is `imageHeight - LAYOUT.appBar`, and
// the inset cancels out of it, because the hero adds the inset to its height
// and the bar reserves the same inset above its row. Frozen at exactly that
// scroll offset, on a notched device: the bar must be fully handed over —
// solid, titled, dark chevron — with the photo's bottom edge landing on the
// bar's, no strip of photo left below it and no fade still in progress. Any
// inset left in the collapse math shows up here as one or the other.
export const AtHandoverWithInset: Story = {
    name: "At handover, with inset",
    render: args => (
        <SafeAreaInsetsContext.Provider value={{ top: 59, bottom: 34, left: 0, right: 0 }}>
            <HandoverDemo {...args} onBack={() => {}} />
        </SafeAreaInsetsContext.Provider>
    )
};

// `scrollY` off the theme rather than off a literal, so the story still lands
// on the handover under a theme that sizes its bar row differently.
function HandoverDemo({ imageHeight = HERO_HEIGHT, ...bar }: ImageStatusAppBarProps) {
    const { LAYOUT } = useTheme();

    return <FrozenDemo {...bar} imageHeight={imageHeight} scrollY={imageHeight - LAYOUT.appBar} />;
}
