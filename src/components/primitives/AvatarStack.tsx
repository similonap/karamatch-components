import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "./AppText";
import { Avatar } from "./Avatar";

// Ported from karamatch-web/src/ui.tsx's `AvatarStack` — overlapping
// avatars, for "who is in this party".
export function AvatarStack({
    people,
    max = 4,
    size = 28
}: {
    people: { name: string; photoUrl?: string | null; id?: string | number }[];
    max?: number;
    size?: number;
}) {
    const { C, CTRL, RADII } = useTheme();
    const ring = "0 0 0 " + CTRL.avatarRing + "px ";
    const shown = people.slice(0, max);
    const extra = people.length - shown.length;

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            {shown.map((person, index) => (
                <View
                    key={person.id ?? person.name + index}
                    style={{
                        marginLeft: index === 0 ? 0 : -size * 0.32,
                        borderRadius: Math.min(RADII.avatar, size / 2),
                        boxShadow: ring + C.surface1,
                        zIndex: shown.length - index
                    }}
                >
                    <Avatar name={person.name} photoUrl={person.photoUrl} seed={person.id ?? person.name} size={size} />
                </View>
            ))}
            {extra > 0 ? (
                <View
                    style={{
                        marginLeft: -size * 0.32,
                        width: size,
                        height: size,
                        borderRadius: Math.min(RADII.avatar, size / 2),
                        backgroundColor: C.surface3,
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: ring + C.surface1
                    }}
                >
                    <AppText weight="bold" size={Math.round(size * 0.34)} tone="textDim" lineHeight={Math.round(size * 0.34 * 1.2)}>
                        +{extra}
                    </AppText>
                </View>
            ) : null}
        </View>
    );
}
