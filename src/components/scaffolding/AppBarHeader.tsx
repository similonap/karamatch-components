import { AppBar } from "./AppBar";
import type { AppBarProps } from "./AppBar";

// Mounts `AppBar` as a navigator's header, for apps that would rather keep
// the title on the route (`options={{ title }}`) than repeat it inside every
// screen:
//
//     <Stack screenOptions={{ header: appBarHeader() }} />
//
// The alternative — `headerShown: false` and `<AppBar />` as the screen's
// first child — is what the rest of the shelf assumes, and what the README
// documents first. Both are supported; this exists so that choosing the
// navigator route doesn't mean hand-writing a render prop and getting the
// back affordance or the background wrong.
//
// The props are declared structurally rather than imported from
// `@react-navigation/native-stack`, which this shelf doesn't depend on: a
// real `NativeStackHeaderProps` is assignable to the shape below, so the
// returned component drops into `screenOptions.header` and type-checks
// without dragging a navigator into projects that use a different one.
export interface StackHeaderProps {
    navigation: { goBack: () => void };
    options: { title?: string };
    /** Present only when there's a screen to go back to. */
    back?: { title?: string };
}

export function appBarHeader(props: Omit<AppBarProps, "onBack"> = {}) {
    return function Header({ navigation, options, back }: StackHeaderProps) {
        return (
            <AppBar
                {...props}
                // An explicit `title` wins, so one call can pin a title across
                // every screen; otherwise each route's own `options.title` does.
                title={props.title ?? options.title}
                // No previous screen means no back affordance — the same rule
                // the native header follows.
                onBack={back ? navigation.goBack : undefined}
            />
        );
    };
}
