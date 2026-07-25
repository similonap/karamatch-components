import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { ThemeProvider, useTheme } from "./ThemeProvider";
import type { Theme } from "./createTheme";
import { BUILT_IN_THEMES } from "./themes";
import { Avatar } from "../components/primitives/Avatar";
import { AvatarStack } from "../components/primitives/AvatarStack";
import { BrandMark } from "../components/primitives/BrandMark";
import { Button } from "../components/primitives/Button";
import { Card } from "../components/primitives/Card";
import { Chip } from "../components/primitives/Chip";
import { Divider } from "../components/primitives/Divider";
import { EmptyState } from "../components/primitives/EmptyState";
import { Group } from "../components/primitives/Group";
import { IconTile } from "../components/primitives/IconTile";
import { ListRow } from "../components/primitives/ListRow";
import { OptionPill } from "../components/primitives/OptionPill";
import { Rating } from "../components/primitives/Rating";
import { SearchField } from "../components/primitives/SearchField";
import { Section } from "../components/primitives/Section";
import { Segmented } from "../components/primitives/Segmented";
import { StarInput } from "../components/primitives/StarInput";
import { StepHeader } from "../components/primitives/StepHeader";
import { TextField } from "../components/primitives/TextField";
import { Toggle } from "../components/primitives/Toggle";
import { Wordmark } from "../components/primitives/Wordmark";
import { SongRow } from "../components/domain/SongRow";
import { MOCK_MATCHED_USER, MOCK_SONGS, MOCK_USER } from "../mocks/data";

// Not a component story — a story *about the theme*. The Theme addon panel
// switches which theme the whole shelf renders in; these four make that
// visible: one busy screen under the live theme, all three side by side, the
// token values themselves, and an in-app picker driving `setTheme`/`setMode`.
const meta: Meta = {
    title: "Theme/Theming",
    parameters: { controls: { disable: true } }
};

export default meta;
type Story = StoryObj;

// ---------------------------------------------------------------------------
// A screenful of the shelf, for eyeballing a theme all at once
// ---------------------------------------------------------------------------

function Kitchen() {
    const { C, LAYOUT, S, S2 } = useTheme();
    const [tab, setTab] = useState<"open" | "mine">("open");
    const [query, setQuery] = useState("");
    const [note, setNote] = useState("");
    const [stars, setStars] = useState(4);
    const [on, setOn] = useState(true);
    const [pick, setPick] = useState("21:00");
    const [scheme, setScheme] = useState("dark");
    const [song, setSong] = useState(MOCK_SONGS[0].id);

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: C.bg }}
            contentContainerStyle={{ padding: LAYOUT.gutter, gap: S.md }}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: S2.s12 }}>
                <BrandMark size={54} />
                <View style={{ gap: 2 }}>
                    <Wordmark />
                    <Text style={{ color: C.textMuted }}>Every surface below is theme-driven.</Text>
                </View>
            </View>

            <StepHeader step={2} total={3} title="Pick a room" subtitle="Two spots left for tonight." />

            <Segmented
                items={[
                    { key: "open" as const, label: "Open" },
                    { key: "mine" as const, label: "Mine", dot: true }
                ]}
                value={tab}
                onChange={setTab}
            />

            <SearchField value={query} onChange={setQuery} placeholder="Search songs…" />

            <View style={{ flexDirection: "row", gap: S.sm }}>
                <Button label="Join" onPress={() => {}} style={{ flex: 1 }} />
                <Button label="Invite" variant="tinted" onPress={() => {}} style={{ flex: 1 }} />
            </View>
            <View style={{ flexDirection: "row", gap: S.sm }}>
                <Button label="Cancel" variant="secondary" size="md" onPress={() => {}} style={{ flex: 1 }} />
                <Button label="Leave" variant="danger" size="md" onPress={() => {}} style={{ flex: 1 }} />
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: S.xs }}>
                <Chip label="4 spots" tone="cyan" icon="users" />
                <Chip label="Host" tone="tint" icon="crown" />
                <Chip label="Rated" tone="green" icon="check" />
                <Chip label="Selected" selected />
            </View>

            <View style={{ flexDirection: "row", gap: S.sm }}>
                {["20:00", "21:00", "22:00"].map(time => (
                    <OptionPill key={time} label={time} sub="2h" selected={pick === time} onPress={() => setPick(time)} />
                ))}
            </View>

            <Card>
                <View style={{ flexDirection: "row", alignItems: "center", gap: S2.s12 }}>
                    <Avatar name={MOCK_USER.name} seed={MOCK_USER.id} size={44} ring />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: C.text }}>{MOCK_USER.name}</Text>
                        <Text style={{ color: C.textMuted }}>@{MOCK_USER.username}</Text>
                    </View>
                    <Rating value={4.6} />
                </View>
                <Divider />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: S.sm }}>
                    <AvatarStack people={[MOCK_USER, MOCK_MATCHED_USER, { name: "Ines" }, { name: "Rui" }, { name: "Ada" }]} />
                    <Toggle on={on} onChange={setOn} label="Notify me" />
                </View>
            </Card>

            <Section title="Favourites">
                {MOCK_SONGS.slice(0, 2).map(item => (
                    <SongRow key={item.id} song={item} selected={song === item.id} onToggle={() => setSong(item.id)} />
                ))}
            </Section>

            <Group title="Settings">
                <ListRow icon="bell" title="Notifications" value="On" chevron />
                <ListRow icon="card" title="Payment" subtitle="•••• 4242" chevron last />
            </Group>

            <View style={{ flexDirection: "row", gap: S.sm }}>
                <IconTile icon="moon" label="Dark" selected={scheme === "dark"} onPress={() => setScheme("dark")} />
                <IconTile icon="sun" label="Light" selected={scheme === "light"} onPress={() => setScheme("light")} />
            </View>

            <StarInput value={stars} onChange={setStars} />
            <TextField label="Review" value={note} onChange={setNote} placeholder="How was the night?" multiline />

            <Card padded={false}>
                <EmptyState icon="music" title="No songs yet" body="Pick a few and your crew can match on them." />
            </Card>
        </ScrollView>
    );
}

