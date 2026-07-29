import { useTheme } from "../theme/ThemeProvider";
import { Icon } from "./Icon";
import type { IconName } from "./types";

// The selection idiom from karamatch-web/src/screens/MainTabs.tsx's `TabBar`:
// a tab's glyph is the outline form in `textMuted` until it is selected, then
// the filled form in `tint`. Two things change at once, and getting only one
// of them right is the usual bug — hence a component rather than a note.
//
// Glyph only, no label: `BottomTabBar` draws its own `AppText` (whose weight
// shifts with selection too), and Expo Router's `tabBarIcon` option is handed
// the icon slot alone, with the label coming from the route's `title`. That
// callback's `{ focused, color }` arguments map straight onto `selected` and
// `color`:
//
//   tabBarIcon: ({ focused, color }) => <TabIcon name="pin" selected={focused} color={color} />
//
// Passing `color` through lets a navigator that already resolves its own
// active/inactive tint stay in charge of it; omit it and the theme decides.
export function TabIcon({
    name,
    selected = false,
    size = 24,
    color
}: {
    name: IconName;
    /** Draws the filled glyph in the tint colour. */
    selected?: boolean;
    size?: number;
    /** Overrides the theme's selected/unselected pair — for a navigator that owns its tints. */
    color?: string;
}) {
    const { C } = useTheme();

    return <Icon name={name} size={size} solid={selected} color={color ?? (selected ? C.tint : C.textMuted)} />;
}
