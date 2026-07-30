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

// What both kinds of notification draw. Flat like every other component
// here, but still a union on `kind` — the row branches on it, so the two
// arms have to stay distinguishable for the narrowing below to hold.
type NotificationRowSharedProps = {
    partyTitle: string;
    /** Anything `new Date()` parses — rendered as "Fri 21:00". */
    partyStart: string;
    venueName: string;
    busy?: boolean;
    /** Taps the row itself — opens the profile (invite) or the review form (review). */
    onOpen: () => void;
    /** "Accept · €12" (invite) or "Review" (review). */
    onPrimary: () => void;
    /** "Decline" (invite) or "Dismiss" (review). */
    onDismiss: () => void;
};

export type NotificationRowProps = NotificationRowSharedProps &
    (
        | {
              kind: "invite";
              /** Only seeds the fallback avatar colour, so either id flavour works. */
              fromId: string | number;
              fromName: string;
              fromUsername: string;
              fromPhotoUrl?: string | null;
              /** What you'd pay by accepting, already split by the server. */
              share: number;
          }
        | {
              kind: "review";
              /** Empty or broken falls back to a star glyph. */
              venueImageUrl: string;
          }
    );

// Ported from karamatch-web/src/screens/Notifications.tsx's inline card,
// which branches on `kind`: an "invite" (accept/decline, paying your share)
// or a "review" nudge (dismiss/review) once a past night's party has ended.
// Taken as one `props` object rather than destructured in the signature:
// the arm-specific fields only exist on one side of the union, and reading
// them off `props` after a `props.kind` check is what lets TS narrow them.
export function NotificationRow(props: NotificationRowProps) {
    const { partyTitle, partyStart, venueName, busy, onOpen, onPrimary, onDismiss } = props;
    const { C, S, S2 } = useTheme();

    return (
        <Card highlight style={{ gap: S2.s12 }}>
            {props.kind === "review" ? (
                <AppPressable onPress={onOpen} press="row" style={{ flexDirection: "row", alignItems: "center", gap: S2.s12 }}>
                    <VenueThumb imageUrl={props.venueImageUrl} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                        {/* A bold run inside a sentence keeps the parent's
                            variant and only swaps weight, so it stays on the
                            callout size rather than jumping to bodyStrong's. */}
                        <AppText variant="callout" tone="textDim">
                            {"How was "}
                            <AppText variant="callout" weight="bold" tone="text">
                                {venueName}
                            </AppText>
                            ?
                        </AppText>
                        <AppText variant="footnote" style={{ marginTop: 3 }}>
                            {partyTitle} · {formatWhen(partyStart)}
                        </AppText>
                    </View>
                    <Icon name="chevronRight" size={16} weight="strong" color={C.textFaint} />
                </AppPressable>
            ) : (
                <AppPressable onPress={onOpen} press="row" style={{ flexDirection: "row", alignItems: "center", gap: S2.s12 }}>
                    <Avatar name={props.fromName} photoUrl={props.fromPhotoUrl} seed={props.fromId} size={42} />
                    <View style={{ minWidth: 0, flex: 1 }}>
                        <AppText variant="callout" tone="textDim">
                            <AppText variant="callout" weight="bold" tone="text">
                                @{props.fromUsername}
                            </AppText>
                            {" invited you to "}
                            <AppText variant="callout" weight="bold" tone="tintSoft">
                                {partyTitle}
                            </AppText>
                        </AppText>
                        <AppText variant="footnote" style={{ marginTop: 3 }}>
                            {venueName} · {formatWhen(partyStart)}
                        </AppText>
                    </View>
                </AppPressable>
            )}

            <View style={{ flexDirection: "row", gap: S.sm }}>
                <Button
                    label={props.kind === "review" ? "Dismiss" : "Decline"}
                    variant="secondary"
                    size="md"
                    disabled={busy}
                    onPress={onDismiss}
                    style={{ flex: 1 }}
                />
                <Button
                    label={props.kind === "review" ? "Review" : "Accept · " + money(props.share)}
                    icon={props.kind === "review" ? "star" : undefined}
                    size="md"
                    busy={props.kind === "invite" && busy}
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
