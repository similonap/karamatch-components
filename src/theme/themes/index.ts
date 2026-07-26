import type { Theme } from "../createTheme";
import { neonNights } from "./neonNights";
import { softAurora } from "./softAurora";
import { wireframe } from "./wireframe";

export { neonNights } from "./neonNights";
export { softAurora } from "./softAurora";
export { wireframe } from "./wireframe";

/**
 * What `ThemeProvider` offers when it isn't given a `themes` prop. The first
 * entry is the default, and every one of them supports both dark and light.
 */
export const BUILT_IN_THEMES: Theme[] = [neonNights, softAurora, wireframe];

export const DEFAULT_THEME = neonNights;
