import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { SongArt } from "./SongArt";

// A decorator rather than a per-story `render`, so an args-only story below
// gets the same framing instead of Storybook's bare default renderer.
function Backdrop({ children }: { children: React.ReactNode }) {
    const { C, S } = useTheme();
    return <View style={{ padding: S.lg, backgroundColor: C.surface }}>{children}</View>;
}

const meta: Meta<typeof SongArt> = {
    title: "Primitives/SongArt",
    component: SongArt,
    decorators: [Story => <Backdrop><Story /></Backdrop>],
    args: { size: 48 }
};

export default meta;
type Story = StoryObj<typeof SongArt>;

export const Fallback: Story = {};

export const WithCoverArt: Story = {
    args: { coverArt: "https://coverartarchive.org/release/76df3287-6cda-33eb-8e9a-044b5e15ffdd/829521842-250.jpg" }
};
