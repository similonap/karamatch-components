import { useState } from "react";
import type { ReactNode } from "react";
import { Platform, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import { AppPressable } from "../primitives/AppPressable";
import { AppText } from "../primitives/AppText";
import { useAppBarHeight } from "./useAppBarHeight";

// Ported from karamatch-web/src/screens/VenueDetail.tsx's collapsing header —
// a bar that starts as nothing but a scrim-backed chevron floating over a hero
// photo, and hands over to an ordinary `AppBar` (solid background, hairline,
// title) as that photo scrolls away.
//
// It comes as a pair, because the two halves live on opposite sides of the
// scroller: `ImageStatusHero` is the photo, and scrolls with the content;
// `ImageStatusAppBar` is pinned over it. The web laid them out the same way,
// for the same reason — a header that scrolls cannot also stay put.
//
//     const [scrollY, setScrollY] = useState(0);
//
//     <View style={{ flex: 1 }}>
//         <Screen pad={false} gap={0} underStatusBar onScroll={setScrollY}>
//             <ImageStatusHero imageUrl={venue.imageUrl} />
//             {/* … the rest of the screen, with its own gutter … */}
//         </Screen>
//         <ImageStatusAppBar title={venue.name} onBack={router.back} scrollY={scrollY} />
//     </View>
//
// The wrapping `View` is what the bar is absolutely positioned against.
//
// The photo runs edge to edge and all the way to the top of the window, behind
// the status bar and any camera cutout — that being the whole point of a
// chevron that floats on it. What stays clear of the cutout is everything that
// carries meaning: `ImageStatusHero` draws `height + insets.top`, so the photo
// keeps a full `height` of *visible* frame below the notch, and the bar's own
// row is padded down by the same inset. Nothing is hidden behind the cutout;
// nothing is boxed in by a bar of background colour above it either.
//
// `underStatusBar` on the `Screen` is what allows that — it turns off iOS's
// automatic content inset, which would otherwise push the whole scroller down
// and put the photo back below the notch.

/** The hero's height on the web venue screen, and the default for both halves. */
export const HERO_HEIGHT = 180;

export interface ImageStatusAppBarProps {
    /** Fades in as the photo goes; invisible while the hero is still there. */
    title?: ReactNode;
    onBack?: () => void;
    /**
     * Actions on the right, drawn as-is at every collapse point. Whatever goes
     * here has to be legible on the photo *and* on the bar — an `IconButton`
     * in `onOverlay` over a scrim, typically — because unlike the chevron
     * below, this component can't restyle a node it was handed.
     */
    right?: ReactNode;
    /** Latest scroll offset of the body below — wire `Screen`'s `onScroll` straight to it. */
    scrollY: number;
    /** Height of the `ImageStatusHero` this bar floats over. */
    imageHeight?: number;
}

export function ImageStatusAppBar({ title, onBack, right, scrollY, imageHeight = HERO_HEIGHT }: ImageStatusAppBarProps) {
    const { C, CTRL, DECOR, LAYOUT, RADII, S } = useTheme();
    const insets = useSafeAreaInsets();
    const height = useAppBarHeight();

    // The web hard-coded this window as `(scrollY - 60) / (180 - 56 - 60)`:
    // fully handed over once the photo's bottom edge meets the bar's bottom
    // edge, fading over roughly the last bar-row of travel before that.
    //
    // The photo's bottom edge sits `insets.top + imageHeight` down the window
    // (the hero adds the inset to its height) and the bar's bottom edge
    // `insets.top + LAYOUT.appBar`, so the inset cancels out of the difference:
    // the travel is `imageHeight` against the bar's row alone, not against
    // `useAppBarHeight()`.
    const handover = Math.max(imageHeight - LAYOUT.appBar, 1);
    const fadeStart = Math.max(handover - LAYOUT.appBar, 0);
    const collapse = clamp01((scrollY - fadeStart) / Math.max(handover - fadeStart, 1));

    const puck = Math.min(RADII.round, LAYOUT.touch / 2);

    return (
        // `box-none` throughout: the bar is a strip laid over a scroller, and
        // only its actual controls may take a touch. Anything else here would
        // eat the drag that scrolls the photo away.
        <View
            pointerEvents="box-none"
            style={{ position: "absolute", top: 0, left: 0, right: 0, height }}
        >
            <View
                pointerEvents="none"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: C.bg,
                    borderBottomWidth: DECOR.appBarBorder ? CTRL.border.hairline : 0,
                    borderBottomColor: C.border,
                    opacity: collapse
                }}
            />

            <View
                pointerEvents="box-none"
                style={{
                    flex: 1,
                    paddingTop: insets.top,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: S.sm,
                    paddingLeft: onBack ? 4 : LAYOUT.gutter,
                    paddingRight: S.sm
                }}
            >
                {onBack ? (
                    <AppPressable
                        onPress={onBack}
                        accessibilityLabel="Go back"
                        style={{
                            width: LAYOUT.touch,
                            height: LAYOUT.touch,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: puck
                        }}
                    >
                        {/* Its own scrim while it floats on the photo, gone by
                            the time the bar behind it is solid. */}
                        <View
                            pointerEvents="none"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: puck,
                                backgroundColor: C.overlay,
                                opacity: 1 - collapse
                            }}
                        />
                        {/* Cross-fading two chevrons would show both at half
                            strength through each other, so the glyph flips
                            colour at the halfway point instead — exactly what
                            the web did. */}
                        <Icon name="chevronLeft" size={24} weight="strong" color={collapse > 0.5 ? C.text : C.onOverlay} />
                    </AppPressable>
                ) : null}

                <View pointerEvents="box-none" style={{ flex: 1, minWidth: 0, opacity: collapse }}>
                    {typeof title === "string" ? (
                        <AppText variant="navTitle" truncate>
                            {title}
                        </AppText>
                    ) : (
                        title
                    )}
                </View>

                <View pointerEvents="box-none" style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    {right}
                </View>
            </View>
        </View>
    );
}

