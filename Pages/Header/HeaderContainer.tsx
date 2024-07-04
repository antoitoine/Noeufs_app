import { NativeStackHeaderProps, NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Dim from '../../Utils/Dimensions'
import { DEGRADES } from "../../Constantes/Couleurs"
import { degradeCouleur, getRGBColorFromGradient } from "../../Utils/Couleurs"
import { useContext, useEffect } from "react"
import { ThemeContext } from "../../App"
import HeaderComponent from './HeaderComponent'
import { ExtendedHeaderProps } from "../../declarations/types.d"

export interface optionsProps extends NativeStackNavigationOptions {
    titleColor?: string
}

interface headerContainerProps extends NativeStackHeaderProps {
    options: optionsProps
}

function HeaderContainer({route, navigation, options}: ExtendedHeaderProps) {

    const insets = useSafeAreaInsets()

    const theme = useContext(ThemeContext)!
    const [backgroundColor, ] = theme.backgroundColor
    const [idJour, ] = theme.idJour
    const [nbJours, ] = theme.nbJours
    const [headerHeight, setHeaderHeight] = theme.headerHeight

    useEffect(() => {
        setHeaderHeight(insets.top + Dim.heightScale(7))
    }, [])

    const gradient = degradeCouleur(DEGRADES[backgroundColor][2], DEGRADES[backgroundColor][3], nbJours)
    const color = getRGBColorFromGradient(gradient, idJour)

    const gradient2 = degradeCouleur(DEGRADES[backgroundColor][0], DEGRADES[backgroundColor][1], nbJours)
    const color2 = getRGBColorFromGradient(gradient2, idJour)

    const rightButton = options.headerRight && options.headerRightVisible? options.headerRight({canGoBack: true}) : null
    const leftButton = options.headerLeft && options.headerBackVisible ? options.headerLeft({canGoBack: true}) : null
    const middleButton = options.headerMiddle && options.headerMiddleVisible ? options.headerMiddle() : null

    return (
        <HeaderComponent
            insets={insets}
            height={headerHeight}
            colors={{dark: color, light: color2}}
            leftButton={leftButton}
            rightButton={rightButton}
            middleButton={middleButton}
            options={options}
        />
    )
}

export default HeaderContainer
