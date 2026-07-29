import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { StarIcon } from "../../icons/StarIcon";
import type { UserProfile } from "../../types";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { Stat, StatStrip } from "../primitives/Stat";

// Ported from karamatch-web/src/screens/UserProfile.tsx's header block: an
// avatar, name/@handle, bio, and a stat strip (rating, nights out, and
// taste match when the profile isn't your own) that reads as one strip
// rather than three floating cards.
export function UserProfileHeader({ user }: { user: UserProfile }) {
    const { C, S } = useTheme();

    return (
        <View style={{ gap: S.lg }}>
            <View style={{ alignItems: "center", gap: S.sm }}>
                <Avatar name={user.name} photoUrl={user.photoUrl} seed={user.id} size={96} />
                <View style={{ alignItems: "center" }}>
                    <AppText variant="title" size={20}>
                        {user.name}
                    </AppText>
                    <AppText variant="callout" tone="textMuted" style={{ marginTop: 2 }}>
                        @{user.username}
                    </AppText>
                </View>
                {user.bio ? (
                    <AppText variant="callout" tone="textDim" align="center" style={{ maxWidth: 280 }}>
                        {user.bio}
                    </AppText>
                ) : null}
            </View>

            <StatStrip>
                <Stat label="rating" value={user.singerRating.toFixed(1)} icon={<StarIcon size={13} color={C.gold} />} tone="gold" />
                <Stat label={user.eventsCount === 1 ? "night out" : "nights out"} value={String(user.eventsCount)} last={user.matchPct === null} />
                {user.matchPct !== null ? <Stat label="taste match" value={user.matchPct + "%"} tone="tintSoft" last /> : null}
            </StatStrip>
        </View>
    );
}
