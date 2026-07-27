import { View } from "react-native";
import type { ReactNode } from "react";

import { useTheme } from "../../theme/ThemeProvider";
import { StarIcon } from "../../icons/StarIcon";
import type { UserProfile } from "../../types";
import { AppText } from "../primitives/AppText";
import { Avatar } from "../primitives/Avatar";

// Ported from karamatch-web/src/screens/UserProfile.tsx's header block: an
// avatar, name/@handle, bio, and a stat strip (rating, nights out, and
// taste match when the profile isn't your own) that reads as one strip
// rather than three floating cards.
export function UserProfileHeader({ user }: { user: UserProfile }) {
    const { C, CTRL, RADII, S } = useTheme();

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

            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: C.surface1,
                    borderWidth: CTRL.border.regular,
                    borderColor: C.border,
                    borderRadius: RADII.card,
                    borderCurve: "continuous",
                    overflow: "hidden"
                }}
            >
                <Stat label="rating" value={user.singerRating.toFixed(1)} icon={<StarIcon size={13} color={C.gold} />} color={C.gold} />
                <Stat label={user.eventsCount === 1 ? "night out" : "nights out"} value={String(user.eventsCount)} last={user.matchPct === null} />
                {user.matchPct !== null ? <Stat label="taste match" value={user.matchPct + "%"} color={C.tintSoft} last /> : null}
            </View>
        </View>
    );
}

function Stat({ label, value, color, icon, last }: { label: string; value: string; color?: string; icon?: ReactNode; last?: boolean }) {
    const { C, CTRL, S, S2 } = useTheme();
    return (
        <View
            style={{
                flex: 1,
                paddingVertical: S2.s12,
                paddingHorizontal: S.sm,
                alignItems: "center",
                borderRightWidth: last ? 0 : CTRL.border.hairline,
                borderRightColor: C.border
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                {icon}
                <AppText variant="bodyStrong" size={17} tone={color ?? C.text}>
                    {value}
                </AppText>
            </View>
            <AppText variant="footnote" size={10} style={{ marginTop: 2 }}>
                {label}
            </AppText>
        </View>
    );
}
