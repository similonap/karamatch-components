const { getDefaultConfig } = require("expo/metro-config");
const { withStorybook } = require("@storybook/react-native/metro/withStorybook");
const { writeInstallManifest } = require("./scripts/write-story-manifest");

// Regenerates .rnstorybook/generated/install-manifest.json (read by the
// "Install" addon panel) from the current src/ every time Metro starts,
// same reasoning as storybook.requires.ts below — it should never be
// hand-edited or allowed to go stale.
writeInstallManifest();

const config = getDefaultConfig(__dirname);

// Generates .rnstorybook/storybook.requires from the `stories` glob in
// .rnstorybook/main.ts every time Metro starts. `enabled: false` strips
// Storybook from the bundle entirely — same EXPO_PUBLIC_STORYBOOK flag
// App.tsx reads to pick Storybook vs. PlaceholderApp at runtime, so
// `npm run start:app` both switches the screen and drops Storybook's own
// code out of that bundle.
module.exports = withStorybook(config, {
    enabled: process.env.EXPO_PUBLIC_STORYBOOK !== "false"
});
