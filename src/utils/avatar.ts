import { AVATAR_COLORS } from "../theme/colors";

// Ported from karamatch-web/src/design/tokens.ts. Stable colour per person so
// an avatar keeps its colour across screens.
//
// `colors` defaults to the default theme's rotation; `Avatar` passes the live
// theme's `AVATARS` instead, so generated avatars sit in whatever palette the
// theme brought. Either way the same name always lands on the same slot.
export function avatarColor(key: string | number, colors: string[] = AVATAR_COLORS) {
    const s = String(key);
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    }
    return colors[hash % colors.length];
}

export function initial(name: string) {
    return (name || "?").trim().charAt(0).toUpperCase() || "?";
}
