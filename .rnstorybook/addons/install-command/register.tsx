import { addons, types } from "storybook/manager-api";
import { Platform, Text, View } from "react-native";

import installManifest from "../../generated/install-manifest.json";

// Shows the shadcn CLI install command for whichever component is currently
// being viewed — e.g. shadcn.com's per-component docs page. `api` (passed
// in from `addons.register`'s callback, not `render`'s own params — same
// as @storybook/addon-ondevice-controls's bundled ControlsPanel/
// BackgroundPanel) exposes `api.store()`, the same story store the
// built-in Backgrounds panel reads its per-story options from. Reading
// `getSelection()`/`fromId()` directly in render (rather than subscribing
// to a channel event) is enough — like those built-in panels, this one
// already re-renders whenever the selected story changes.
const ADDON_ID = "karamatch/install-command";
const PANEL_ID = ADDON_ID + "/panel";

// Native (Expo Go/simulators) has no browser location to read the deployed
// origin from, so it falls back to the known Pages URL. On web the origin
// is read live instead, so the command shown is always correct for
// whichever URL the site actually ended up hosted at.
const FALLBACK_BASE_URL = "https://similonap.github.io/karamatch-components";

function registryBaseUrl(): string {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.location) {
        return `${window.location.origin}${window.location.pathname}`.replace(/\/$/, "");
    }
    return FALLBACK_BASE_URL;
}

type ManifestEntry = {
    name: string;
    dependencies: string[];
    registryDependencies: string[];
};

const MANIFEST: Record<string, ManifestEntry> = installManifest;

function CodeLine({ children }: { children: string }) {
    return (
        <Text
            selectable
            style={{
                color: "#ff3d8f",
                fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
                fontSize: 13,
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#3a3a3a",
                backgroundColor: "rgba(255,255,255,0.04)"
            }}
        >
            {children}
        </Text>
    );
}

// `addons.register`'s own `api` type doesn't (usefully) type `store()` —
// same story store @storybook/react-native's bundled BackgroundPanel reads
// its per-story options from, calling it the same way.
function InstallPanel({ api }: { api: any }) {
    const store = api.store();
    const storyId = store.getSelection()?.storyId;
    const story = storyId ? store.fromId(storyId) : undefined;
    const entry: ManifestEntry | undefined = story?.title ? MANIFEST[story.title] : undefined;

    if (!entry) {
        return (
            <View style={{ padding: 16 }}>
                <Text style={{ color: "#8d8d8d" }}>This story isn't part of the published registry.</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 16, gap: 12 }}>
            <CodeLine>{`npx shadcn@latest add ${registryBaseUrl()}/r/${entry.name}.json`}</CodeLine>
            {entry.dependencies.length > 0 && <Text style={{ color: "#8d8d8d" }}>npm: {entry.dependencies.join(", ")}</Text>}
            {entry.registryDependencies.length > 0 && (
                <Text style={{ color: "#8d8d8d" }}>Also installs: {entry.registryDependencies.map(dep => dep.replace(/^@karamatch\//, "")).join(", ")}</Text>
            )}
        </View>
    );
}

addons.register(ADDON_ID, api => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: "Install",
        render: () => <InstallPanel api={api} />
    });
});
