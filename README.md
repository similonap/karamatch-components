# karamatch-mobile

A shelf of React Native / Expo components, ported from the KaraMatch web
client's design system. Browse them at
https://similonap.github.io/karamatch-components/, then pull the ones you
need into your own app.

## 1. Install a component

Browse the gallery, pick a component, and copy the install command from its
**Install** tab — it looks like this:

```sh
npx shadcn@latest add https://similonap.github.io/karamatch-components/r/button.json
```

This needs a `components.json` in your project. If you don't have one yet,
create it (skip the interactive setup wizard — it's built for Tailwind/web
projects and doesn't apply here):

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": { "css": "", "baseColor": "neutral", "cssVariables": true },
  "aliases": { "components": "@/components", "utils": "@/utils" },
  "registries": {
    "@karamatch": "https://similonap.github.io/karamatch-components/r/{name}.json"
  }
}
```

And make sure `@/*` resolves to your project root in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```

Then run the install command. It drops the component (and anything it
depends on) straight into your project.

## 2. Wrap your app in `ThemeProvider`

Every component reads its colors, spacing, and fonts through `useTheme()`,
which only works inside a `ThemeProvider`. Wrap your app once, near the root:

```tsx
// app/_layout.tsx
import { ThemeProvider } from "@/theme/ThemeProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
```

Skip this and you'll get `Error: useTheme must be used within a ThemeProvider`.

## 3. Use the component

```tsx
import { Button } from "@/components/primitives/Button";

<Button label="Book this room" onPress={() => {}} />
```

That's it — browse the gallery for what's available, install what you need,
and go.

## 4. Theming

Three themes ship with the shelf, and all of them support dark **and** light:

| Theme | `name` | Look |
| --- | --- | --- |
| Neon Nights (default) | `neon-nights` | Near-black violet, hot pink→purple gradient, Unbounded + Outfit |
| Soft Aurora | `soft-aurora` | Pastel pills, big soft glows, roomy controls, Quicksand + Nunito |
| Wireframe | `wireframe` | Greyscale lo-fi sketch: hairline outlines, no colour, no shadows, no motion, Inter |

Pick one, and switch appearance separately:

```tsx
<ThemeProvider theme="soft-aurora" initialMode="light">
  <Stack />
</ThemeProvider>
```

Or let the app change it at runtime — no remount, no prop drilling:

```tsx
const { themeName, themes, setTheme, mode, setMode } = useTheme();

<Segmented items={themes.map(t => ({ key: t.name, label: t.label }))} value={themeName} onChange={setTheme} />
<Segmented
  items={[{ key: "system", label: "System" }, { key: "dark", label: "Dark" }, { key: "light", label: "Light" }]}
  value={mode}
  onChange={setMode}
/>
```

See it live in the gallery under **Theme → Theming** (`Showcase`, `SideBySide`,
`Tokens`, `Switcher`), or switch the whole gallery over from the **Theme**
addon panel.

### Loading a theme's fonts

React Native can't synthesise a weight, so each theme names one registered
family per weight and those families have to be loaded before you render.
Install the packages for the theme(s) you use and load them once at the root:

```sh
# neon-nights (default)
npx expo install @expo-google-fonts/unbounded @expo-google-fonts/outfit
# soft-aurora
npx expo install @expo-google-fonts/quicksand @expo-google-fonts/nunito
# wireframe
npx expo install @expo-google-fonts/inter
```

```tsx
import { useFonts } from "@expo-google-fonts/outfit/useFonts";
import { Outfit_400Regular } from "@expo-google-fonts/outfit/400Regular";
// …one import per weight; see App.tsx in this repo for all three themes.

const [fontsLoaded] = useFonts({ Outfit_400Regular /* … */ });
if (!fontsLoaded) return null;
```

Weights per theme: `neon-nights` — Unbounded 700/800 + Outfit 400/500/700/800 ·
`soft-aurora` — Quicksand 600/700 + Nunito 400/500/700/800 ·
`wireframe` — Inter 400/500/600/700.

### Writing your own theme

A theme is plain data: the *differences* from the default. `createTheme()`
fills in everything you don't mention, so a brand recolour is a few lines and a
full redesign is still one file.

```tsx
// theme/themes/myBrand.ts
import { createTheme } from "@/theme/createTheme";

