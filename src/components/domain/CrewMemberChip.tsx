import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import { AppPressable } from "../primitives/AppPressable";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";

export type CrewMemberChipProps = {
    /** Only seeds the fallback avatar colour, so either id flavour works. */
    id: string | number;
    name: string;
    photoUrl?: string | null;
    role: "host" | "member";
    /** Drives the glyph on a non-host: paid shows a check, else a clock. */
    paid: boolean;
    isMe: boolean;
    onPress?: () => void;
};

// Ported from karamatch-web/src/screens/PartyRoom.tsx's inline crew pills —
// a joined member (avatar + first name/"You" + role glyph) and a dashed
// "invited, not joined yet" placeholder. Two different shapes (the invited
// one has no avatar and isn't tappable), so two exports from one file.
export function CrewMemberChip({ id, name, photoUrl, role, paid, isMe, onPress }: CrewMemberChipProps) {
    const { C, CTRL, RADII } = useTheme();

    return (
        <AppPressable
            onPress={onPress}
            press="control"
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                backgroundColor: C.surface1,
                borderWidth: CTRL.border.regular,
                borderColor: C.border,
                borderRadius: RADII.pill,
                paddingVertical: 4,
                paddingLeft: 4,
                paddingRight: 11
            }}
        >
            <Avatar name={name} photoUrl={photoUrl} seed={id} size={24} />
            <AppText variant="captionStrong">{isMe ? "You" : name.split(" ")[0]}</AppText>
            {role === "host" ? (
                <Icon name="crown" size={12} color={C.gold} />
            ) : paid ? (
                <Icon name="check" size={12} weight="strong" color={C.green} />
            ) : (
                <Icon name="clock" size={12} color={C.textFaint} />
            )}
        </AppPressable>
    );
}

export function InvitedMemberChip({ username }: { username: string }) {
    const { C, CTRL, DECOR, RADII } = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                borderWidth: CTRL.border.regular,
                borderStyle: DECOR.placeholderBorder,
                borderColor: C.borderStrong,
                borderRadius: RADII.pill,
                paddingVertical: 6,
                paddingHorizontal: 11
            }}
        >
            <AppText variant="footnote">@{username}</AppText>
            <AppText variant="footnote" tone="cyan">
                invited
            </AppText>
        </View>
    );
}
