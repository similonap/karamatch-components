import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useColorScheme } from "react-native";

import { resolveSchemeName } from "./createTheme";
import type { Theme, ThemeScheme, ThemeTokens } from "./createTheme";
import { BUILT_IN_THEMES, DEFAULT_THEME } from "./themes";
import type { ColorScheme } from "./colors";

export type ThemeMode = ColorScheme | "system";

// One theme is one object (see createTheme.ts); this provider decides *which*
// theme and *which* scheme are live, then flattens the two halves into the
// single flat value components read. Flat on purpose: a component destructures
// `const { C, S, RADII } = useTheme()` and never walks a tree.
export interface ThemeValue extends ThemeTokens, ThemeScheme {
    /** The resolved scheme actually being rendered — never "system". */
    scheme: ColorScheme;
    /** What the app was told to use, including "system". */
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    /** Name of the live theme. */
    themeName: string;
    /** Switch themes at runtime. Unknown names are ignored. */
    setTheme: (name: string) => void;
    /** Everything registered, for building a theme picker. */
    themes: { name: string; label: string; schemeNames: ColorScheme[] }[];
    /** The live theme object, for the rare consumer that needs both schemes. */
    theme: Theme;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({
    children,
    theme,
    themes = BUILT_IN_THEMES,
    initialMode = "system"
}: {
    children: ReactNode;
    /**
     * The theme to start on — a registered name, or a `createTheme()` object
     * to use directly (it gets registered alongside `themes`). Changing this
     * prop switches themes; calling `setTheme()` from context takes over from
     * it after that.
     */
    theme?: string | Theme;
    /** The pickable set. Defaults to the three themes this shelf ships with. */
    themes?: Theme[];
    initialMode?: ThemeMode;
}) {
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>(initialMode);
    const [picked, setPicked] = useState<string | null>(null);

    const registry = useMemo(() => {
        const all = typeof theme === "object" && theme !== null ? [theme, ...themes.filter(other => other.name !== theme.name)] : themes;
        const map = new Map(all.map(entry => [entry.name, entry]));
        return { list: all, map };
    }, [theme, themes]);

    const requested = picked ?? (typeof theme === "string" ? theme : typeof theme === "object" && theme !== null ? theme.name : null);
    const active = (requested ? registry.map.get(requested) : undefined) ?? registry.list[0] ?? DEFAULT_THEME;

    const wanted: ColorScheme = mode === "system" ? (systemScheme === "light" ? "light" : "dark") : mode;
    const scheme = resolveSchemeName(active, wanted);

    const value = useMemo<ThemeValue>(() => {
        const { schemes, name, label, schemeNames, ...tokens } = active;
        return {
            ...tokens,
            ...schemes[scheme],
            scheme,
            mode,
            setMode,
            themeName: name,
            setTheme: setPicked,
            themes: registry.list.map(entry => ({ name: entry.name, label: entry.label, schemeNames: entry.schemeNames })),
            theme: active
        };
    }, [active, scheme, mode, registry]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const value = useContext(ThemeContext);
    if (!value) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return value;
}
