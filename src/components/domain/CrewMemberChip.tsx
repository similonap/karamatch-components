import { Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import type { PartyRoomMember } from "../../types";
import { AppPressable } from "../primitives/AppPressable";
import { Avatar } from "../primitives/Avatar";

// Ported from karamatch-web/src/screens/PartyRoom.tsx's inline crew pills —
// a joined member (avatar + first name/"You" + role glyph) and a dashed
// "invited, not joined yet" placeholder. Two different shapes (the invited
// one has no avatar and isn't tappable), so two exports from one file.
export function CrewMemberChip({
    member,
    isMe,
    onPress
}: {
    member: PartyRoomMember;
    isMe: boolean;
    onPress?: () => void;
}) {
    const { C, CTRL, RADII, T } = useTheme();

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
            <Avatar name={member.name} photoUrl={member.photoUrl} seed={member.id} size={24} />
            <Text style={[T.captionStrong, { color: C.text }]}>{isMe ? "You" : member.name.split(" ")[0]}</Text>
            {member.role === "host" ? (
                <Icon name="crown" size={12} color={C.gold} />
            ) : member.paid ? (
                <Icon name="check" size={12} weight="strong" color={C.green} />
            ) : (
                <Icon name="clock" size={12} color={C.textFaint} />
            )}
        </AppPressable>
    );
}

export function InvitedMemberChip({ username }: { username: string }) {
    const { C, CTRL, DECOR, RADII, T } = useTheme();

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
            <Text style={[T.footnote, { color: C.textMuted }]}>@{username}</Text>
            <Text style={[T.footnote, { color: C.cyan }]}>invited</Text>
        </View>
    );
}
