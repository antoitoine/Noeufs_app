import { NativeStackHeaderProps, NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Dim from '../../Utils/Dimensions'
import { DEGRADES } from "../../Constantes/Couleurs"
import { degradeCouleur, getRGBColorFromGradient } from "../../Utils/Couleurs"
import { useContext, useEffect } from "react"
import HeaderComponent from './HeaderComponent'
import { ExtendedHeaderProps } from "../../Declare/types.d"
import { ThemeContext } from "../../Contexts/ThemeContext"

export interface optionsProps extends NativeStackNavigationOptions {
    titleColor?: string
}

interface headerContainerProps extends NativeStackHeaderProps {
    options: optionsProps
}

function HeaderContainer({route, navigation, options}: ExtendedHeaderProps) {

    const insets = useSafeAreaInsets()

    const theme = useContext(ThemeContext)!

    useEffect(() => {
        theme.setHeaderHeight(insets.top + Dim.heightScale(7))
    }, [])

    const gradient = degradeCouleur(DEGRADES[theme.backgroundColor][2], DEGRADES[theme.backgroundColor][3], theme.nbJours)
    const color = getRGBColorFromGradient(gradient, theme.idJour)

    const gradient2 = degradeCouleur(DEGRADES[theme.backgroundColor][0], DEGRADES[theme.backgroundColor][1], theme.nbJours)
    const color2 = getRGBColorFromGradient(gradient2, theme.idJour)

    const rightButton = options.headerRight && options.headerRightVisible? options.headerRight({canGoBack: true}) : null
    const leftButton = options.headerLeft && options.headerBackVisible ? options.headerLeft({canGoBack: true}) : null
    const middleButton = options.headerMiddle && options.headerMiddleVisible ? options.headerMiddle() : null

    return (
        <HeaderComponent
            insets={insets}
            height={theme.headerHeight}
            colors={{dark: color, light: color2}}
            leftButton={leftButton}
            rightButton={rightButton}
            middleButton={middleButton}
            options={options}
        />
    )
}

export default HeaderContainer