export const Showcase: Story = {
    render: () => <Kitchen />
};

// ---------------------------------------------------------------------------
// All three at once
// ---------------------------------------------------------------------------

// Nesting a `ThemeProvider` inside another one is legal and scoped, which is
// what makes a side-by-side comparison possible at all — each block below
// renders the same components under a different theme.
function ThemeBlock({ theme }: { theme: Theme }) {
    const { C, LAYOUT, S, S2, T } = useTheme();
    const [selected, setSelected] = useState(false);

    return (
        <View style={{ backgroundColor: C.bg, padding: LAYOUT.gutter, gap: S.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: S2.s12 }}>
                <BrandMark size={40} />
                <View style={{ flex: 1 }}>
                    <Text style={[T.heading, { color: C.text }]}>{theme.label}</Text>
                    <Text style={[T.footnote, { color: C.textMuted }]}>{theme.name}</Text>
                </View>
                <Chip label="Live" tone="cyan" />
            </View>
            <Card>
                <Text style={[T.bodyStrong, { color: C.text }]}>Neon Karaoke Bar</Text>
                <Text style={[T.caption, { color: C.textMuted }]}>Tonight · 4 spots open</Text>
                <View style={{ flexDirection: "row", gap: S.sm, marginTop: S.sm }}>
                    <Button label="Join" size="md" onPress={() => {}} style={{ flex: 1 }} />
                    <Button label="Details" variant="secondary" size="md" onPress={() => {}} style={{ flex: 1 }} />
                </View>
            </Card>
            <OptionPill label="Tap to select" selected={selected} onPress={() => setSelected(!selected)} />
        </View>
    );
}

export const SideBySide: Story = {
    render: () => {
        const { scheme } = useTheme();
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {BUILT_IN_THEMES.map(theme => (
                    <ThemeProvider key={theme.name} theme={theme} initialMode={scheme}>
                        <ThemeBlock theme={theme} />
                    </ThemeProvider>
                ))}
            </ScrollView>
        );
    }
};

// ---------------------------------------------------------------------------
// The tokens themselves
// ---------------------------------------------------------------------------

function Swatch({ name, value }: { name: string; value: string }) {
    const { C, CTRL, RADII, T } = useTheme();
    return (
        <View style={{ width: 96, gap: 4 }}>
            <View
                style={{
                    height: 40,
                    borderRadius: RADII.tile,
                    backgroundColor: value,
                    borderWidth: CTRL.border.regular,
                    borderColor: C.border
                }}
            />
            <Text style={[T.footnote, { color: C.textMuted }]} numberOfLines={1}>
                {name}
            </Text>
        </View>
    );
}

