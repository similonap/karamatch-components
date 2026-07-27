import { Linking, Platform, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import { AppPressable } from "../primitives/AppPressable";
import { AppText } from "../primitives/AppText";
import { Card } from "../primitives/Card";

// Replaces karamatch-web/src/ui.tsx's `VenueMap` (a read-only Leaflet
// embed). A live map needs a dev-client/prebuild — out of scope for a shelf
// that has to run in plain Expo Go — so this is a static placeholder with
// the same footprint (rounded panel, pin, attribution-height caption) that
// hands off to the device's own Maps app instead of embedding one.
export function VenueLocationCard({
    name,
    lat,
    lng,
    height = 132
}: {
    name: string;
    lat: number;
    lng: number;
    height?: number;
}) {
    const { C, CTRL, RADII, S, S2 } = useTheme();

    const openInMaps = () => {
        const label = encodeURIComponent(name);
        const url = Platform.select({
            ios: "maps:0,0?q=" + label + "@" + lat + "," + lng,
            android: "geo:" + lat + "," + lng + "?q=" + lat + "," + lng + "(" + label + ")",
            default: "https://maps.google.com/?q=" + lat + "," + lng
        });
        Linking.openURL(url).catch(() => {});
    };

    return (
        <AppPressable onPress={openInMaps} press="surface">
            <Card padded={false}>
                <View
                    style={{
                        height,
                        backgroundColor: C.surface3,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: S2.s6
                    }}
                >
                    <View
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: Math.min(RADII.round, 17),
                            backgroundColor: C.tintBg,
                            borderWidth: CTRL.border.regular,
                            borderColor: C.tintBorder,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Icon name="pin" size={18} color={C.tintSoft} />
                    </View>
                    <AppText variant="footnote" tone="textFaint">
                        {lat.toFixed(4)}, {lng.toFixed(4)}
                    </AppText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: S.sm, borderTopWidth: CTRL.border.hairline, borderTopColor: C.border }}>
                    <AppText variant="captionStrong" truncate style={{ flexShrink: 1 }}>
                        {name}
                    </AppText>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                        <AppText variant="captionStrong" tone="tintSoft">
                            Open in Maps
                        </AppText>
                        <Icon name="chevronRight" size={14} weight="strong" color={C.tintSoft} />
                    </View>
                </View>
            </Card>
        </AppPressable>
    );
}
