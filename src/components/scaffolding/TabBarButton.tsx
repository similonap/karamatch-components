import type { StyleProp, ViewStyle } from "react-native";

import { TabIcon } from "../../icons/TabIcon";
import type { IconName } from "../../icons/types";
import { AppPressable } from "../primitives/AppPressable";
import { AppText } from "../primitives/AppText";

/**
 * A press handler that tolerates being handed an event it ignores.
 *
 * React Navigation types its tab `onPress` as taking a mouse/gesture event
 * (for the web `<a href>` case) even though the handler it actually supplies
 * takes no arguments and never reads one. A plain `() => void` here would
 * reject that handler outright — "target signature provides too few
 * arguments" — so the parameter list stays open and the handler is called with
 * none. `null` is allowed because React Navigation's `onLongPress` is
 * `handler | null | undefined`, and rejecting it would break prop spreading.
 */
type TabPressHandler = ((...args: never[]) => void) | null;

// One whole tab: the glyph, the label under it, and the press target around
// both — extracted from `BottomTabBar`, which now renders these rather than
// laying out its own. Selection moves the glyph from outline to filled, the
// colour from `textMuted` to `tint`, and the label from medium to bold.
//
// Built to drop straight into React Navigation / Expo Router's `tabBarButton`
// option, which replaces the icon *and* the label with a single element —
// unlike `tabBarIcon`, which only fills the glyph slot:
//
//   <Tabs.Screen
//       name="index"
//       options={{
//           tabBarButton: props => <TabBarButton {...props} icon="pin" label="Venues" />
//       }}
//   />
//
// Spreading works because the props React Navigation passes are accepted
// under their own names: `aria-selected` for the focused state, plus
// `onPress`, `onLongPress` and `style`. Everything else it passes — including
// the `children` holding the default icon and label — is ignored, which is the
// point of taking over the slot.
export function TabBarButton({
    icon,
    label,
    selected,
    "aria-selected": ariaSelected,
    onPress,
    onLongPress,
    accessibilityLabel,
    showLabel = true,
    style
}: {
    icon: IconName;
    label: string;
    /** Selected state. Falls back to `aria-selected` so a navigator's props can be spread in. */
    selected?: boolean;
    "aria-selected"?: boolean;
    onPress?: TabPressHandler;
    onLongPress?: TabPressHandler;
    /** Defaults to `label`. */
    accessibilityLabel?: string;
    /** Set false for a glyph-only tab. The label still reaches screen readers. */
    showLabel?: boolean;
    style?: StyleProp<ViewStyle>;
}) {
    const on = selected ?? ariaSelected ?? false;

    return (
        <AppPressable
            onPress={onPress ?? undefined}
            onLongPress={onLongPress ?? undefined}
            press="snap"
            accessibilityLabel={accessibilityLabel ?? label}
            // What the default React Navigation button reports, and what a bare
            // pressable would drop: a tab that never says it is the selected one.
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            // Caller's style last: inside a navigator's bar, the bar owns the
            // per-tab flex and padding, and it has measured them against the
            // other tabs.
            style={[{ flex: 1, alignItems: "center", justifyContent: "center", gap: 3 }, style]}
        >
            <TabIcon name={icon} selected={on} />
            {showLabel ? (
                <AppText variant="tab" weight={on ? "bold" : "medium"} tone={on ? "tint" : "textMuted"}>
                    {label}
                </AppText>
            ) : null}
        </AppPressable>
    );
}