export const Tokens: Story = {
    render: () => {
        const { C, CTRL, DECOR, LAYOUT, RADII, S, T, themeName, scheme } = useTheme();
        const colors: [string, string][] = [
            ["bg", C.bg],
            ["surface1", C.surface1],
            ["surface2", C.surface2],
            ["surface3", C.surface3],
            ["text", C.text],
            ["textMuted", C.textMuted],
            ["tint", C.tint],
            ["tintSoft", C.tintSoft],
            ["selectBg", C.selectBg],
            ["cyan", C.cyan],
            ["green", C.green],
            ["gold", C.gold],
            ["danger", C.danger],
            ["track", C.track]
        ];
        const ramp: [string, keyof typeof T][] = [
            ["display", "display"],
            ["title", "title"],
            ["heading", "heading"],
            ["bodyStrong", "bodyStrong"],
            ["body", "body"],
            ["caption", "caption"],
            ["sectionHeader", "sectionHeader"]
        ];

        return (
            <ScrollView
                style={{ flex: 1, backgroundColor: C.bg }}
                contentContainerStyle={{ padding: LAYOUT.gutter, gap: S.lg }}
                showsVerticalScrollIndicator={false}
            >
                <Section title={themeName + " · " + scheme}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: S.sm }}>
                        {colors.map(([name, value]) => (
                            <Swatch key={name} name={name} value={value} />
                        ))}
                    </View>
                </Section>

                <Section title="Type">
                    {ramp.map(([label, role]) => (
                        <Text key={label} style={[T[role], { color: C.text }]}>
                            {label}
                        </Text>
                    ))}
                </Section>

                <Section title="Radii">
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: S.sm }}>
                        {(Object.entries(RADII) as [string, number][]).map(([name, value]) => (
                            <View key={name} style={{ alignItems: "center", gap: 4, width: 72 }}>
                                <View
                                    style={{
                                        width: 56,
                                        height: 40,
                                        borderRadius: Math.min(value, 20),
                                        backgroundColor: C.surface2,
                                        borderWidth: CTRL.border.regular,
                                        borderColor: C.borderStrong
                                    }}
                                />
                                <Text style={[T.footnote, { color: C.textMuted }]}>
                                    {name} {value}
                                </Text>
                            </View>
                        ))}
                    </View>
                </Section>

                <Section title="Decor">
                    <Text style={[T.caption, { color: C.textDim }]}>
                        primaryFill {DECOR.primaryFill} · glow {DECOR.glow} · iconStroke {DECOR.iconStroke} · border{" "}
                        {CTRL.border.regular}/{CTRL.border.strong} · buttonHeight {CTRL.buttonHeight.lg}
                    </Text>
                </Section>
            </ScrollView>
        );
    }
};

// ---------------------------------------------------------------------------
// Switching at runtime
// ---------------------------------------------------------------------------

// What an app's own appearance setting looks like: `setTheme` and `setMode`
// come straight off `useTheme()`, no remount and no prop drilling.
export const Switcher: Story = {
    render: () => {
        const { C, LAYOUT, S, T, themeName, themes, setTheme, mode, setMode } = useTheme();
        return (
            <View style={{ flex: 1, backgroundColor: C.bg, padding: LAYOUT.gutter, gap: S.md }}>
                <Section title="Theme">
                    <Segmented
                        items={themes.map(entry => ({ key: entry.name, label: entry.label.split(" ")[0] }))}
                        value={themeName}
                        onChange={setTheme}
                    />
                </Section>
                <Section title="Appearance">
                    <Segmented
                        items={[
                            { key: "system" as const, label: "System" },
                            { key: "dark" as const, label: "Dark" },
                            { key: "light" as const, label: "Light" }
                        ]}
                        value={mode}
                        onChange={setMode}
                    />
                </Section>
                <Card highlight>
                    <Text style={[T.bodyStrong, { color: C.text }]}>Live: {themeName}</Text>
                    <Text style={[T.caption, { color: C.textMuted }]}>
                        The Theme addon panel sets the story's starting point; these controls take over from it.
                    </Text>
                    <View style={{ marginTop: S.sm }}>
                        <Button label="Primary action" onPress={() => {}} />
                    </View>
                </Card>
            </View>
        );
    }
};