export interface ImageStatusHeroProps {
    /** Empty or broken falls back to a mic glyph on `C.surface3`, as `VenueCard` does. */
    imageUrl?: string;
    /**
     * How much photo is visible below the status-bar inset — the hero draws
     * `height + insets.top` so the rest can run behind the notch. Must match
     * the bar's `imageHeight`; that's what times the handover.
     */
    height?: number;
}

export function ImageStatusHero({ imageUrl, height = HERO_HEIGHT }: ImageStatusHeroProps) {
    const { C } = useTheme();
    const insets = useSafeAreaInsets();
    const [broken, setBroken] = useState(false);
    const showPhoto = Boolean(imageUrl) && !broken;

    // Darkens the top of the photo so a white chevron — and the status bar's
    // own clock and icons, which now sit on the photo too — read on it whatever
    // the venue photographed. Fades out by 45% of the box, well clear of the
    // bottom edge, so it never looks like a band across the image.
    const scrim = "linear-gradient(180deg, " + C.scrim + " 0%, transparent 45%)";

    return (
        // The inset is added to the height rather than padded in: padding would
        // shrink the photo's box and leave a strip of background across the top
        // of the window, which is the one thing a full-bleed hero must not have.
        <View
            style={{
                height: height + insets.top,
                backgroundColor: C.surface3,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
            }}
        >
            {showPhoto ? (
                <Image
                    source={{ uri: imageUrl }}
                    onError={() => setBroken(true)}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                />
            ) : (
                // Centred on the visible frame rather than on the whole box, so
                // the glyph doesn't sit half a notch high on a cutout device.
                <View style={{ marginTop: insets.top }}>
                    <Icon name="mic" size={36} color={C.textFaint} />
                </View>
            )}
            <View
                pointerEvents="none"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    // Same split as `Screen`'s BrandWash: `experimental_backgroundImage`
                    // is the native-only prop name, and react-native-web passes it
                    // through as an invalid CSS property instead of translating it.
                    ...(Platform.OS === "web" ? { backgroundImage: scrim } : { experimental_backgroundImage: scrim })
                }}
            />
        </View>
    );
}

function clamp01(value: number) {
    return Math.min(1, Math.max(0, value));
}
