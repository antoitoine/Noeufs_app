import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Dim from '../../Utils/Dimensions'
import { useContext, useEffect } from "react"
import HeaderComponent from './HeaderComponent'
import { ExtendedHeaderProps } from "../../Declare/types.d"
import { ThemeContext } from "../../Contexts/ThemeContext"

function HeaderContainer({route, navigation, options}: ExtendedHeaderProps) {

    const insets = useSafeAreaInsets()

    const theme = useContext(ThemeContext)!

    useEffect(() => {
        theme.setHeaderHeight(insets.top + Dim.heightScale(7))
    }, [])

    const rightButton = options.headerRight && options.headerRightVisible? options.headerRight({canGoBack: true}) : null
    const leftButton = options.headerLeft && options.headerBackVisible ? options.headerLeft({canGoBack: true}) : null
    const middleButton = options.headerMiddle && options.headerMiddleVisible ? options.headerMiddle() : null

    return (
        <HeaderComponent
            insets={insets}
            height={theme.headerHeight}
            colors={{dark: theme.colors.dark, light: theme.colors.light}}
            leftButton={leftButton}
            rightButton={rightButton}
            middleButton={middleButton}
            options={options}
        />
    )
}

export default HeaderContainer
