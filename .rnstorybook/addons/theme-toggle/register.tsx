import { useState } from "react";
import { addons, types } from "storybook/manager-api";
import { UPDATE_GLOBALS } from "storybook/internal/core-events";
import { Pressable, Text, View } from "react-native";

import { BUILT_IN_THEMES, DEFAULT_THEME } from "../../../src/theme/themes";

// The on-device Storybook UI (unlike web Storybook) never renders a toolbar
// for `globalTypes` — it only renders addon *panels* (the Controls/Actions/
// Backgrounds tabs in the bottom sheet), the same way
// @storybook/addon-ondevice-backgrounds does. So switching the "theme" and
// "scheme" globals needs its own panel rather than the `toolbar` config in
// preview.tsx, which has no UI to attach to here.
//
// Two things that don't work in this on-device setup, both discovered the
// hard way:
// - `useGlobals()`/`useStorybookApi()` throw ("Cannot read property
//   'getGlobals' of undefined") — `addons.add`'s `render()` is invoked as a
//   plain function call (react-native-ui's `MobileAddonsPanel.tsx`), not
//   inside whatever provider those hooks need.
// - `api.getGlobals()`/`api.updateGlobals()` (the `api` object handed to
//   `addons.register`'s callback) throw "undefined is not a function" — the
//   RN manager composes a reduced set of API modules and doesn't include
//   the "globals" one (it targets a web-only "storybook-preview-iframe").
// What does work, taken straight from @storybook/react-native's own bundled
// backgrounds panel: emitting the core `UPDATE_GLOBALS` event on the addons
// channel directly.
//
// This panel is Storybook chrome, not shelf UI: it sits outside
// ThemeProvider, so its own colours are hardcoded on purpose.
const ADDON_ID = "karamatch/theme-toggle";
const PANEL_ID = ADDON_ID + "/panel";

const ACCENT = "#ff3d8f";

function Option({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                flex: 1,
                minHeight: 44,
                paddingHorizontal: 8,
                paddingVertical: 6,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: active ? ACCENT : "#3a3a3a",
                backgroundColor: active ? "rgba(255,61,143,0.14)" : "transparent",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Text style={{ color: active ? ACCENT : "#8d8d8d", fontWeight: "700", textAlign: "center" }}>{label}</Text>
        </Pressable>
    );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={{ gap: 6 }}>
            <Text style={{ color: "#6f6f6f", fontSize: 11, fontWeight: "700", letterSpacing: 0.8 }}>{title}</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>{children}</View>
        </View>
    );
}

function ThemePanel() {
    // No reliable way to read the live current globals here (see above), so
    // this tracks its own local UI state, starting from preview.tsx's
    // `globalTypes` defaults.
    const [theme, setTheme] = useState(DEFAULT_THEME.name);
    const [scheme, setScheme] = useState<"dark" | "light">("dark");

    function update(next: { theme?: string; scheme?: "dark" | "light" }) {
        if (next.theme) {
            setTheme(next.theme);
        }
        if (next.scheme) {
            setScheme(next.scheme);
        }
        addons.getChannel().emit(UPDATE_GLOBALS, { globals: { theme, scheme, ...next } });
    }

    return (
        <View style={{ gap: 14, padding: 16 }}>
            <Row title="THEME">
                {BUILT_IN_THEMES.map(entry => (
                    <Option
                        key={entry.name}
                        label={entry.label}
                        active={theme === entry.name}
                        onPress={() => update({ theme: entry.name })}
                    />
                ))}
            </Row>
            <Row title="SCHEME">
                <Option label="Dark" active={scheme === "dark"} onPress={() => update({ scheme: "dark" })} />
                <Option label="Light" active={scheme === "light"} onPress={() => update({ scheme: "light" })} />
            </Row>
        </View>
    );
}

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: "Theme",
        render: () => <ThemePanel />
    });
});
