import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import { formatWhen, money, plural } from "../../utils/format";
import { AppPressable } from "../primitives/AppPressable";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";
import { Button } from "../primitives/Button";
import { Card } from "../primitives/Card";
import { Chip } from "../primitives/Chip";

export type PartyCardVariant = "open" | "match" | "upcoming" | "past";

export type PartyCardProps = {
    party: {
        title: string;
        /** Anything `new Date()` parses — rendered as "Fri 21:00". */
        start: string;
        /** Only the name is drawn; the card never links through to the venue. */
        venue: { name: string };
        host: { id: string | number; name: string; username: string; photoUrl?: string | null };
        membersCount: number;
        capacity: number;
        spotsOpen: number;
        /** What one singer pays, already split by the server. */
        share: number;
    };
    variant: PartyCardVariant;
    onPress?: () => void;
    /** variant="open" | "match" — taps the host row to open their profile. */
    onHostPress?: () => void;
    /** variant="open" | "match" */
    onJoin?: () => void;
    joining?: boolean;
    /** variant="match" */
    matchPct?: number;
    commonSongs?: string[];
    /** variant="upcoming" */
    isHost?: boolean;
    /** variant="past" */
    rated?: boolean;
    venueReviewed?: boolean;
    onRateCrew?: () => void;
    onReviewVenue?: () => void;
};

// Ported from three different inline card layouts, one per screen, that all
// render the same party:
// - "open"     karamatch-web/src/screens/tabs/OpenPartiesTab.tsx  (spots chip + host row + join)
// - "match"    karamatch-web/src/screens/tabs/MatchTab.tsx        (match ring + common songs + join)
// - "upcoming" karamatch-web/src/screens/tabs/MineTab.tsx         (host/joined chip)
// - "past"     karamatch-web/src/screens/tabs/MineTab.tsx         (rate-crew / review-venue actions)
// A shelf composite can't fork per screen the way the app did, so this is
// one component with the variant-specific data passed as optional props —
// which is also why `matchPct`, `rated` and friends sit alongside `party`
// rather than inside it: the app modelled them as separate response types.
export function PartyCard({
    party,
    variant,
    onPress,
    onHostPress,
    onJoin,
    joining,
    matchPct,
    commonSongs,
    isHost,
    rated,
    venueReviewed,
    onRateCrew,
    onReviewVenue
}: PartyCardProps) {
    const { C, CTRL, S, S2 } = useTheme();
    const strongMatch = (matchPct ?? 0) >= 60;

    return (
        <Card onPress={onPress} highlight={variant === "match" ? strongMatch : variant === "upcoming"} style={{ gap: S2.s12 }}>
            {variant === "match" ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: S2.s12 }}>
                    <MatchRing pct={matchPct ?? 0} />
                    <View style={{ minWidth: 0, flex: 1, gap: 2 }}>
                        <AppText variant="bodyStrong" size={16} truncate>
                            {party.title}
                        </AppText>
                        <AppText variant="caption" truncate>
                            {party.venue.name} · {formatWhen(party.start)}
                        </AppText>
                        <AppText variant="caption">{plural(party.spotsOpen, "spot open", "spots open")}</AppText>
                    </View>
                </View>
            ) : (
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: S2.s10 }}>
                    <View style={{ minWidth: 0, flex: 1, gap: 2 }}>
                        <AppText variant="bodyStrong" size={16} truncate>
                            {party.title}
                        </AppText>
                        <AppText variant="caption" truncate>
                            {party.venue.name} ·{" "}
                            {variant === "past" ? plural(party.membersCount, "singer", "singers") : formatWhen(party.start)}
                        </AppText>
                    </View>
                    {variant === "open" ? <Chip label={plural(party.spotsOpen, "spot", "spots")} tone="cyan" /> : null}
                    {variant === "upcoming" ? (
                        <Chip label={isHost ? "Host" : "Joined"} icon={isHost ? "crown" : "check"} tone="tint" />
                    ) : null}
                    {variant === "past" ? (
                        <AppText variant="footnote" tone="textFaint">
                            {formatWhen(party.start)}
                        </AppText>
                    ) : null}
                </View>
            )}

            {(variant === "open" || variant === "match") ? (
                <AppPressable onPress={onHostPress} press="row" style={{ flexDirection: "row", alignItems: "center", gap: S.sm, alignSelf: "flex-start" }}>
                    <Avatar name={party.host.name} photoUrl={party.host.photoUrl} seed={party.host.id} size={28} />
                    <AppText variant="caption">
                        @{party.host.username} · {plural(party.membersCount, "singer", "singers")}
                    </AppText>
                </AppPressable>
            ) : null}

            {variant === "match" ? (
                commonSongs && commonSongs.length > 0 ? (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: S.xs }}>
                        {commonSongs.map(title => (
                            <Chip key={title} label={title} icon="music" tone="cyan" />
                        ))}
                    </View>
                ) : (
                    <AppText variant="footnote" size={12} tone="textFaint">
                        No shared songs — matched on genre affinity.
                    </AppText>
                )
            ) : null}

            {(variant === "open" || variant === "match") ? (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: S2.s12,
                        paddingTop: S2.s12,
                        borderTopWidth: CTRL.border.hairline,
                        borderTopColor: C.border
                    }}
                >
                    <AppText variant="caption">
                        Your share{" "}
                        <AppText variant="bodyStrong" tone="text">
                            {money(party.share)}
                        </AppText>
                    </AppText>
                    <Button label={joining ? "Joining" : "Join"} variant="tinted" size="md" busy={joining} onPress={() => onJoin?.()} />
                </View>
            ) : null}

            {variant === "upcoming" ? (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: S.sm }}>
                    {isHost ? (
                        <AppText variant="caption">
                            {party.membersCount}/{party.capacity} singers
                        </AppText>
                    ) : (
                        <AppPressable onPress={onHostPress} press="row" style={{ flexDirection: "row", alignItems: "center", gap: S2.s6 }}>
                            <Avatar name={party.host.name} photoUrl={party.host.photoUrl} seed={party.host.id} size={22} />
                            <AppText variant="caption">@{party.host.username}</AppText>
                        </AppPressable>
                    )}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                        <AppText variant="captionStrong" tone="tintSoft">
                            Open room
                        </AppText>
                        <Icon name="chevronRight" size={14} weight="strong" color={C.tintSoft} />
                    </View>
                </View>
            ) : null}

            {variant === "past" ? (
                <View style={{ gap: S2.s6 }}>
                    {rated ? (
                        <Chip label="Crew rated" icon="check" tone="green" />
                    ) : (
                        <Button label="Rate your crew" icon="star" variant="secondary" size="md" onPress={() => onRateCrew?.()} />
                    )}
                    {venueReviewed ? (
                        <Chip label="Venue reviewed" icon="check" tone="green" />
                    ) : (
                        <Button label="Review venue" icon="star" variant="secondary" size="md" onPress={() => onReviewVenue?.()} />
                    )}
                </View>
            ) : null}
        </Card>
    );
}

