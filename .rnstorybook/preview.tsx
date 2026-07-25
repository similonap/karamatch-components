import type { Preview } from "@storybook/react-native";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useTheme, ThemeProvider } from "../src/theme/ThemeProvider";
import { DEFAULT_THEME } from "../src/theme/themes";

// Every story renders inside SafeAreaProvider + ThemeProvider, so a
// component pulled straight from the shelf behaves exactly like it would in
// a student's own app — no per-story boilerplate.
//
// Two globals drive it: "theme" picks which of the shipped themes is live and
// "scheme" picks dark/light within it. Both are switched from the custom
// "Theme" addon panel (see .rnstorybook/addons/theme-toggle) rather than a
// `toolbar` here — the on-device Storybook UI, unlike web Storybook, never
// renders one. The provider is `key`-ed on the pair so a switch remounts
// cleanly, since `initialMode` is only read once.
const preview: Preview = {
    globalTypes: {
        theme: {
            description: "Theme",
            defaultValue: DEFAULT_THEME.name
        },
        scheme: {
            description: "Colour scheme",
            defaultValue: "dark"
        }
    },
    decorators: [
        (Story, context) => {
            const themeName = typeof context.globals.theme === "string" ? context.globals.theme : DEFAULT_THEME.name;
            const scheme = context.globals.scheme === "light" ? "light" : "dark";
            return (
                <SafeAreaProvider>
                    <ThemeProvider key={themeName + scheme} theme={themeName} initialMode={scheme}>
                        <ThemedBackground>
                            <Story />
                        </ThemedBackground>
                    </ThemeProvider>
                </SafeAreaProvider>
            );
        }
    ]
};

export default preview;

function ThemedBackground({ children }: { children: React.ReactNode }) {
    const { C } = useTheme();
    return <View style={{ flex: 1, backgroundColor: C.bg }}>{children}</View>;
}
