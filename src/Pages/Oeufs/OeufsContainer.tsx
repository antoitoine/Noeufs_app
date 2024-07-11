import { StackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import OeufsComponent from "./OeufsComponent";
import { ThemeContext } from "../../Contexts/ThemeContext";
import * as Dim from '../../Utils/Dimensions'

export const taille_disque = Dim.scale(6);

type NavigationProps = NativeStackScreenProps<StackParamList, 'Oeufs'>;

function OeufsContainer({route, navigation}: NavigationProps) {

    const theme = useContext(ThemeContext)!

    return (
        <OeufsComponent
            route={route}
            navigation={navigation}
            colors={{dark: theme.colors.dark, light: theme.colors.light}}
        />
    )
}

export default OeufsContainer
