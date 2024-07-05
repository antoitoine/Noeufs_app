import { StackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import * as Couleur from '../../Utils/Couleurs'
import { DEGRADES } from "../../Constantes/Couleurs";
import SettingsComponent from "./SettingsComponent";
import { ThemeContext } from "../../Contexts/ThemeContext";

type NavigationProps = NativeStackScreenProps<StackParamList, 'Settings'>;

function SettingsContainer({route, navigation}: NavigationProps) {

    const theme = useContext(ThemeContext)!

    const gradient = Couleur.degradeCouleur(DEGRADES[theme.backgroundColor][2], DEGRADES[theme.backgroundColor][3], theme.nbJours)
    const interactiveColor = Couleur.getRGBColorFromGradient(gradient, theme.idJour)

    const gradient2 = Couleur.degradeCouleur(DEGRADES[theme.backgroundColor][0], DEGRADES[theme.backgroundColor][1], theme.nbJours)
    const interactiveColor2 = Couleur.getRGBColorFromGradient(gradient2, theme.idJour)

    return (
        <SettingsComponent
            route={route}
            navigation={navigation}
            colors={{dark: interactiveColor, light: interactiveColor2}}
        />
    )
}

export default SettingsContainer
