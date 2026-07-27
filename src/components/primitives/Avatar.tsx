import { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";

import { useTheme } from "../../theme/ThemeProvider";
import { avatarColor, initial } from "../../utils/avatar";
import { AppText } from "./AppText";

// Ported from karamatch-web/src/ui.tsx's `Avatar`. `expo-image` replaces the
// web `<img>`; its `onError` gives the same broken-photo fallback to the
// initial.
export function Avatar({
    name,
    photoUrl,
    seed,
    size = 40,
    ring
}: {
    name: string;
    photoUrl?: string | null;
    seed?: string | number;
    size?: number;
    ring?: boolean;
}) {
    const { AVATARS, C, CTRL, RADII } = useTheme();
    const [broken, setBroken] = useState(false);
    const ringWidth = CTRL.avatarRing;
    const showPhoto = photoUrl && !broken;

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: Math.min(RADII.avatar, size / 2),
                backgroundColor: avatarColor(seed ?? name, AVATARS),
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: ring
                    ? "0 0 0 " + ringWidth + "px " + C.surface + ", 0 0 0 " + ringWidth * 2 + "px " + C.tint
                    : undefined
            }}
        >
            {showPhoto ? (
                <Image
                    source={{ uri: photoUrl }}
                    onError={() => setBroken(true)}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                />
            ) : (
                <AppText weight="bold" size={Math.round(size * 0.38)} tone="onAvatar" lineHeight={Math.round(size * 0.38 * 1.2)}>
                    {initial(name)}
                </AppText>
            )}
        </View>
    );
}
