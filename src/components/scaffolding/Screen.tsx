import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent, StyleProp, ViewStyle } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { useScreenLayout } from "./useScreenLayout";

// Ported from karamatch-web/src/ui.tsx's `ScrollBody` — the body of a screen,
// handling the gutter and the bottom safe-area pad. The web version measured
// its own bottom inset with a `LAYOUT.safeBottom` constant; RN reads the
// device's real inset from `react-native-safe-area-context` and leans on
// `contentInsetAdjustmentBehavior="automatic"` instead of manual top padding.
//
// `scroll={false}` swaps the ScrollView for a plain flex column, for the
// screens the web app built by hand because a scroller would have been wrong:
// a centred hero above a pinned CTA (Welcome), a map that fills the rest of
// the screen under floating controls (Location), or a message list with a
// docked composer (PartyRoom's chat pane). The gutter, gap and safe-area pad
// are identical either way — only the container changes.
//
// For a screen whose body is a list, reach for `ListScreen` instead: it puts
// the same layout on a FlatList's content container, which a wrapping view
// cannot do.
export function Screen({
    children,
    pad = true,
    bottomPad,
    gap,
    scroll = true,
    glow = false,
    avoidKeyboard = false,
    keyboardOffset = 0,
    style,
    onScroll
}: {
    children: React.ReactNode;
    pad?: boolean;
    bottomPad?: number;
    gap?: number;
    /** Set false for screens whose content fills the viewport instead of scrolling. */
    scroll?: boolean;
    /**
     * Lays one soft brand bloom behind the content. Off by default: it is a
     * first-run flourish, and stacking it under a list just reads as fog.
     */
    glow?: boolean;
    /**
     * Keep content clear of the on-screen keyboard. Opt-in, because the
     * mechanism costs a layout node on screens that have no text input.
     */
    avoidKeyboard?: boolean;
    /**
     * Height of any chrome between the top of the window and this screen —
     * an `AppBar`, typically. `KeyboardAvoidingView` measures from the window,
     * so without this the content lifts by that much too far. Only read when
     * `avoidKeyboard` is set on a non-scrolling screen.
     */
    keyboardOffset?: number;
    style?: StyleProp<ViewStyle>;
    /** Scroll offset in px, for screens with a collapsing header. Ignored when `scroll` is false. */
    onScroll?: (offset: number) => void;
}) {
    const layout = useScreenLayout({ pad, bottomPad, gap });

    // Both branches below return through this, so the wash sits behind the
    // scroller and the plain column alike.
    const withGlow = (body: React.ReactNode) =>
        glow ? (
            <View style={{ flex: 1 }}>
                <BrandWash />
                {body}
            </View>
        ) : (
            body
        );

    // No scroller: the layout goes on the view itself so children can size
    // against it — `flex: 1` on a child, or an absolutely filled map. Nothing
    // here can scroll a focused input into view, so covering the keyboard is
    // KeyboardAvoidingView's job.
    if (!scroll) {
        const body = <View style={[{ flex: 1 }, layout, style]}>{children}</View>;

        return avoidKeyboard ? (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                // Android resizes the window itself under `adjustResize`, so
                // padding it a second time double-counts the keyboard.
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={keyboardOffset}
            >
                {body}
            </KeyboardAvoidingView>
        ) : (
            body
        );
    }

    const handleScroll = onScroll
        ? (event: NativeSyntheticEvent<NativeScrollEvent>) => onScroll(event.nativeEvent.contentOffset.y)
        : undefined;

    return withGlow(
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[layout, style]}
            contentInsetAdjustmentBehavior="automatic"
            // A scroller can lift its own content, so it needs no
            // KeyboardAvoidingView — this insets the scroll view on iOS and
            // keeps the focused field reachable. Android gets the same effect
            // from `adjustResize`.
            automaticallyAdjustKeyboardInsets={avoidKeyboard}
            // Without this, the first tap on a button while the keyboard is up
            // is swallowed by the dismiss.
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            onScroll={handleScroll}
            scrollEventThrottle={handleScroll ? 16 : undefined}
            showsVerticalScrollIndicator={false}
        >
            {children}
        </ScrollView>
    );
}

// Ported from karamatch-web/src/screens/Welcome.tsx, which drew this as a CSS
// radial-gradient on the screen itself. The old screen stacked two radial
// gradients and a glow; at phone size that just read as fog, so this is the one
// bloom that survived — sized and placed exactly as the web left it.
function BrandWash() {
    const { C } = useTheme();
    const wash = "radial-gradient(ellipse 420px 340px at 50% 22%, " + C.tintGlow + ", transparent 70%)";

    return (
        <View
            pointerEvents="none"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // react-native-web has no special case for `experimental_backgroundImage`
                // (a Fabric/native-only style prop name) — it passes the key straight
                // through as an invalid CSS property, so the wash silently no-ops there.
                // `backgroundImage` is the real CSS property and DOES work on web.
                ...(Platform.OS === "web" ? { backgroundImage: wash } : { experimental_backgroundImage: wash })
            }}
        />
    );
}
