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

## 3. Load the fonts

The components never set `fontWeight` — React Native can't synthesise a weight
onto a font file, so every type role names an exact weighted family
(`Outfit_700Bold`, not Outfit at 700). Those families have to be registered
before anything renders: an unregistered `fontFamily` silently falls back to the
system font on iOS and draws **nothing at all** on Android.

Install the font packages for the theme(s) you use:

```sh
# neon-nights (default)
npx expo install @expo-google-fonts/unbounded @expo-google-fonts/outfit
# soft-aurora
npx expo install @expo-google-fonts/quicksand @expo-google-fonts/nunito
# wireframe
npx expo install @expo-google-fonts/inter
```

| Theme | Packages | Families to register |
| --- | --- | --- |
| `neon-nights` | `unbounded`, `outfit` | `Unbounded_700Bold`, `Unbounded_800ExtraBold`, `Outfit_400Regular`, `Outfit_500Medium`, `Outfit_700Bold`, `Outfit_800ExtraBold` |
| `soft-aurora` | `quicksand`, `nunito` | `Quicksand_600SemiBold`, `Quicksand_700Bold`, `Nunito_400Regular`, `Nunito_500Medium`, `Nunito_700Bold`, `Nunito_800ExtraBold` |
| `wireframe` | `inter` | `Inter_400Regular`, `Inter_500Medium`, `Inter_600SemiBold`, `Inter_700Bold` |

Then load them once at the root, above `ThemeProvider`, and hold the splash
screen until they're ready:

```sh
npx expo install expo-font expo-splash-screen
```

```tsx
// app/_layout.tsx
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/theme/ThemeProvider";

// Import each weight from its own subpath. The package root re-exports every
// weight from one file, which makes Metro bundle all nine .ttf files as assets
// even though you only use four.
import { Outfit_400Regular } from "@expo-google-fonts/outfit/400Regular";
import { Outfit_500Medium } from "@expo-google-fonts/outfit/500Medium";
import { Outfit_700Bold } from "@expo-google-fonts/outfit/700Bold";
import { Outfit_800ExtraBold } from "@expo-google-fonts/outfit/800ExtraBold";
import { Unbounded_700Bold } from "@expo-google-fonts/unbounded/700Bold";
import { Unbounded_800ExtraBold } from "@expo-google-fonts/unbounded/800ExtraBold";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Unbounded_700Bold,
    Unbounded_800ExtraBold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
    Outfit_800ExtraBold
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Render nothing while the splash screen is still up — mounting components
  // before the families exist is what produces invisible text on Android.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
```

The key is the object keys: `useFonts` registers each family under the name you
give it, and that name is exactly what the theme's `fonts` tokens reference.
Using the imported constants as shorthand properties keeps the two in sync.

A few things worth knowing:

- **Switching themes at runtime?** Load every family every theme you offer names
  — `useFonts` runs once, and a theme swap can't go back and fetch more. See
  `App.tsx` in this repo, which loads all three themes' families for exactly
  that reason.
