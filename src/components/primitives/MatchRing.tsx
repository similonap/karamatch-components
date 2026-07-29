import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/screens/tabs/MatchTab.tsx's inline `MatchRing`
// — taste compatibility drawn as a dial rather than MatchBadge's pill, for the
// one spot per card where the number is the headline rather than metadata.
//
// The web drew this with a `conic-gradient` and hid the middle under a
// surface-coloured disc. React Native has no conic gradient, so this strokes an
// SVG circle and walks `strokeDashoffset` instead — which also leaves the
// middle genuinely transparent, so the ring sits on any surface rather than
// only the one it was told to imitate.

/** At or above this, a match is "strong" and takes the tint. Same cut as MatchBadge. */
const STRONG = 60;

/** The web's 56pt ring had a 45pt hole; keeping the ratio holds the look at any size. */
const THICKNESS_RATIO = 0.098;

export function MatchRing({
    pct,
    size = 56,
    thickness
}: {
    pct: number;
    size?: number;
    /** Ring weight. Defaults to a fixed fraction of `size`. */
    thickness?: number;
}) {
    const { C } = useTheme();
    // A percentage out of range would draw an arc longer than the circle.
    const clamped = Math.max(0, Math.min(100, pct));
    const strong = clamped >= STRONG;
    const stroke = thickness ?? size * THICKNESS_RATIO;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const centre = size / 2;

    return (
        <View
            style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}
            accessibilityLabel={clamped + "% taste match"}
        >
            <Svg width={size} height={size} style={{ position: "absolute" }}>
                <Circle cx={centre} cy={centre} r={radius} stroke={C.track} strokeWidth={stroke} fill="none" />
                <Circle
                    cx={centre}
                    cy={centre}
                    r={radius}
                    stroke={strong ? C.tint : C.textMuted}
                    strokeWidth={stroke}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - clamped / 100)}
                    // SVG arcs start at three o'clock; progress reads from twelve.
                    transform={"rotate(-90 " + centre + " " + centre + ")"}
                />
            </Svg>
            <AppText variant="captionStrong" size={Math.round(size * 0.23)} tone={strong ? "tintSoft" : "textMuted"}>
                {clamped}%
            </AppText>
        </View>
    );
}
