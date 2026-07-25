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
