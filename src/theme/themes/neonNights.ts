import { createTheme } from "../createTheme";

// The KaraMatch house look: near-black violet surfaces, a hot pink→purple
// gradient held back for the one primary action per screen, Unbounded over
// Outfit.
//
// It's deliberately an empty spec. Every default in tokens.ts and colors.ts
// *is* this theme, so there's nothing to restate — which also means the
// defaults are the reference for what a token is supposed to mean.
//
// Fonts: @expo-google-fonts/unbounded (700, 800) + /outfit (400, 500, 700, 800).
export const neonNights = createTheme({
    name: "neon-nights",
    label: "Neon Nights"
});
