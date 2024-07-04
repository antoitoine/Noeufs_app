import { NativeStackHeaderProps, NativeStackNavigationOptions } from "@react-navigation/native-stack";

export interface ExtendedNavigationOptions extends NativeStackNavigationOptions {
    titleColor?: string
    headerMiddle?: () => React.ReactNode
    headerMiddleVisible?: Boolean
    headerRightVisible?: Boolean
}

export interface ExtendedHeaderProps extends NativeStackHeaderProps {
    options: ExtendedNavigationOptions
}

