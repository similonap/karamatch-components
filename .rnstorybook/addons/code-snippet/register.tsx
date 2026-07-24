import { addons, types } from "storybook/manager-api";
import { STORY_ARGS_UPDATED } from "storybook/internal/core-events";
import { useCallback, useEffect, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";

// Shows a pasteable JSX snippet for whichever story is currently selected,
// reconstructed from its *current* args — i.e. it tracks live Controls
// panel edits, not just the story's initial `args`. Same `api.store()`
// access pattern as ../install-command, but args need a channel
// subscription (STORY_ARGS_UPDATED) to stay live: unlike the selected
// story itself, editing a control doesn't re-invoke this panel's `render`.
// Mirrors @storybook/addon-ondevice-controls's own `useArgs` hook, just
// read-only (no updateArgs/resetArgs) since this panel only displays args.
const ADDON_ID = "karamatch/code-snippet";
const PANEL_ID = ADDON_ID + "/panel";

function useLiveArgs(storyId: string | undefined, store: any): Record<string, unknown> {
    const getArgs = useCallback(() => {
        if (!storyId) {
            return {};
        }
        const story = store.fromId(storyId);
        return story?.unmappedArgs ?? story?.args ?? {};
    }, [storyId, store]);

    const [args, setArgs] = useState(getArgs);

    useEffect(() => {
        setArgs(getArgs());
        const onArgsUpdated = (changed: { storyId: string; args: Record<string, unknown> }) => {
            if (changed.storyId === storyId) {
                setArgs(changed.args);
            }
        };
        store._channel.on(STORY_ARGS_UPDATED, onArgsUpdated);
        return () => store._channel.off(STORY_ARGS_UPDATED, onArgsUpdated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storyId]);

    return args;
}

// Functions (action args like `onPress`) can't be serialized into a
// pasteable snippet, so they're left out entirely rather than faked.
function formatProp(name: string, value: unknown): string | null {
    if (typeof value === "function" || value === undefined) {
        return null;
    }
    if (typeof value === "string") {
        return `${name}="${value}"`;
    }
    if (typeof value === "boolean") {
        return value ? name : `${name}={false}`;
    }
    if (typeof value === "number") {
        return `${name}={${value}}`;
    }
    return `${name}={${JSON.stringify(value)}}`;
}

function buildSnippet(componentName: string, args: Record<string, unknown>): string {
    const props = Object.entries(args)
        .map(([name, value]) => formatProp(name, value))
        .filter((line): line is string => line !== null);

    if (props.length === 0) {
        return `<${componentName} />`;
    }
    return `<${componentName}\n${props.map(line => `    ${line}`).join("\n")}\n/>`;
}

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
function CodePanel({ api }: { api: any }) {
    const store = api.store();
    const storyId = store.getSelection()?.storyId;
    const story = storyId ? store.fromId(storyId) : undefined;
    const args = useLiveArgs(storyId, store);

    if (!story) {
        return (
            <View style={{ padding: 16 }}>
                <Text style={{ color: "#8d8d8d" }}>No story selected.</Text>
            </View>
        );
    }

    const componentName = story.title.split("/").pop() ?? story.title;

    return (
        <ScrollView style={{ padding: 16 }}>
            <CodeLine>{buildSnippet(componentName, args)}</CodeLine>
        </ScrollView>
    );
}

addons.register(ADDON_ID, api => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: "Code",
        render: () => <CodePanel api={api} />
    });
});
