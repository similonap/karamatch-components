// The shelf. Import components, theme, icons, and utilities from here in a
// student's own app — this folder is copy-paste portable (see README.md).

// Theme
export { ThemeProvider, useTheme } from "./theme/ThemeProvider";
export type { ThemeMode, ThemeValue } from "./theme/ThemeProvider";
export type { ColorScheme, Palette, Shadows } from "./theme/colors";

// Authoring a theme: `createTheme` takes the differences from the default and
// fills in the rest. See theme/themes/ for worked examples.
export { createTheme } from "./theme/createTheme";
export type { ControlsSpec, MotionSpec, Theme, ThemeScheme, ThemeSchemeSpec, ThemeSpec, ThemeTokens } from "./theme/createTheme";
export { BUILT_IN_THEMES, DEFAULT_THEME, neonNights, softAurora, wireframe } from "./theme/themes";

// Token defaults + their types, i.e. what a theme may override.
export { CTRL, DECOR, FONT, LAYOUT, MOTION, R, RADII, S, S2, T, glowShadow, makeRadii, makeTypeScale } from "./theme/tokens";
export type {
    Controls,
    Decor,
    FontFamilies,
    HalfStepScale,
    LayoutScale,
    Motion,
    PressFeedback,
    PressRole,
    Radii,
    RadiusScale,
    SpaceScale,
    TypeRole,
    TypeScale
} from "./theme/tokens";

// Icons
export { Icon } from "./icons/Icon";
export { StarIcon } from "./icons/StarIcon";
export { TabIcon } from "./icons/TabIcon";
export type { IconName } from "./icons/types";

// Primitives
export { AppPressable } from "./components/primitives/AppPressable";
export { AppText, useTextStyle } from "./components/primitives/AppText";
export type { AppTextOptions, TextTone, TextWeight } from "./components/primitives/AppText";
export { Avatar } from "./components/primitives/Avatar";
export { AvatarPicker } from "./components/primitives/AvatarPicker";
export { AvatarStack } from "./components/primitives/AvatarStack";
export { BrandMark } from "./components/primitives/BrandMark";
export { Button } from "./components/primitives/Button";
export { Card } from "./components/primitives/Card";
export { CheckRing } from "./components/primitives/CheckRing";
export { Chip } from "./components/primitives/Chip";
export { ConfirmDialog } from "./components/primitives/ConfirmDialog";
export { Divider } from "./components/primitives/Divider";
export { EmptyState } from "./components/primitives/EmptyState";
export { ErrorNote } from "./components/primitives/ErrorNote";
export { Group } from "./components/primitives/Group";
export { IconButton } from "./components/primitives/IconButton";
export { IconTile } from "./components/primitives/IconTile";
export { ListRow } from "./components/primitives/ListRow";
export { Loading } from "./components/primitives/Loading";
export { MatchBadge } from "./components/primitives/MatchBadge";
export { MatchRing } from "./components/primitives/MatchRing";
export { OptionPill } from "./components/primitives/OptionPill";
export { Rating } from "./components/primitives/Rating";
export { ReceiptLine } from "./components/primitives/ReceiptLine";
export { RemovableChip } from "./components/primitives/RemovableChip";
export { SearchField } from "./components/primitives/SearchField";
export { Section } from "./components/primitives/Section";
export { Segmented } from "./components/primitives/Segmented";
export { Skeleton } from "./components/primitives/Skeleton";
export { SongArt } from "./components/primitives/SongArt";
export { Spinner } from "./components/primitives/Spinner";
export { StarInput } from "./components/primitives/StarInput";
export { StarRow } from "./components/primitives/StarRow";
export { Stat, StatStrip } from "./components/primitives/Stat";
export { StepHeader } from "./components/primitives/StepHeader";
export { Stepper } from "./components/primitives/Stepper";
export { TextField } from "./components/primitives/TextField";
export { Toast } from "./components/primitives/Toast";
export { Toggle } from "./components/primitives/Toggle";
export { Wordmark } from "./components/primitives/Wordmark";

// Scaffolding
export { AppBar } from "./components/scaffolding/AppBar";
export { BottomBar } from "./components/scaffolding/BottomBar";
export { BottomTabBar, TABS as BOTTOM_TAB_BAR_TABS } from "./components/scaffolding/BottomTabBar";
export type { TabKey } from "./components/scaffolding/BottomTabBar";
export { ListScreen } from "./components/scaffolding/ListScreen";
export type { ListScreenProps } from "./components/scaffolding/ListScreen";
export { Screen } from "./components/scaffolding/Screen";
export { TabBarButton } from "./components/scaffolding/TabBarButton";
export { useScreenLayout } from "./components/scaffolding/useScreenLayout";
export type { ScreenLayoutOptions } from "./components/scaffolding/useScreenLayout";

// Domain composites. Each one declares the shape it draws as its own
// `<Component>Props` — there is no shared domain model to import, so your
// app's API types satisfy these structurally. See README's "Prop shapes".
export { ChatBubble, shouldShowChatName } from "./components/domain/ChatBubble";
export type { ChatBubbleProps } from "./components/domain/ChatBubble";
export { ChatInputBar } from "./components/domain/ChatInputBar";
export { CrewMemberChip, InvitedMemberChip } from "./components/domain/CrewMemberChip";
export type { CrewMemberChipProps } from "./components/domain/CrewMemberChip";
export { CrewRatingCard } from "./components/domain/CrewRatingCard";
export type { CrewRatingCardProps } from "./components/domain/CrewRatingCard";
export { FriendRow } from "./components/domain/FriendRow";
export type { FriendRowProps } from "./components/domain/FriendRow";
export { InviteFriendRow } from "./components/domain/InviteFriendRow";
export type { InviteFriendRowProps } from "./components/domain/InviteFriendRow";
export { NotificationRow } from "./components/domain/NotificationRow";
export type { NotificationRowProps } from "./components/domain/NotificationRow";
export { PartyCard } from "./components/domain/PartyCard";
export type { PartyCardProps, PartyCardVariant } from "./components/domain/PartyCard";
export { ReviewCard } from "./components/domain/ReviewCard";
export type { ReviewCardProps } from "./components/domain/ReviewCard";
export { RoomOptionRow } from "./components/domain/RoomOptionRow";
export type { RoomOptionRowProps } from "./components/domain/RoomOptionRow";
export { SongRow } from "./components/domain/SongRow";
export type { SongRowProps } from "./components/domain/SongRow";
export { UserProfileHeader } from "./components/domain/UserProfileHeader";
export type { UserProfileHeaderProps } from "./components/domain/UserProfileHeader";
export { VenueCard } from "./components/domain/VenueCard";
export type { VenueCardProps } from "./components/domain/VenueCard";
export { VenueLocationCard } from "./components/domain/VenueLocationCard";

// Utils
export { avatarColor, initial } from "./utils/avatar";
export { formatAgo, formatDayLabel, formatTime, formatWhen, money, plural } from "./utils/format";
export { useAsync, useDebounced } from "./utils/hooks";
