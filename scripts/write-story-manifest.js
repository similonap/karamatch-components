// Regenerates .rnstorybook/generated/install-manifest.json, which maps a
// story's `title` (e.g. "Primitives/Button") to the registry item it comes
// from — consumed by the "Install" addon panel
// (.rnstorybook/addons/install-command) so it can show the right
// `npx shadcn@latest add .../r/<name>.json` command for whatever story is
// currently being viewed.
//
// Reuses build-registry.js's own `buildItems()` (name/dependency
// resolution, including the directory-qualifying collision handling) so
// this can never drift from what's actually published to docs/r/.
const fs = require("fs");
const path = require("path");
const { buildItems } = require("./build-registry");

const ROOT = path.join(__dirname, "..");
const OUT_FILE = path.join(ROOT, ".rnstorybook", "generated", "install-manifest.json");

// Every story file in this repo declares its meta title as `"Group/Name"`
// (e.g. "Primitives/Button", "Domain/VenueCard") — requiring a "/" in the
// matched value is what keeps this from accidentally matching an unrelated
// `title:` property elsewhere in the same file (e.g. a story's own
// `args: { title: "..." }`), without needing a full TS parse for one string.
const TITLE_PATTERN = /title:\s*["'`]([^"'`]*\/[^"'`]*)["'`]/;

function extractStoryTitle(absStoriesPath) {
    if (!fs.existsSync(absStoriesPath)) {
        return null;
    }
    const match = fs.readFileSync(absStoriesPath, "utf8").match(TITLE_PATTERN);
    return match ? match[1] : null;
}

function writeInstallManifest() {
    const items = buildItems();
    const manifest = {};

    for (const item of items) {
        const storiesPath = item.absPath.replace(/\.tsx?$/, ".stories.tsx");
        const title = extractStoryTitle(storiesPath);
        if (!title) {
            continue;
        }
        manifest[title] = {
            name: item.name,
            dependencies: item.dependencies,
            registryDependencies: item.registryDependencies
        };
    }

    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + "\n");
}

module.exports = { writeInstallManifest };

if (require.main === module) {
    writeInstallManifest();
}
