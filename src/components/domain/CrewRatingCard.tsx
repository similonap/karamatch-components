import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { Card } from "../primitives/Card";
import { MatchBadge } from "../primitives/MatchBadge";
import { StarInput } from "../primitives/StarInput";
import { TextField } from "../primitives/TextField";

const STAR_WORDS = ["", "Rough night", "Off-key", "Solid", "Great voice", "Absolute star"];

export type CrewRatingCardProps = {
    /** Only seeds the fallback avatar colour, so either id flavour works. */
    id: string | number;
    name: string;
    username: string;
    photoUrl?: string | null;
    /** Taste compatibility. Null or absent hides the badge entirely. */
    matchPct?: number | null;
    /** The rating being written for this member, not one they already have. */
    stars: number;
    text: string;
    onStarsChange: (stars: number) => void;
    onTextChange: (text: string) => void;
};

// Ported from karamatch-web/src/screens/Rate.tsx's inline per-crew-member
// card — star the person, and only once they have a star does the optional
// review box appear, so an unrated crew doesn't read as a wall of textareas.
export function CrewRatingCard({ id, name, username, photoUrl, matchPct, stars, text, onStarsChange, onTextChange }: CrewRatingCardProps) {
    const { S, S2 } = useTheme();

    return (
        <Card highlight={stars > 0} style={{ gap: S2.s12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: S2.s12 }}>
                <Avatar name={name} photoUrl={photoUrl} seed={id} size={42} />
                <View style={{ flex: 1, minWidth: 0 }}>
                    <AppText variant="bodyStrong">{name}</AppText>
                    <AppText variant="caption">@{username}</AppText>
                </View>
                <MatchBadge pct={matchPct} />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
                <StarInput value={stars} onChange={onStarsChange} />
                {stars > 0 ? (
                    <AppText variant="caption" tone="gold">
                        {STAR_WORDS[stars]}
                    </AppText>
                ) : null}
            </View>

            {stars > 0 ? (
                <TextField value={text} onChange={onTextChange} placeholder="Add a few words (optional)" multiline maxLength={280} />
            ) : null}
        </Card>
    );
}
