import { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
// Imported from each weight's own subpath, not the package root — the root
// barrel re-exports every weight from one file, which makes Metro bundle
// every weight's .ttf as an asset even though only these are ever used.
//
// Each theme brings its own two typefaces (see src/theme/themes/), so this app
// loads every family the shipped themes name: it can switch theme at runtime,
// and an unregistered `fontFamily` renders as nothing on Android.
// A real app only loads the families of the theme(s) it actually uses.
import { useFonts } from "@expo-google-fonts/outfit/useFonts";
import { Outfit_400Regular } from "@expo-google-fonts/outfit/400Regular";
import { Outfit_500Medium } from "@expo-google-fonts/outfit/500Medium";
import { Outfit_700Bold } from "@expo-google-fonts/outfit/700Bold";
import { Outfit_800ExtraBold } from "@expo-google-fonts/outfit/800ExtraBold";
import { Unbounded_700Bold } from "@expo-google-fonts/unbounded/700Bold";
import { Unbounded_800ExtraBold } from "@expo-google-fonts/unbounded/800ExtraBold";
// Wireframe
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
// Soft Aurora
import { Quicksand_600SemiBold } from "@expo-google-fonts/quicksand/600SemiBold";
import { Quicksand_700Bold } from "@expo-google-fonts/quicksand/700Bold";
import { Nunito_400Regular } from "@expo-google-fonts/nunito/400Regular";
import { Nunito_500Medium } from "@expo-google-fonts/nunito/500Medium";
import { Nunito_700Bold } from "@expo-google-fonts/nunito/700Bold";
import { Nunito_800ExtraBold } from "@expo-google-fonts/nunito/800ExtraBold";

import StorybookUI from "./.rnstorybook";
import { PlaceholderApp } from "./src/PlaceholderApp";
import { ThemeProvider } from "./src/theme/ThemeProvider";

// This app's whole purpose is an on-device Storybook of the component shelf
// in src/. `EXPO_PUBLIC_STORYBOOK=false npm start` switches to a tiny
// two-screen app instead, just enough to prove the shelf assembles into a
// real screen — see src/PlaceholderApp.tsx.
const SHOW_STORYBOOK = process.env.EXPO_PUBLIC_STORYBOOK !== "false";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
    const [fontsLoaded, fontError] = useFonts({
        Unbounded_700Bold,
        Unbounded_800ExtraBold,
        Outfit_400Regular,
        Outfit_500Medium,
        Outfit_700Bold,
        Outfit_800ExtraBold,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Quicksand_600SemiBold,
        Quicksand_700Bold,
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_700Bold,
        Nunito_800ExtraBold
    });

    const onLayout = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    if (SHOW_STORYBOOK) {
        // The Storybook UI brings its own decorators (theme, safe area) via
        // .rnstorybook/preview.tsx, so it doesn't need this file's providers.
        return (
            <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
                <StorybookUI />
            </GestureHandlerRootView>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <PlaceholderApp />
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
