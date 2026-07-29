import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../theme/ThemeProvider";

// The total height an `AppBar` occupies: the bar's own row plus the
// status-bar inset it reserves above that row.
//
// `LAYOUT.appBar` on its own is only the row (see tokens.ts — "matching a
// native stack header"), which is never the number a caller wants: anything
// measuring the bar is measuring from the top of the *window*, because that
// is where the bar starts. Handing `Screen`'s `keyboardOffset` a bare
// `LAYOUT.appBar` lifts content by the inset too far on every notched device.
//
// A hook rather than a constant because the inset is a device value, and a
// hook rather than a prop on `AppBar` because the callers that need it are
// the bar's *siblings*, not its children.
//
// `large` adds a title block below the row; that block's height isn't
// included here, since nothing positions against it.
export function useAppBarHeight(): number {
    const { LAYOUT } = useTheme();
    const insets = useSafeAreaInsets();

    return LAYOUT.appBar + insets.top;
}
