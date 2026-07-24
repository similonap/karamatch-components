import { Platform, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";

// Ported from karamatch-web/src/ui.tsx's `BrandMark` — a brand mark tile,
// the app icon essentially.
export function BrandMark({ size = 72, radius }: { size?: number; radius?: number }) {
    const { C, GRAD_TILE } = useTheme();
    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: radius ?? Math.round(size * 0.28),
                borderCurve: "continuous",
                // react-native-web doesn't translate `experimental_backgroundImage` (a Fabric/native-only
                // style prop name) into real CSS, so it silently no-ops there — `backgroundImage` is the
                // actual CSS property name and works on web.
                ...(Platform.OS === "web" ? { backgroundImage: GRAD_TILE } : { experimental_backgroundImage: GRAD_TILE }),
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 40px " + C.tintGlow
            }}
        >
            <Icon name="mic" size={Math.round(size * 0.5)} color="#fff" solid />
        </View>
    );
}
