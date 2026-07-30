import { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import { money, plural } from "../../utils/format";
import { AppText } from "../primitives/AppText";
import { Card } from "../primitives/Card";
import { Rating } from "../primitives/Rating";

export type VenueCardProps = {
    name: string;
    /** Empty or broken falls back to a mic glyph. */
    imageUrl: string;
    rating: number;
    /** Zero hides the rating — a venue with no reviews has none to show. */
    reviewsCount: number;
    distanceKm: number;
    fromPrice: number;
    /** Just the number of rooms — the card never reads into a room itself. */
    roomsCount: number;
    onPress?: () => void;
};

// Ported from karamatch-web/src/screens/tabs/VenuesTab.tsx's inline venue
// card — a 124px photo (distance badge riding on top-left) over a name /
// rating line and a rooms · from-price line.
export function VenueCard({ name, imageUrl, rating, reviewsCount, distanceKm, fromPrice, roomsCount, onPress }: VenueCardProps) {
    const { C, CTRL, RADII, S, S2 } = useTheme();
    const [broken, setBroken] = useState(false);
    const showPhoto = imageUrl && !broken;

    return (
        <Card onPress={onPress} padded={false}>
            <View style={{ height: 124, backgroundColor: C.surface3, alignItems: "center", justifyContent: "center" }}>
                {showPhoto ? (
                    <Image
                        source={{ uri: imageUrl }}
                        onError={() => setBroken(true)}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                    />
                ) : (
                    <Icon name="mic" size={28} color={C.textFaint} />
                )}
                {/* Distance rides on the image so the row below stays a clean
                    name/price line. */}
                <View
                    style={{
                        position: "absolute",
                        top: S.sm,
                        left: S.sm,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        height: 24,
                        paddingHorizontal: CTRL.chipPaddingX - 2,
                        borderRadius: Math.min(RADII.chip, 12),
                        backgroundColor: C.overlay
                    }}
                >
                    <Icon name="pin" size={12} color={C.onOverlay} />
                    <AppText variant="chip" tone="onOverlay">
                        {distanceKm} km
                    </AppText>
                </View>
            </View>

            <View style={{ paddingTop: S2.s12, paddingHorizontal: S.md, paddingBottom: S.md, gap: S2.s6 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: S.sm }}>
                    <AppText variant="bodyStrong" size={16} truncate style={{ flexShrink: 1 }}>
                        {name}
                    </AppText>
                    {/* A venue with no reviews yet has no rating to show. */}
                    {reviewsCount > 0 ? <Rating value={rating} /> : null}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
                    <AppText variant="caption">{plural(roomsCount, "room", "rooms")}</AppText>
                    <View style={{ width: 3, height: 3, borderRadius: Math.min(RADII.round, 1.5), backgroundColor: C.textFaint }} />
                    <AppText variant="caption" tone="cyan">
                        from {money(fromPrice)}/hr
                    </AppText>
                </View>
            </View>
        </Card>
    );
}
