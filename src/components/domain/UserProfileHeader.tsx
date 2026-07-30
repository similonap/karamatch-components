import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { StarIcon } from "../../icons/StarIcon";
import type { PublicUser } from "../../types";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { Stat, StatStrip } from "../primitives/Stat";

// Ported from karamatch-web/src/screens/UserProfile.tsx's header block: an
// avatar, name/@handle, bio, and a stat strip (rating, nights out, and
// taste match when the profile isn't your own) that reads as one strip
// rather than three floating cards.
//
// Takes a `PublicUser` plus an optional `matchPct`, not the full `UserProfile`
// this was lifted out of. The header renders neither `commonSongs` nor
// `isFriend`/`isSelf`/`favoriteSongs`/`genreProfile`, and demanding them forced
// callers rendering their *own* profile to invent five fields to satisfy a type
// nothing here reads. A `UserProfile` still satisfies this, so the
// other-singer's-profile screen is unaffected.
export function UserProfileHeader({ user }: { user: PublicUser & { matchPct?: number | null } }) {
    const { C, S } = useTheme();

    // Absent and null both mean "no taste match to show" — your own profile has
    // nothing to compare against. Normalised once so the two reads below stay
    // in step; a stray `0` here would render a real "0% taste match".
    const matchPct = user.matchPct ?? null;

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
                <Stat label={user.eventsCount === 1 ? "night out" : "nights out"} value={String(user.eventsCount)} last={matchPct === null} />
                {matchPct !== null ? <Stat label="taste match" value={matchPct + "%"} tone="tintSoft" last /> : null}
            </StatStrip>
        </View>
    );
}
