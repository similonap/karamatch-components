# karamatch-mobile

An on-device Storybook of a React Native / Expo component shelf, ported from
the KaraMatch web client's design system (`karamatch-web/src/ui.tsx`,
`design/tokens.ts`, `design/icons.tsx`). The point of this app is the shelf
in `src/components/` — everything here is meant to be copied into a
student's own KaraMatch mobile app and assembled into real screens, not
extended in place.

## Running it

```sh
npm install
npm start                    # Storybook (default, prints Expo Go options)

npm run ios                  # the placeholder app on iOS simulator
npm run android               # the placeholder app on Android emulator

npm run storybook:ios        # Storybook on iOS simulator
npm run storybook:android    # Storybook on Android emulator
```

No dev client or prebuild is required — everything here runs in plain Expo Go.

### Storybook vs. the placeholder app

`App.tsx` renders the on-device Storybook UI by default. Every component
under `src/components/` has a co-located `*.stories.tsx` with on-device
controls, actions, and backgrounds wired up — flip through them from the
Storybook UI's own navigator, and use the "Theme" toolbar toggle to check a
component in both light and dark.

Setting `EXPO_PUBLIC_STORYBOOK=false` (what `npm run ios`/`npm run android`
do under the hood, or `npm run start:app` for the platform picker) switches
`App.tsx` to `src/PlaceholderApp.tsx` instead — a minimal two-screen app (a
venue list and a venue detail screen) assembled purely from shelf
components, just enough to prove the pieces actually compose into a real
screen rather than only ever being seen one at a time in Storybook. It is
not itself part of the shelf.

## Browsing the docs site

