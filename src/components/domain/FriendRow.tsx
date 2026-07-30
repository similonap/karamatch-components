import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { StarIcon } from "../../icons/StarIcon";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { Button } from "../primitives/Button";
import { ListRow } from "../primitives/ListRow";
import { MatchBadge } from "../primitives/MatchBadge";

export type FriendRowProps = {
    /** Only seeds the fallback avatar colour, so either id flavour works. */
    id: string | number;
    name: string;
    username: string;
    photoUrl?: string | null;
    /** Null or absent hides the match badge — that singer is you. */
    matchPct?: number | null;
    singerRating: number;
    eventsCount: number;
    variant: "friend" | "suggestion";
    onPress?: () => void;
    /** variant="suggestion" */
    onAdd?: () => void;
    last?: boolean;
};

// Ported from karamatch-web/src/screens/tabs/FriendsTab.tsx's two `ListRow`
// usages: the friend list (chevron + singer rating) and the search-results
// list (an "Add" button instead). Both are the same row shape over one
// person, so one composite with a `variant` covers both.
export function FriendRow({ id, name, username, photoUrl, matchPct, singerRating, eventsCount, variant, onPress, onAdd, last }: FriendRowProps) {
    const { C, S } = useTheme();

    return (
        <ListRow
            onPress={onPress}
            last={last}
            leading={<Avatar name={name} photoUrl={photoUrl} seed={id} size={variant === "friend" ? 44 : 40} />}
            title={name}
            subtitle={variant === "friend" ? "@" + username + " · " + eventsCount + " nights" : "@" + username}
            chevron={variant === "friend"}
            trailing={
                <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
                    <MatchBadge pct={matchPct} />
                    {variant === "friend" ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                            <StarIcon size={12} color={C.gold} />
                            <AppText variant="captionStrong" tone="gold">
                                {singerRating.toFixed(1)}
                            </AppText>
                        </View>
                    ) : (
                        <Button label="Add" icon="userPlus" variant="tinted" size="sm" onPress={() => onAdd?.()} />
                    )}
                </View>
            }
        />
    );
}
