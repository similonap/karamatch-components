import { Platform, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import type { ThemeValue } from "../../theme/ThemeProvider";
import { glowShadow } from "../../theme/tokens";
import { Icon } from "../../icons/Icon";
import type { IconName } from "../../icons/types";
import { AppPressable } from "./AppPressable";
import { AppText } from "./AppText";
import { Spinner } from "./Spinner";

// Ported from karamatch-web/src/ui.tsx's `Button`. Same variant x size
// matrix; the primary fill is the brand gradient (reserved for the one
// enabled primary action per screen) as a real CSS-gradient string via
// `experimental_backgroundImage` — unless the theme asked for a flat fill
// instead (`DECOR.primaryFill`), which is how a print-shop theme gets a solid
// slab rather than a blend.
type ButtonVariant = "primary" | "tinted" | "secondary" | "ghost" | "danger";
type ButtonSize = "lg" | "md" | "sm";

// A disabled primary drops to a flat surface rather than a dimmed gradient,
// so "can't press this" reads instantly — the only variant whose box style
// changes with `disabled`; the rest look the same disabled or not.
function boxStyleFor(C: ThemeValue["C"], CTRL: ThemeValue["CTRL"], variant: ButtonVariant, off: boolean): ViewStyle {
    const border = CTRL.border.regular;
    if (variant === "primary") {
        return off ? { backgroundColor: C.surface3 } : {};
    }
    return {
        tinted: { backgroundColor: C.tintBg, borderWidth: border, borderColor: C.tintBorder },
        secondary: { backgroundColor: C.surface2, borderWidth: border, borderColor: C.border },
        ghost: { backgroundColor: "transparent" },
        danger: { backgroundColor: C.dangerBg, borderWidth: border, borderColor: C.dangerBorder }
    }[variant];
}

function sizeStyleFor(RADII: ThemeValue["RADII"], CTRL: ThemeValue["CTRL"], size: ButtonSize): ViewStyle {
    return {
        height: CTRL.buttonHeight[size],
        paddingHorizontal: CTRL.buttonPaddingX[size],
        borderRadius: Math.min(RADII.control, CTRL.buttonHeight[size] / 2)
    };
}

function textColorFor(C: ThemeValue["C"], variant: ButtonVariant, off: boolean) {
    if (variant === "primary") {
        return off ? C.textFaint : C.onTint;
    }
    return { tinted: C.tintSoft, secondary: C.text, ghost: C.tintSoft, danger: C.danger }[variant];
}

export function Button({
    label,
    onPress,
    variant = "primary",
    disabled,
    busy,
    icon,
    size = "lg",
    style
}: {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    busy?: boolean;
    icon?: IconName;
    size?: ButtonSize;
    style?: StyleProp<ViewStyle>;
}) {
    const { C, CTRL, DECOR, GRAD, RADII, SHADOW } = useTheme();
    const off = Boolean(disabled || busy);
    const textColor = textColorFor(C, variant, off);
    const iconSize = CTRL.buttonIcon;
    const filled = variant === "primary" && !off;
    const gradient = filled && DECOR.primaryFill === "gradient";

    return (
        <AppPressable onPress={onPress} disabled={off} press="button" style={style}>
            <View
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: CTRL.buttonGap,
                        borderCurve: "continuous"
                    },
                    sizeStyleFor(RADII, CTRL, size),
                    boxStyleFor(C, CTRL, variant, off),
                    filled
                        ? {
                              // react-native-web has no special case for `experimental_backgroundImage` (it's a
                              // Fabric/native-only style prop name) — it passes the key straight through as an
                              // invalid CSS property, so the gradient silently no-ops on web. `backgroundImage` is
                              // the real CSS property name and DOES pass through correctly there.
                              ...(gradient
                                  ? Platform.OS === "web"
                                      ? { backgroundImage: GRAD }
                                      : { experimental_backgroundImage: GRAD }
                                  : { backgroundColor: C.tint }),
                              boxShadow: glowShadow(DECOR, C.tintGlow, SHADOW.e1)
                          }
                        : null
                ]}
            >
                {busy ? (
                    <Spinner size={iconSize - 2} color={textColor} />
                ) : icon ? (
                    <Icon name={icon} size={iconSize} color={textColor} />
                ) : null}
                {/* `truncate` also sets flexShrink: a label longer than its
                    button used to overflow the box rather than ellipsise,
                    because Yoga defaults flexShrink to 0. */}
                <AppText variant="button" tone={textColor} size={CTRL.buttonFontSize[size]} truncate>
                    {label}
                </AppText>
            </View>
        </AppPressable>
    );
}
