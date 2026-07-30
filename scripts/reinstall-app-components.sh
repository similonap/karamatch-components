#!/usr/bin/env bash
#
# Re-runs `npx shadcn@latest add <registry-url>` for every karamatch registry
# item that is currently installed in the consumer app.
#
# The list below was derived by matching the files under the app's
# components/, icons/, theme/ and utils/ directories against docs/r/registry.json.
# Regenerate it by hand if the app gains or drops components.
#
# Usage:
#   ./scripts/reinstall-app-components.sh [app-dir] [--overwrite] [--dry-run]
#
#   app-dir      defaults to ../karamatch-app (must contain components.json)
#   --overwrite  pass --overwrite to shadcn (REPLACES local edits to these files)
#   --dry-run    print the commands without running them

set -euo pipefail

REGISTRY_BASE="https://similonap.github.io/karamatch-components/r"

APP_DIR=""
OVERWRITE=0
DRY_RUN=0

for arg in "$@"; do
    case "$arg" in
        --overwrite) OVERWRITE=1 ;;
        --dry-run) DRY_RUN=1 ;;
        -h|--help) sed -n '2,17p' "$0"; exit 0 ;;
        -*) echo "unknown option: $arg" >&2; exit 1 ;;
        *) APP_DIR="$arg" ;;
    esac
done

if [ -z "$APP_DIR" ]; then
    APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/karamatch-app"
fi

if [ ! -f "$APP_DIR/components.json" ]; then
    echo "error: no components.json in $APP_DIR — is that the app project root?" >&2
    exit 1
fi

# Registry item names, grouped the way they sit in the app.
COMPONENTS=(
    # components/domain
    user-profile-header
    venue-card

    # components/primitives
    app-pressable
    app-text
    components-primitives-avatar   # src/components/primitives/Avatar.tsx
    avatar-picker
    brand-mark
    button
    card
    icon-button
    rating
    spinner
    stat
    text-field
    wordmark

    # components/scaffolding
    app-bar
    bottom-bar
    list-screen
    screen
    tab-bar-button
    use-app-bar-height
    use-screen-layout

    # icons
    icon
    star-icon
    tab-icon
    types                          # src/icons/types.ts

    # theme
    theme-provider
    colors
    create-theme
    tokens
    themes
    neon-nights
    soft-aurora
    wireframe

    # utils
    utils-avatar                   # src/utils/avatar.ts
    format
)

SHADCN_FLAGS=(--yes)
if [ "$OVERWRITE" -eq 1 ]; then
    SHADCN_FLAGS+=(--overwrite)
fi

cd "$APP_DIR"

echo "Installing ${#COMPONENTS[@]} components into $APP_DIR"
[ "$OVERWRITE" -eq 1 ] && echo "WARNING: --overwrite will discard local edits to these files"
echo

failed=()
for name in "${COMPONENTS[@]}"; do
    url="$REGISTRY_BASE/$name.json"
    echo "==> $name"
    if [ "$DRY_RUN" -eq 1 ]; then
        echo "npx shadcn@latest add ${SHADCN_FLAGS[*]} $url"
        continue
    fi
    if ! npx shadcn@latest add "${SHADCN_FLAGS[@]}" "$url"; then
        echo "!!! failed: $name" >&2
        failed+=("$name")
    fi
done

echo
if [ ${#failed[@]} -gt 0 ]; then
    echo "${#failed[@]} component(s) failed: ${failed[*]}" >&2
    exit 1
fi
echo "Done."
