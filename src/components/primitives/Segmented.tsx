import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppPressable } from "./AppPressable";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `Segmented` — an iOS/Material-
// neutral segmented control, for switching a pane within a screen.
export function Segmented<K extends string>({
    items,
    value,
    onChange
}: {
    items: { key: K; label: string; dot?: boolean }[];
    value: K;
    onChange: (key: K) => void;
}) {
    const { C, CTRL, RADII } = useTheme();
    const pad = CTRL.segmentPad;
    const outer = Math.min(RADII.control, (CTRL.segmentHeight + pad * 2) / 2);
    // The inner radius has to shrink by the padding, or a pill-shaped
    // container ends up with square segments rattling around inside it.
    const inner = Math.min(Math.max(outer - pad, 0), CTRL.segmentHeight / 2);

    return (
        <View
            style={{
                flexDirection: "row",
                backgroundColor: C.surface2,
                borderWidth: CTRL.border.regular,
                borderColor: C.border,
                borderRadius: outer,
                borderCurve: "continuous",
                padding: pad,
                gap: 2
            }}
        >
            {items.map(item => {
                const on = item.key === value;
                return (
                    <AppPressable
                        key={item.key}
                        onPress={() => onChange(item.key)}
                        press="row"
                        style={{
                            flex: 1,
                            height: CTRL.segmentHeight,
                            borderRadius: inner,
                            borderCurve: "continuous",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            backgroundColor: on ? C.surfacePress : "transparent"
                        }}
                    >
                        <AppText variant={on ? "captionStrong" : "caption"} tone={on ? "text" : "textMuted"}>
                            {item.label}
                        </AppText>
                        {item.dot ? (
                            <View style={{ width: 6, height: 6, borderRadius: Math.min(RADII.round, 3), backgroundColor: C.tint }} />
                        ) : null}
                    </AppPressable>
                );
            })}
        </View>
    );
}