export const myBrand = createTheme({
  name: "my-brand",
  label: "My Brand",
  fonts: { bodyRegular: "Inter_400Regular", bodyBold: "Inter_700Bold" },
  radius: { sm: 4, md: 6, lg: 8, xl: 12, xxl: 16, full: 999 },
  radii: { control: 6, chip: 4 },              // semantic overrides
  controls: { buttonHeight: { lg: 48 }, border: { regular: 2 } },
  motion: { press: { button: { scale: 1 } } }, // no squash on buttons
  decor: { primaryFill: "solid", glow: "none" },
  schemes: {
    light: { colors: { bg: "#ffffff", tint: "#0057ff", selectBg: "#0057ff", selectText: "#ffffff" } },
    dark: { colors: { bg: "#05070f", tint: "#5b8cff" } }
  }
});
```

```tsx
<ThemeProvider themes={[myBrand, neonNights]} theme="my-brand">
  <Stack />
</ThemeProvider>
```

Everything the shelf draws with is a token, so a theme can go a long way past a
recolour: `soft-aurora` reshapes every control into a pill, grows the control
heights, swaps both typefaces and slows every press down, while `wireframe`
removes hue, elevation and animation altogether — neither touches a component.

Define only one scheme and the theme stays on it, ignoring the light/dark
switch. Pass a `createTheme()` object straight to `theme=` for a one-off.

### What's themeable

Every value a component draws with comes from one of these groups — no
component hardcodes a colour, radius, border width, duration or stroke.

| Group | What it controls |
| --- | --- |
| `C` (`colors`) | Surfaces, text, tint, status colours, plus roles: `select*` (how a selected pill/row/tile fills), `focus`, `track`, `knob`, `overlay`/`onOverlay`, `onAvatar` |
| `SHADOW` (`shadows`) | `e1`/`e2`/`e3` as raw `boxShadow` strings — a blur, or a hard offset rule |
| `GRAD` / `GRAD_TILE` (`gradient`, `tileGradient`) | Primary-action and brand-mark gradients |
| `AVATARS` (`avatarColors`) | The rotation generated avatars pick from |
| `T` (`type`) + `FONT` (`fonts`) | 17 type roles, rebuilt from your typefaces; per-role overrides for size, tracking, `textTransform` |
| `RADII` (`radii`) | Shape per *kind of thing*: `control`, `field`, `card`, `chip`, `pill`, `tile`, `plate`, `sheet`, `bubble`, `avatar`, `round`, `track` |
| `CTRL` (`controls`) | Control geometry: button/field/chip/row/segment sizes, toggle, borders (`hairline`/`regular`/`strong`) |
| `MOTION` (`motion`) | Press feedback per role (`button`, `control`, `snap`, `surface`, `row`), press/toggle/spinner/skeleton timings |
| `DECOR` (`decor`) | `primaryFill`, `glow`, `iconStroke`(`Strong`), `brandRadiusRatio`, `placeholderBorder`, `appBarBorder` |
| `S`, `S2`, `R`, `LAYOUT` | Spacing grid, half-steps, raw radius scale, gutter/app bar/tab bar/touch target |

The defaults live in `theme/tokens.ts` and `theme/colors.ts`, and the default
theme is deliberately an empty spec (`theme/themes/neonNights.ts`) — so those
files double as the reference for what each token means.

### Checking a theme is legible

A palette of *roles* only works if each role reads against the role underneath
it, and that's easy to get wrong — a `selectText` that's fine over a tint wash
disappears the moment a theme fills `selectBg` solid. `npm run check:contrast`
measures every foreground/background pair the components actually draw, for
every registered theme in both schemes, compositing translucent tokens over the
surface beneath them:

```sh
npm run check:contrast
# wireframe      light  30/30 pairs pass
```

It exits non-zero on anything below threshold (WCAG AA where it applies: 4.5
for body text, 3.0 for large/bold text and meaningful glyphs), so a new theme
can't ship invisible text. Run it after adding or repitching a palette.
