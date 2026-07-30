import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { formatAgo } from "../../utils/format";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { Card } from "../primitives/Card";
import { StarRow } from "../primitives/StarRow";

export type ReviewCardProps = {
    stars: number;
    text: string;
    /** Anything `new Date()` parses — rendered as "3 days ago". */
    createdAt: string;
    /** A deleted or anonymised author still renders, as "A singer". */
    authorName?: string | null;
    authorPhotoUrl?: string | null;
    /** Only seeds the fallback avatar colour. */
    authorId?: string | number | null;
};

// Ported from karamatch-web/src/screens/VenueDetail.tsx's inline review card.
export function ReviewCard({ stars, text, createdAt, authorName, authorPhotoUrl, authorId }: ReviewCardProps) {
    const { S2 } = useTheme();

    return (
        <Card style={{ gap: S2.s6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: S2.s10 }}>
                <Avatar name={authorName ?? "Someone"} photoUrl={authorPhotoUrl ?? null} seed={authorId ?? 0} size={28} />
                <AppText variant="captionStrong" truncate style={{ flex: 1 }}>
                    {authorName ?? "A singer"}
                </AppText>
                <StarRow value={stars} />
                <AppText variant="footnote" tone="textFaint">
                    {formatAgo(createdAt)}
                </AppText>
            </View>
            {text ? (
                <AppText variant="caption" tone="textDim">
                    {text}
                </AppText>
            ) : null}
        </Card>
    );
}
