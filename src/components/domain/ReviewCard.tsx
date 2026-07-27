import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { formatAgo } from "../../utils/format";
import type { VenueReview } from "../../types";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { Card } from "../primitives/Card";
import { StarRow } from "../primitives/StarRow";

// Ported from karamatch-web/src/screens/VenueDetail.tsx's inline review card.
export function ReviewCard({ review }: { review: VenueReview }) {
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
