import { useEffect, useRef } from "react";
import { Animated } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppPressable } from "./AppPressable";

// Ported from karamatch-web/src/ui.tsx's `Toggle` — one switch geometry for
// both platforms, per the identical-design brief. The web version animated
// the thumb's `left` with a CSS transition; RN animates the same distance as
// a `translateX` on the native driver instead.
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (on: boolean) => void; label: string }) {
    const { C, CTRL, RADII, MOTION, SHADOW } = useTheme();
    const { width, height, thumb, inset } = CTRL.toggle;
    const progress = useRef(new Animated.Value(on ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(progress, { toValue: on ? 1 : 0, duration: MOTION.toggleMs, useNativeDriver: true }).start();
    }, [on, progress, MOTION.toggleMs]);

    // The thumb travels the track minus its own width and both insets, so the
    // switch stays symmetrical at any theme's geometry.
    const travel = width - thumb - inset * 2;
    const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, travel] });

    return (
        <AppPressable
            onPress={() => onChange(!on)}
            accessibilityLabel={label}
            press="row"
            style={{
                width,
                height,
                borderRadius: Math.min(RADII.round, height / 2),
                borderCurve: "continuous",
                backgroundColor: on ? C.green : C.surface3,
                borderWidth: on ? 0 : CTRL.border.regular,
                borderColor: C.border
            }}
        >
            <Animated.View
                style={{
                    width: thumb,
                    height: thumb,
                    borderRadius: Math.min(RADII.round, thumb / 2),
                    backgroundColor: C.knob,
                    // A hairline as well as the shadow: a theme with no
                    // elevation still needs the knob to read against the track.
                    borderWidth: CTRL.border.hairline,
                    borderColor: C.border,
                    position: "absolute",
                    top: inset,
                    left: inset,
                    boxShadow: SHADOW.e1,
                    transform: [{ translateX }]
                }}
            />
        </AppPressable>
    );
}