const RING_SIZE = 56;
const RING_STROKE = 5.5;
/** The disc the percentage sits on, inside the ring. */
const RING_PLATE = 45;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// The compatibility score as a progress ring — the single most important
// number on the match screen, so it gets the geometry rather than a text
// pill. The web version drew it with a CSS `conic-gradient`; RN has no
// conic-gradient support, so this is an SVG circle with a dashed stroke
// instead, which is the standard native technique for a percentage ring.
function MatchRing({ pct }: { pct: number }) {
    const { C, RADII } = useTheme();
    const strong = pct >= 60;
    const tone = strong ? C.tint : C.textMuted;
    const offset = RING_CIRCUMFERENCE * (1 - pct / 100);

    return (
        <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: "center", justifyContent: "center" }}>
            <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: "absolute" }}>
                <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} stroke={C.track} strokeWidth={RING_STROKE} fill="none" />
                <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    stroke={tone}
                    strokeWidth={RING_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    fill="none"
                    // The web ring starts at 12 o'clock via conic-gradient's
                    // default angle origin; SVG circles start at 3 o'clock,
                    // so this rotates the stroke back to match.
                    rotation={-90}
                    origin={RING_SIZE / 2 + ", " + RING_SIZE / 2}
                />
            </Svg>
            <View
                style={{
                    width: RING_PLATE,
                    height: RING_PLATE,
                    borderRadius: Math.min(RADII.round, RING_PLATE / 2),
                    backgroundColor: C.surface1,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <AppText variant="captionStrong" size={14} lineHeight={16} tone={tone}>
                    {pct}
                </AppText>
                <AppText variant="footnote" size={8} lineHeight={9} tone={tone} style={{ opacity: 0.75 }}>
                    MATCH
                </AppText>
            </View>
        </View>
    );
}
