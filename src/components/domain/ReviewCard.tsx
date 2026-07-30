import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { formatAgo } from "../../utils/format";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { Card } from "../primitives/Card";
import { StarRow } from "../primitives/StarRow";

export type ReviewCardProps = {
    review: {
        stars: number;
        text: string;
        /** Anything `new Date()` parses — rendered as "3 days ago". */
        createdAt: string;
        /** A deleted or anonymised author still renders, as "A singer". */
        from?: { id?: string | number; name: string; photoUrl?: string | null } | null;
    };
};

// Ported from karamatch-web/src/screens/VenueDetail.tsx's inline review card.
export function ReviewCard({ review }: ReviewCardProps) {
    const { S2 } = useTheme();

    return (
        <Card style={{ gap: S2.s6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: S2.s10 }}>
                <Avatar name={review.from?.name ?? "Someone"} photoUrl={review.from?.photoUrl ?? null} seed={review.from?.id ?? 0} size={28} />
                <AppText variant="captionStrong" truncate style={{ flex: 1 }}>
                    {review.from?.name ?? "A singer"}
                </AppText>
                <StarRow value={review.stars} />
                <AppText variant="footnote" tone="textFaint">
                    {formatAgo(review.createdAt)}
                </AppText>
            </View>
            {review.text ? (
                <AppText variant="caption" tone="textDim">
                    {review.text}
                </AppText>
            ) : null}
        </Card>
    );
}
