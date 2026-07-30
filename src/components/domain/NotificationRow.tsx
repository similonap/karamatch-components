import { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import { formatWhen, money } from "../../utils/format";
import { AppPressable } from "../primitives/AppPressable";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { Button } from "../primitives/Button";
import { Card } from "../primitives/Card";

// The one prop shape here that stays a union rather than a flat set of
// fields: the component branches on `kind`, so the two arms have to stay
// distinguishable for the narrowing below to hold. Your own notification
// type satisfies this as long as it discriminates on the same literals.
export type NotificationRowProps = {
    notification:
        | {
              kind: "invite";
              from: { id: string | number; name: string; username: string; photoUrl?: string | null };
              party: { title: string; venueName: string; start: string; share: number };
          }
        | {
              kind: "review";
              venue: { name: string; imageUrl: string };
              party: { title: string; start: string };
          };
    busy?: boolean;
    /** Taps the row itself — opens the profile (invite) or the review form (review). */
    onOpen: () => void;
    /** "Accept · €12" (invite) or "Review" (review). */
    onPrimary: () => void;
    /** "Decline" (invite) or "Dismiss" (review). */
    onDismiss: () => void;
};

// Ported from karamatch-web/src/screens/Notifications.tsx's inline card,
// which branches on `kind`: an "invite" (accept/decline, paying your share)
// or a "review" nudge (dismiss/review) once a past night's party has ended.
export function NotificationRow({ notification, busy, onOpen, onPrimary, onDismiss }: NotificationRowProps) {
    const { C, S, S2 } = useTheme();

    return (
        <Card highlight style={{ gap: S2.s12 }}>
            {notification.kind === "review" ? (
                <AppPressable onPress={onOpen} press="row" style={{ flexDirection: "row", alignItems: "center", gap: S2.s12 }}>
                    <VenueThumb imageUrl={notification.venue.imageUrl} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                        {/* A bold run inside a sentence keeps the parent's
                            variant and only swaps weight, so it stays on the
                            callout size rather than jumping to bodyStrong's. */}
                        <AppText variant="callout" tone="textDim">
                            {"How was "}
                            <AppText variant="callout" weight="bold" tone="text">
                                {notification.venue.name}
                            </AppText>
                            ?
                        </AppText>
                        <AppText variant="footnote" style={{ marginTop: 3 }}>
                            {notification.party.title} · {formatWhen(notification.party.start)}
                        </AppText>
                    </View>
                    <Icon name="chevronRight" size={16} weight="strong" color={C.textFaint} />
                </AppPressable>
            ) : (
                <AppPressable onPress={onOpen} press="row" style={{ flexDirection: "row", alignItems: "center", gap: S2.s12 }}>
                    <Avatar name={notification.from.name} photoUrl={notification.from.photoUrl} seed={notification.from.id} size={42} />
                    <View style={{ minWidth: 0, flex: 1 }}>
                        <AppText variant="callout" tone="textDim">
                            <AppText variant="callout" weight="bold" tone="text">
                                @{notification.from.username}
                            </AppText>
                            {" invited you to "}
                            <AppText variant="callout" weight="bold" tone="tintSoft">
                                {notification.party.title}
                            </AppText>
                        </AppText>
                        <AppText variant="footnote" style={{ marginTop: 3 }}>
                            {notification.party.venueName} · {formatWhen(notification.party.start)}
                        </AppText>
                    </View>
                </AppPressable>
            )}

            <View style={{ flexDirection: "row", gap: S.sm }}>
                <Button
                    label={notification.kind === "review" ? "Dismiss" : "Decline"}
                    variant="secondary"
                    size="md"
                    disabled={busy}
                    onPress={onDismiss}
                    style={{ flex: 1 }}
                />
                <Button
                    label={notification.kind === "review" ? "Review" : "Accept · " + money(notification.party.share)}
                    icon={notification.kind === "review" ? "star" : undefined}
                    size="md"
                    busy={notification.kind === "invite" && busy}
                    onPress={onPrimary}
                    style={{ flex: 1.4 }}
                />
            </View>
        </Card>
    );
}

/** The review notification's venue thumbnail, with the same broken-image fallback as SongArt/Avatar. */
function VenueThumb({ imageUrl }: { imageUrl: string }) {
    const { C, RADII } = useTheme();
    const [broken, setBroken] = useState(false);
    const showPhoto = imageUrl && !broken;

    return (
        <View
            style={{
                width: 42,
                height: 42,
                borderRadius: RADII.plate,
                borderCurve: "continuous",
                overflow: "hidden",
                backgroundColor: C.surface2,
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {showPhoto ? (
                <Image source={{ uri: imageUrl }} onError={() => setBroken(true)} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            ) : (
                <Icon name="star" size={20} color={C.gold} />
            )}
        </View>
    );
}
