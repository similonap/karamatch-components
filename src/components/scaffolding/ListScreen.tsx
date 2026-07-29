import { FlatList } from "react-native";
import type { FlatListProps } from "react-native";

import { useScreenLayout } from "./useScreenLayout";
import type { ScreenLayoutOptions } from "./useScreenLayout";

export type ListScreenProps<ItemT> = Omit<FlatListProps<ItemT>, "ItemSeparatorComponent"> & ScreenLayoutOptions;

// A screen body backed by a FlatList, for the tabs that render a title block
// over an arbitrarily long run of cards — Venues, Match, Friends, Mine,
// Notifications. Same gutter, gap and safe-area pad as `Screen`, applied to
// the list's content container so the pad extends the scrollable content
// rather than shrinking the viewport around it.
//
// The layout `gap` spaces the rows, so there is no `ItemSeparatorComponent`
// to pass — a separator would stack with the gap and double the spacing.
// `pad` insets the rows along with everything else, matching how the design
// system's cards sit inside the gutter; set `pad={false}` for a full-bleed
// list whose rows draw their own gutter.
//
// Everything else is FlatList's, so `ListHeaderComponent`,
// `ListEmptyComponent` and `refreshControl` cover the header, empty and
// pull-to-refresh states the web screens built inline.
export function ListScreen<ItemT>({ pad, bottomPad, gap, contentContainerStyle, ...rest }: ListScreenProps<ItemT>) {
    const layout = useScreenLayout({ pad, bottomPad, gap });

    return (
        <FlatList<ItemT>
            style={{ flex: 1 }}
            contentContainerStyle={[layout, contentContainerStyle]}
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            {...rest}
        />
    );
}
