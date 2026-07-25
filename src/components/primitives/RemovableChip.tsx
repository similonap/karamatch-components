import { Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import { AppPressable } from "./AppPressable";

// Ported from karamatch-web/src/screens/Profile.tsx's inline "picked song"
// chip — a fully tappable pill (not just its close icon) that removes the
// item, used for favourites already added before they're searchable again.
export function RemovableChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    const { C, CTRL, RADII, T } = useTheme();

    return (
        <AppPressable onPress={onRemove} accessibilityLabel={"Remove " + label} press="control">
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: C.tintBg,
                    borderWidth: CTRL.border.regular,
                    borderColor: C.tintBorder,
                    borderRadius: RADII.pill,
                    paddingVertical: 5,
                    paddingLeft: 11,
                    paddingRight: 8
                }}
            >
                <Text style={[T.chip, { color: C.tintSoft }]} numberOfLines={1}>
                    {label}
                </Text>
                <Icon name="close" size={13} weight="strong" color={C.tintSoft} />
            </View>
        </AppPressable>
    );
}
