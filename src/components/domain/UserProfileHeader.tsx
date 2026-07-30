import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { StarIcon } from "../../icons/StarIcon";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { Stat, StatStrip } from "../primitives/Stat";

export type UserProfileHeaderProps = {
    /** Only seeds the fallback avatar colour, so either id flavour works. */
    id: string | number;
    name: string;
    username: string;
    /** Omitted or empty drops the line rather than leaving a gap. */
    bio?: string;
    photoUrl?: string | null;
    singerRating: number;
    eventsCount: number;
    /** Null or absent drops the taste-match stat — see below. */
    matchPct?: number | null;
};

// Ported from karamatch-web/src/screens/UserProfile.tsx's header block: an
// avatar, name/@handle, bio, and a stat strip (rating, nights out, and
// taste match when the profile isn't your own) that reads as one strip
// rather than three floating cards.
//
// The full profile this was lifted out of also carried common songs, friend
// and self flags, favourites and a genre profile. None of them are drawn
// here, and demanding them forced callers rendering their *own* profile to
// invent five fields to satisfy a type nothing reads — so the shape below is
// only what ends up on screen.
export function UserProfileHeader({ id, name, username, bio, photoUrl, singerRating, eventsCount, matchPct }: UserProfileHeaderProps) {
    const { C, S } = useTheme();

    // Absent and null both mean "no taste match to show" — your own profile has
    // nothing to compare against. Normalised once so the two reads below stay
    // in step; a stray `0` here would render a real "0% taste match".
    const shownMatchPct = matchPct ?? null;

    return (
        <View style={{ gap: S.lg }}>
            <View style={{ alignItems: "center", gap: S.sm }}>
                <Avatar name={name} photoUrl={photoUrl} seed={id} size={96} />
                <View style={{ alignItems: "center" }}>
                    <AppText variant="title" size={20}>
                        {name}
                    </AppText>
                    <AppText variant="callout" tone="textMuted" style={{ marginTop: 2 }}>
                        @{username}
                    </AppText>
                </View>
                {bio ? (
                    <AppText variant="callout" tone="textDim" align="center" style={{ maxWidth: 280 }}>
                        {bio}
                    </AppText>
                ) : null}
            </View>

            <StatStrip>
                <Stat label="rating" value={singerRating.toFixed(1)} icon={<StarIcon size={13} color={C.gold} />} tone="gold" />
                <Stat label={eventsCount === 1 ? "night out" : "nights out"} value={String(eventsCount)} last={shownMatchPct === null} />
                {shownMatchPct !== null ? <Stat label="taste match" value={shownMatchPct + "%"} tone="tintSoft" last /> : null}
            </StatStrip>
        </View>
    );
}