- **Your own `.ttf`/`.otf` files** work the same way — drop them in
  `assets/fonts/` and register them under whatever name your theme uses:
  ```tsx
  const [fontsLoaded] = useFonts({
    MyBrand_Regular: require("./assets/fonts/MyBrand-Regular.ttf"),
    MyBrand_Bold: require("./assets/fonts/MyBrand-Bold.ttf")
  });
  ```
  Then name those strings in `createTheme({ fonts: { … } })` (see
  [Writing your own theme](#writing-your-own-theme)).
- **Skipping the loading flash.** In a development build or a bare app you can
  embed the files natively with the `expo-font` config plugin instead, which
  makes them available at launch with no `useFonts` call:
  ```json
  ["expo-font", { "fonts": ["node_modules/@expo-google-fonts/outfit/400Regular/Outfit_400Regular.ttf"] }]
  ```
  This needs a rebuild (`npx expo prebuild` / EAS Build) and doesn't apply to
  Expo Go or web, so `useFonts` stays the portable default.
- **Web** loads the same families over `@font-face` automatically via
  `react-native-web`; nothing extra to configure.

## 4. Use the component

```tsx
import { Button } from "@/components/primitives/Button";

<Button label="Book this room" onPress={() => {}} />
```

That's it — browse the gallery for what's available, install what you need,
and go.

### Prop shapes

The domain components (`VenueCard`, `PartyCard`, `FriendRow`, …) render real
data, so they have to say something about its shape. **They don't ship a
domain model.** There is no `types.ts` to import and nothing to keep in sync
with your API. Each component declares only the fields it actually draws, in
its own file, exported as `<Component>Props`:

```tsx
// SongRow.tsx
export type SongRowProps = {
  song: { title: string; artist: string; coverArt?: string };
  selected: boolean;
  onToggle: () => void;
};
```

TypeScript is structural, so **your own API type already satisfies this** as
long as it carries those fields. No import, no adapter, no mapping layer:

```tsx
// Your app — your Song, your field names, your extra fields.
const songs = await api.get<Song[]>("/songs");

{songs.map(song => (
  <SongRow key={song.id} song={song} selected={picked.has(song.id)} onToggle={...} />
))}
```

Extra fields are always fine. Two consequences worth knowing:

- **Ids are `string | number`** wherever a component takes one, because they
  only seed a fallback avatar colour. Either flavour of id works.
- **A *fresh* object literal passed straight to a prop** is excess-property-
  checked by TypeScript, so `song={{ ...apiSong, note: "extra" }}` is
  rejected while `song={apiSong}` is fine. Assign to a variable first. This
  only bites in test and story code; real data arrives through variables.

If your API field names differ, map at the call site (`song={{ title: s.name,
artist: s.by }}`) rather than reshaping your whole model.

## 5. Building a screen

The scaffolding components (`AppBar`, `Screen`, `ListScreen`, `BottomBar`,
`BottomTabBar`) follow one rule: **a screen owns its own chrome.** Turn the
navigator's header off and compose the screen yourself.

```tsx
// app/_layout.tsx
<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }} />
```

```tsx
// app/venue.tsx
import { useRouter } from "expo-router";
import { AppBar } from "@/components/scaffolding/AppBar";
import { Screen } from "@/components/scaffolding/Screen";

export default function Venue() {
  const router = useRouter();

  return (
    <>
      <AppBar title="Venue detail" onBack={router.back} />
      <Screen>{/* … */}</Screen>
    </>
  );
}
```

The route's container is already `flex: 1`, so a fragment is enough: `AppBar`
sizes to its content and `Screen` takes the rest.

A few things this buys you, and one thing to watch:

- **`AppBar` reserves the status-bar inset itself.** Nothing else does —
  `Screen` pads the *bottom* inset only. A screen with no `AppBar` draws its
  first element under the status bar, so either mount a bar or pad the top
  yourself.
- **`contentInsetAdjustmentBehavior` won't save you.** `Screen` sets it, but
  it's iOS-only and only fires under a native header — with `headerShown:
  false` it does nothing.
- **Need the bar's height?** Use `useAppBarHeight()`, not `LAYOUT.appBar`.
  The token is the bar's row; the hook adds the inset above it. This is what
  `Screen`'s `keyboardOffset` wants:

  ```tsx
  const appBarHeight = useAppBarHeight();

  <AppBar title="Sign in" onBack={router.back} />
  <Screen scroll={false} avoidKeyboard keyboardOffset={appBarHeight}>
  ```

- **Centred screens want `scroll={false}`.** A welcome screen or an empty
  state isn't a scrolling body; `<Screen scroll={false} style={{ justifyContent: "center" }}>`
  is the case that prop exists for. Note `style` lands on the scroll view's
  *content container* when `scroll` is left on, so use `flexGrow: 1` there
  rather than `flex: 1`.

### Putting the bar in the navigator instead

If you'd rather keep titles on the route, install `app-bar-header` and hand
`appBarHeader()` to the navigator — leave `headerShown` alone, since a custom
`header` only renders when the header is shown:

```tsx
import { appBarHeader } from "@/components/scaffolding/AppBarHeader";

<Stack screenOptions={{ header: appBarHeader(), contentStyle: { backgroundColor: C.bg } }}>
  <Stack.Screen name="venue" options={{ title: "Venue detail" }} />
  <Stack.Screen name="welcome" options={{ headerShown: false }} />
</Stack>
```

Back affordance and title come from the route. Don't write the render prop by
hand: a navigator header renders *outside* the screen container, so
`contentStyle` doesn't paint behind it — `appBarHeader()` keeps the bar's
background on, which a hand-rolled `<AppBar />` with `transparent` would not.

Nested layouts do **not** inherit `screenOptions` from the root one. A bare
`<Stack />` in `app/(app)/_layout.tsx` gets the stock header and an unthemed
background back, whatever the root layout says.

## 6. Theming

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

### Text

`AppText` is the typography primitive — pick a role from the ramp and a tone
from the palette, and both follow the live theme:

```tsx
<AppText variant="title">Karaoke near you</AppText>
<AppText variant="caption" tone="textMuted">Neon Nights · 21:00</AppText>
<AppText variant="bodyStrong" size={16} truncate>{venue.name}</AppText>
```

`variant` accepts any of the 17 ramp roles (`display`, `title`, `heading`,
`navTitle`, `bodyStrong`, `body`, `callout`, `caption`, `captionStrong`,
`footnote`, `sectionHeader`, plus `button`, `chip`, `tab`, `input`, `numeric`,
`wordmark`). `weight` swaps the registered font family rather than setting
`fontWeight`, since React Native can't synthesise a weight onto a font file.
`truncate` also sets `flexShrink`, without which a clamped label overflows its
row instead of ellipsising. For a `TextInput`, which can't be an `AppText`,
`useTextStyle()` returns the same resolved style.

Each theme brings its own two typefaces, so switching theme means the new
theme's families must already be registered — see
[3. Load the fonts](#3-load-the-fonts).

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

The strings in `fonts` are family names, not packages — each one has to match a
key you registered with `useFonts` ([3. Load the fonts](#3-load-the-fonts)), or
text in that role renders blank on Android. Omit `fonts` entirely and the theme
keeps Unbounded + Outfit.

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