`.github/workflows/deploy-registry.yml` publishes this same Storybook —
exported to a static site with `npm run build:web`
(`expo export --platform web`) — to GitHub Pages on every push to `main`, at
`https://similonap.github.io/karamatch-components/`. Every story has its usual
Controls/Actions/Backgrounds/Theme panels, plus two custom ones: an
**Install** panel showing the exact `npx shadcn@latest add .../r/<name>.json`
command for whatever component is currently selected (and what it pulls in,
if anything) — same idea as an individual component page on ui.shadcn.com —
and a **Code** panel showing a pasteable JSX snippet
(`<ComponentName prop="value" ... />`) built from that story's *current*
args, live-updating as you tweak Controls. Handy for grabbing the exact data
shape a component expects (e.g. a domain composite's mock object) without
digging through its `.stories.tsx` file. One-time setup: Settings → Pages →
Build and deployment → source: **GitHub Actions** (the repo needs to be
public for Pages to work on the free tier).

## Installing components via the registry

Components are also distributable one at a time through the standard
[shadcn CLI](https://ui.shadcn.com/docs/cli) — same mechanism
[reactnativereusables.com](https://reactnativereusables.com) uses, no custom
CLI needed. The same workflow regenerates `docs/r/` from the current `src/`
(via `npm run build:registry`) alongside the Storybook site above — no need
to remember to rebuild and commit `docs/` by hand (it's gitignored; both
`docs/r/` and the exported site are CI-only build output).

The shadcn CLI's `add` command needs a `components.json` to run, and if it
doesn't find one it launches its interactive `init` wizard — which assumes a
Tailwind/CSS web project (it'll ask you to pick Base UI/Radix, then send you
to a browser-based "custom preset" builder since it has no built-in preset
for Expo). None of that applies here — the shelf is plain `StyleSheet`-based
RN with no Tailwind — so skip `init` entirely by hand-writing
`components.json` yourself in the consumer project:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/utils"
  },
  "registries": {
    "@karamatch": "https://similonap.github.io/karamatch-components/r/{name}.json"
  }
}
```

The `tailwind` block is required by the CLI's schema even though nothing in
the shelf reads it — leave it as-is. `aliases.components`/`aliases.utils`
must resolve via a real path alias, so add the matching entry to
`tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Then install a component and everything it transitively needs in one go:

```sh
npx shadcn@latest add https://similonap.github.io/karamatch-components/r/button.json
```

## Using the shelf in your own app

Copy `src/` into your project (or just the pieces you need — nothing in
`src/components/` reaches outside `src/`) and import from the barrel:

```tsx
import { Button, Card, VenueCard, useTheme, ThemeProvider } from "./shelf";
```

Wrap your app in `ThemeProvider` (and `SafeAreaProvider` from
`react-native-safe-area-context`) once, near the root — every component in
the shelf calls `useTheme()` internally to read colours/spacing/type, and
`useTheme()` throws `Error: useTheme must be used within a ThemeProvider` if
it's rendered outside one. This is the single most common setup mistake:
installing a component (either by copying `src/` or via `npx shadcn add`,
see above) is not enough on its own — `ThemeProvider` has to be mounted
above it in the tree, in every entry point that renders shelf components
(including Storybook-less unit tests, if you render shelf components in
them).

If your app uses `expo-router`, the root layout is the right place, since
everything under it shares one tree:

```tsx
// app/_layout.tsx
import { ThemeProvider } from "@/theme/ThemeProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

Without `expo-router`, wrap the root component you register with Expo
instead (`App.tsx`, or wherever your `registerRootComponent`/navigation
container lives):

```tsx
// App.tsx
import { ThemeProvider } from "@/theme/ThemeProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>{/* your navigator / screens */}</ThemeProvider>
    </SafeAreaProvider>
  );
}
```

Adjust the import path to match how you pulled the shelf in: `@/theme/ThemeProvider`
if you installed via the registry (per the `@/*` alias set up above) or copied
`src/` to `src/` with that alias configured, `./shelf` if you're importing
from the barrel (`src/index.ts`), or a relative path if you copied `theme/`
somewhere else.

`ThemeProvider` also takes an optional `initialMode` prop (`"light" | "dark" | "system"`,
defaults to `"system"`) if you want to force a scheme instead of following
the OS setting.

`src/types.ts` has local copies of the API response shapes the domain
composites are typed against (`VenueNearby`, `PartyView`, `NotificationView`,
etc.) — these mirror `karamatch-web/src/api.ts`, i.e. what karamatch-api's
endpoints actually return, not the raw database models. If your app's API
client already has its own types for the same endpoints, delete
`src/types.ts` and point the domain composites at those instead; the props
are structural, not nominal.

## What's in the shelf

- **`theme/`** — colour palettes (light + dark), the spacing/radius/type
  scale, and `ThemeProvider`/`useTheme()`.
- **`icons/`** — one stroked icon set (`Icon`, `StarIcon`), drawn with
  `react-native-svg` from the same path data as the web version.
- **`components/primitives/`** — ~33 generic, reusable atoms: buttons, form
  fields, avatars, chips, list rows, loading/empty/error states, a toast and
  a confirm dialog, etc.
- **`components/scaffolding/`** — `Screen`, `AppBar`, `BottomBar`: safe-area-
  aware screen chrome.
- **`components/domain/`** — composites typed against the real API models:
  `VenueCard`, `PartyCard`, `SongRow`, `NotificationRow`, `FriendRow`,
  `ReviewCard`, `ChatBubble`, `UserProfileHeader`, `VenueLocationCard`.
- **`utils/`** — date/price formatting, an avatar-colour hash, `useAsync`/
  `useDebounced`.
- **`mocks/`** — fixtures for every domain type, used by the domain stories
  and handy for your own screens before a real API is wired up.

## What's deliberately not here

- **A live, pannable map.** The web app embeds Leaflet in two places —
  `VenueMap` (a read-only "here it is" view on `VenueDetail`) and the
  onboarding `Location` screen (drag the map to drop a pin, with live
  reverse-geocoding as you pan). The native equivalent needs a
  dev-client/prebuild (`react-native-maps` or similar), which breaks running
  in plain Expo Go, so neither is in the shelf. `VenueLocationCard` is a
  static stand-in for the first case that hands off to the device's own Maps
  app. For the onboarding case there is no map-based stand-in — build a
  search-first picker instead: `SearchField` + an `AppPressable` results list
  (both already in the shelf) hitting the same free Nominatim endpoints the
  web version uses (`/search` to look up a typed place, `/reverse` to label
  a point), plus `expo-location` for "use my current location" (it reads
  GPS coordinates without needing a dev client, unlike `react-native-maps`).
  That gets you the same outcome — the user ends up with a `{ lat, lng,
  label }` — without a live pan-to-move map. If you need the actual pannable
  map for either case, that's where you'll need to step outside Expo Go.
- **Screen transitions.** The web version's `Transition` (push/pop/fade) is
  navigator-level choreography that belongs to whatever stack router you
  wire up (e.g. React Navigation's native stack already animates this) —
  the shelf has no navigator of its own to hook one into.
- **`PhoneFrame`/`StatusBar`.** Artifacts of faking a native device inside a
  browser; meaningless once the app is actually native.

## Notes on the port

- Fonts (`Unbounded`, `Outfit`) load via `@expo-google-fonts/*` +
  `useFonts()` in `App.tsx`, gated behind `expo-splash-screen`, rather than
  a build-time `expo-font` config plugin — the plugin takes a font family
  name from each `.ttf`'s own internal metadata, and Google Fonts' static
  weight files for these two families don't all carry distinct names (some
  weights collide), which would make specific weights unreliable to target
  on iOS. `useFonts()` sidesteps that by registering each weight under an
  explicit, unique key.
- Every `T.*` type-ramp entry bakes in one specific weighted font family
  (e.g. `Outfit_700Bold`) instead of a base family plus a numeric
  `fontWeight`, since React Native can't fake a weight onto a single static
  font file the way CSS can.
- Icons take an explicit `color` prop everywhere (no default) — React
  Native SVG has no `currentColor`/CSS inheritance to fall back on.
