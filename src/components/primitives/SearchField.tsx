import { TextInput, View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { Icon } from "../../icons/Icon";
import { AppPressable } from "./AppPressable";

// Ported from karamatch-web/src/ui.tsx's `SearchField` — a search field with
// a leading glyph and a clear button once it has content.
export function SearchField({
    value,
    onChange,
    placeholder
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    const { C, CTRL, RADII, T } = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                height: CTRL.searchHeight,
                paddingLeft: CTRL.fieldPaddingX,
                paddingRight: CTRL.fieldPaddingX - 4,
                borderRadius: Math.min(RADII.field, CTRL.searchHeight / 2),
                borderCurve: "continuous",
                backgroundColor: C.surface2,
                borderWidth: CTRL.border.regular,
                borderColor: C.border
            }}
        >
            <Icon name="search" size={17} color={C.textFaint} />
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor={C.textFaint}
                style={[T.input, { flex: 1, color: C.text, padding: 0 }]}
            />
            {value ? (
                <AppPressable
                    onPress={() => onChange("")}
                    accessibilityLabel="Clear search"
                    style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center", borderRadius: Math.min(RADII.round, 14) }}
                >
                    <Icon name="close" size={15} weight="strong" color={C.textFaint} />
                </AppPressable>
            ) : null}
        </View>
    );
}
