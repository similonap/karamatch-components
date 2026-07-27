import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import type { TypeRole } from "../../theme/tokens";
import { AppText } from "./AppText";
import type { TextTone } from "./AppText";

// Every role in the ramp, in the order it reads as a hierarchy: the eleven
// karamatch-web set inline on every screen, then the six this shelf added for
// the controls the web styled ad hoc.
const WEB_RAMP: TypeRole[] = [
    "display",
    "title",
    "heading",
    "navTitle",
    "bodyStrong",
    "body",
    "callout",
    "caption",
    "captionStrong",
    "footnote",
    "sectionHeader"
];

const SHELF_RAMP: TypeRole[] = ["button", "chip", "tab", "input", "numeric", "wordmark"];

const TONES: TextTone[] = [
    "text",
    "textDim",
    "textMuted",
    "textFaint",
    "tint",
    "tintSoft",
    "tintPale",
    "cyan",
    "green",
    "gold",
    "danger",
    "purple"
];

function Backdrop({ children }: { children: React.ReactNode }) {
    const { C, S } = useTheme();
    return <View style={{ padding: S.lg, backgroundColor: C.surface, gap: S.sm }}>{children}</View>;
}

const meta: Meta<typeof AppText> = {
    title: "Primitives/AppText",
    component: AppText,
    decorators: [Story => <Backdrop><Story /></Backdrop>],
    argTypes: {
        variant: { control: "select", options: [...WEB_RAMP, ...SHELF_RAMP] },
        tone: { control: "select", options: TONES },
        weight: { control: "select", options: [undefined, "regular", "medium", "bold", "extraBold"] },
        align: { control: "select", options: [undefined, "left", "center", "right"] },
        truncate: { control: "boolean" }
    },
    args: {
        children: "Neon Nights Karaoke",
        variant: "body",
        truncate: false
    }
};

export default meta;
type Story = StoryObj<typeof AppText>;

export const Default: Story = {};

/** The eleven roles karamatch-web carried, every one theme-driven here. */
export const Ramp: Story = {
    render: () => {
        const { S } = useTheme();
        return (
            <View style={{ gap: S.sm }}>
                {WEB_RAMP.map(variant => (
                    <View key={variant} style={{ gap: 2 }}>
                        <AppText variant="footnote" tone="textFaint">
                            {variant}
                        </AppText>
                        <AppText variant={variant}>Karaoke near you</AppText>
                    </View>
                ))}
            </View>
        );
    }
};

/** The roles this shelf added, for controls the web styled inline. */
export const ControlRoles: Story = {
    render: () => {
        const { S } = useTheme();
        return (
            <View style={{ gap: S.sm }}>
                {SHELF_RAMP.map(variant => (
                    <View key={variant} style={{ gap: 2 }}>
                        <AppText variant="footnote" tone="textFaint">
                            {variant}
                        </AppText>
                        <AppText variant={variant}>Book this room</AppText>
                    </View>
                ))}
            </View>
        );
    }
};

export const Tones: Story = {
    render: () => (
        <>
            {TONES.map(tone => (
                <AppText key={tone} variant="bodyStrong" tone={tone}>
                    {tone}
                </AppText>
            ))}
        </>
    )
};

/**
 * `weight` swaps the registered family rather than setting `fontWeight` —
 * React Native can't synthesise a weight onto a font file the way CSS fakes
 * one, so asking for 600 on a 400 file silently renders 400 (or Helvetica).
 */
export const Weights: Story = {
    render: () => (
        <>
            <AppText weight="regular">regular · Outfit 400</AppText>
            <AppText weight="medium">medium · Outfit 500</AppText>
            <AppText weight="bold">bold · Outfit 700</AppText>
            <AppText weight="extraBold">extraBold · Outfit 800</AppText>
        </>
    )
};

/** `size` rescales the leading with it, so an overridden role keeps its shape. */
export const SizeOverride: Story = {
    render: () => (
        <>
            <AppText variant="bodyStrong">bodyStrong at its ramp size (15)</AppText>
            <AppText variant="bodyStrong" size={16}>
                bodyStrong at 16, the override the web used on every card title
            </AppText>
            <AppText variant="title" size={20}>
                title at 20
            </AppText>
        </>
    )
};

/** Truncation only works if the label can shrink — `truncate` handles both. */
export const Truncation: Story = {
    render: () => {
        const { C, S } = useTheme();
        return (
            <View style={{ gap: S.sm }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm, backgroundColor: C.surface2, padding: S.sm }}>
                    <AppText truncate>A venue name far too long to fit beside its price</AppText>
                    <AppText variant="captionStrong" tone="cyan">
                        €12/hr
                    </AppText>
                </View>
                <AppText variant="caption" numberOfLines={2}>
                    Two lines, then ellipsis — the same body copy a venue description or a review would carry, running past
                    the height it has been given so the clamp is visible.
                </AppText>
            </View>
        );
    }
};
