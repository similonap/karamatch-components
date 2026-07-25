import { useRef } from "react";
import type { ReactNode } from "react";
import { Animated, Pressable } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import type { PressRole } from "../../theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Ported from karamatch-web/src/ui.tsx's `Pressable`, the foundation of every
// touchable in the shelf. The web version faked RN's press feedback with
// pointer events + a CSS transition; here it's the real thing — RN's own
// `Pressable` for hit-testing/`disabled`, `Animated.timing` on scale +
// opacity for the dip.
//
// How far it dips is a theme decision, not a per-call-site one: callers name
// the *kind* of thing being pressed via `press` and the theme's `MOTION.press`
// map supplies the numbers (see theme/tokens.ts). That's what lets one theme
// squash a button to 0.94 over 90ms and another refuse to scale at all.
//
// One native difference worth knowing: unlike the DOM, a touch's responder is
// claimed by the innermost `Pressable`, so nesting one AppPressable inside
// another (e.g. a Button inside a tappable Card) does not also fire the
// outer one — the web version's `stopPropagation` prop has no RN equivalent
// to port because the problem it worked around doesn't exist here.
export function AppPressable({
    onPress,
    disabled,
    style,
    children,
    press = "control",
    scaleTo,
    opacityTo,
    accessibilityLabel,
    hitSlop
}: {
    onPress?: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    children: ReactNode;
    /**
     * What's being pressed, which the theme turns into a dip:
     * `button` · `control` (default, small tappables) · `snap` (tiny targets,
     * biggest dip) · `surface` (cards, tiles) · `row` (full-bleed rows —
     * "row" never scales) · `none`.
     */
    press?: PressRole;
    /** Escape hatch past the theme's scale for this one press. */
    scaleTo?: number;
    opacityTo?: number;
    accessibilityLabel?: string;
    hitSlop?: number;
}) {
    const { MOTION } = useTheme();
    const feedback = MOTION.press[press];
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const animateTo = (toScale: number, toOpacity: number, duration: number) => {
        Animated.parallel([
            Animated.timing(scale, { toValue: toScale, duration, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: toOpacity, duration, useNativeDriver: true })
        ]).start();
    };

    // A single animated node, not `Pressable` wrapping an `Animated.View` —
    // splitting `style` across two nodes broke callers whose style does both
    // jobs at once (e.g. a `flex` that sizes this pressable within its own
    // parent row, alongside a `flexDirection` that arranges its children).
    return (
        <AnimatedPressable
            onPress={onPress}
            disabled={disabled}
            hitSlop={hitSlop}
            accessibilityLabel={accessibilityLabel}
            onPressIn={() => animateTo(scaleTo ?? feedback.scale, opacityTo ?? feedback.opacity, MOTION.pressInMs)}
            onPressOut={() => animateTo(1, 1, MOTION.pressOutMs)}
            style={[style, { opacity: disabled ? 0.45 : opacity, transform: [{ scale }] }]}
        >
            {children}
        </AnimatedPressable>
    );
}
