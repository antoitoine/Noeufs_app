import { StackParamList, ThemeContext } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import * as Couleur from '../../Utils/Couleurs'
import { DEGRADES } from "../../Constantes/Couleurs";
import SettingsComponent from "./SettingsComponent";

type NavigationProps = NativeStackScreenProps<StackParamList, 'Settings'>;

function SettingsContainer({route, navigation}: NavigationProps) {

    const theme = useContext(ThemeContext)!
    const [backgroundColor, ] = theme.backgroundColor
    const [idJour, ] = theme.idJour
    const [nbJours, ] = theme.nbJours

    const gradient = Couleur.degradeCouleur(DEGRADES[backgroundColor][2], DEGRADES[backgroundColor][3], nbJours)
    const interactiveColor = Couleur.getRGBColorFromGradient(gradient, idJour)

    const gradient2 = Couleur.degradeCouleur(DEGRADES[backgroundColor][0], DEGRADES[backgroundColor][1], nbJours)
    const interactiveColor2 = Couleur.getRGBColorFromGradient(gradient2, idJour)

    return (
        <SettingsComponent
            route={route}
            navigation={navigation}
            colors={{dark: interactiveColor, light: interactiveColor2}}
        />
    )
}

export default SettingsContainer
