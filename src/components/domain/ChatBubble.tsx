import { View } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { AppText } from "../primitives/AppText";
import type { ChatMessage } from "../../types";

// Ported from karamatch-web/src/screens/PartyRoom.tsx's inline chat bubble —
// a tail on the outer corner, the way both platforms' native bubbles are
// shaped, and the sender's name shown only on the first message of a run.
export function ChatBubble({ message, mine, showName }: { message: ChatMessage; mine: boolean; showName: boolean }) {
    const { C, CTRL, RADII, S2 } = useTheme();

    return (
        <View style={{ alignItems: mine ? "flex-end" : "flex-start", gap: 2 }}>
            {showName ? (
                <AppText variant="footnote" size={10} tone="textFaint" style={{ paddingHorizontal: 8 }}>
                    {mine ? "You" : message.from?.name ?? "Someone"}
                </AppText>
            ) : null}
            <View
                style={{
                    maxWidth: "78%",
                    paddingVertical: S2.s10 - 1,
                    paddingHorizontal: S2.s12 + 1,
                    borderRadius: RADII.bubble,
                    borderCurve: "continuous",
                    borderBottomRightRadius: mine ? CTRL.bubbleTail : RADII.bubble,
                    borderBottomLeftRadius: mine ? RADII.bubble : CTRL.bubbleTail,
                    backgroundColor: mine ? C.tint : C.surface2,
                    borderWidth: CTRL.border.regular,
                    borderColor: mine ? "transparent" : C.border
                }}
            >
                <AppText variant="callout" tone={mine ? "onTint" : "text"}>
                    {message.text}
                </AppText>
            </View>
        </View>
    );
}

// Consecutive messages from one person only get a name once — a small
// selector so a screen doesn't need to re-derive this itself when mapping
// over a message list.
export function shouldShowChatName(messages: ChatMessage[], index: number) {
    return index === 0 || messages[index - 1].userId !== messages[index].userId;
}
