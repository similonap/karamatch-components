import type { Theme } from "../createTheme";
import { neonNights } from "./neonNights";
import { paperPress } from "./paperPress";
import { softAurora } from "./softAurora";

export { neonNights } from "./neonNights";
export { paperPress } from "./paperPress";
export { softAurora } from "./softAurora";

/**
 * What `ThemeProvider` offers when it isn't given a `themes` prop. The first
 * entry is the default, and every one of them supports both dark and light.
 */
export const BUILT_IN_THEMES: Theme[] = [neonNights, paperPress, softAurora];

export const DEFAULT_THEME = neonNights;
