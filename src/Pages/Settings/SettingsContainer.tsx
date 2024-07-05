import { StackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import SettingsComponent from "./SettingsComponent";
import { ThemeContext } from "../../Contexts/ThemeContext";

type NavigationProps = NativeStackScreenProps<StackParamList, 'Settings'>;

function SettingsContainer({route, navigation}: NavigationProps) {

    const theme = useContext(ThemeContext)!

    return (
        <SettingsComponent
            route={route}
            navigation={navigation}
            colors={{dark: theme.colors.dark, light: theme.colors.light}}
        />
    )
}

export default SettingsContainer
