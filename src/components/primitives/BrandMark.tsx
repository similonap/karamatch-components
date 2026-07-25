import { Platform, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { glowShadow } from "../../theme/tokens";
import { Icon } from "../../icons/Icon";

// Ported from karamatch-web/src/ui.tsx's `BrandMark` — a brand mark tile,
// the app icon essentially.
export function BrandMark({ size = 72, radius }: { size?: number; radius?: number }) {
    const { C, DECOR, GRAD_TILE, SHADOW } = useTheme();
    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: radius ?? Math.round(size * DECOR.brandRadiusRatio),
                borderCurve: "continuous",
                // react-native-web doesn't translate `experimental_backgroundImage` (a Fabric/native-only
                // style prop name) into real CSS, so it silently no-ops there — `backgroundImage` is the
                // actual CSS property name and works on web.
                ...(DECOR.primaryFill === "solid"
                    ? { backgroundColor: C.tint }
                    : Platform.OS === "web"
                      ? { backgroundImage: GRAD_TILE }
                      : { experimental_backgroundImage: GRAD_TILE }),
                alignItems: "center",
                justifyContent: "center",
                boxShadow: glowShadow(DECOR, C.tintGlow, SHADOW.e2)
            }}
        >
            <Icon name="mic" size={Math.round(size * 0.5)} color={C.onTint} solid />
        </View>
    );
}
