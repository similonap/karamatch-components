import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { StarIcon } from "../../icons/StarIcon";
import { AppPressable } from "../primitives/AppPressable";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { CheckRing } from "../primitives/CheckRing";
import { MatchBadge } from "../primitives/MatchBadge";

export type InviteFriendRowProps = {
    friend: {
        id: string | number;
        name: string;
        username: string;
        photoUrl?: string | null;
        /** Null or absent hides the match badge. */
        matchPct?: number | null;
        singerRating: number;
    };
    selected: boolean;
    onToggle: () => void;
};

// Ported from karamatch-web/src/screens/InviteFriends.tsx's inline friend
// row — SongRow's bordered/CheckRing shape (not ListRow's flush hairline
// shape), because picking several friends to invite is a multi-select list
// like the song picker, not a single navigable list.
export function InviteFriendRow({ friend, selected, onToggle }: InviteFriendRowProps) {
    const { C, CTRL, RADII, S2 } = useTheme();
    // A theme may fill a selected row solid, so everything inside it has to
    // ask the palette what "on a selection" reads as — see C.selectText.
    const dim = selected ? C.selectTextDim : C.textMuted;

    return (
        <AppPressable
            onPress={onToggle}
            press="surface"
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: S2.s12,
                paddingVertical: CTRL.rowPaddingY,
                paddingHorizontal: CTRL.rowPaddingX,
                borderRadius: RADII.card,
                borderCurve: "continuous",
                borderWidth: CTRL.border.regular,
                borderColor: selected ? C.selectBorder : C.border,
                backgroundColor: selected ? C.selectBg : C.surface1
            }}
        >
            <Avatar name={friend.name} photoUrl={friend.photoUrl} seed={friend.id} size={42} />
            <View style={{ flex: 1, minWidth: 0 }}>
                <AppText variant="bodyStrong" tone={selected ? "selectText" : "text"}>
                    {friend.name}
                </AppText>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <AppText variant="caption" tone={dim}>
                        @{friend.username}
                    </AppText>
                    <StarIcon size={10} color={selected ? C.selectTextDim : C.gold} />
                    <AppText variant="caption" tone={dim}>
                        {friend.singerRating.toFixed(1)}
                    </AppText>
                </View>
            </View>
            <MatchBadge pct={friend.matchPct} />
            <CheckRing on={selected} />
        </AppPressable>
    );
}
