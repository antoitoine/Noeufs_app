import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Dim from '../../Utils/Dimensions'
import { DEGRADES } from "../../Constantes/Couleurs"
import { degradeCouleur, getRGBColorFromGradient } from "../../Utils/Couleurs"
import { useContext, useEffect } from "react"
import { ThemeContext } from "../../App"
import HeaderComponent from './HeaderComponent'

type headerContainerProps = {
    
}

function HeaderContainer({back, options, route, navigation}: headerContainerProps & NativeStackHeaderProps) {

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

    const rightButton = options.headerRight ? options.headerRight({canGoBack: true}) : null
    const leftButton = options.headerLeft ? options.headerLeft({canGoBack: true}) : null

    console.log('LEFT BUTTON : ')
    console.log(leftButton)

    return (
        <HeaderComponent
            insets={insets}
            height={headerHeight}
            colors={{dark: color, light: color2}}
            leftButton={leftButton}
            rightButton={rightButton}
            options={options}
        />
    )
}

export default HeaderContainer
