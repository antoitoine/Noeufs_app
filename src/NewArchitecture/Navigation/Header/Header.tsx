import { StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Dim from '../../../Utils/Dimensions'
import { ExtendedNavigationOptions } from "../../../Declare/types.d"
import { useContext, useEffect } from "react"
import { ThemeContext } from "../../../Contexts/ThemeContext"

type headerProps = {
    options: ExtendedNavigationOptions
}

const Header = ({options}: headerProps) => {

    const insets = useSafeAreaInsets()
    const themeContext = useContext(ThemeContext)!

    useEffect(() => {
        themeContext.setHeaderHeight(insets.top + Dim.heightScale(7))
    }, [])

    const rightButton = options.headerRight && options.headerRightVisible? options.headerRight({canGoBack: true}) : null
    const leftButton = options.headerLeft && options.headerBackVisible ? options.headerLeft({canGoBack: true}) : null
    const middleButton = options.headerMiddle && options.headerMiddleVisible ? options.headerMiddle() : null

    return (
        <View style={[styles.header, options.headerStyle, {paddingTop: insets.top, height: themeContext.headerHeight, backgroundColor: themeContext.colors.dark}]}>
            
            {leftButton}
            {middleButton}

            <Text style={[styles.title, options.headerTitleStyle, {color: options.titleColor !== undefined ? options.titleColor : 'white'}]}>{options.title}</Text>
            
            {rightButton}

        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: Dim.heightScale(8),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    },
    title: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: Dim.scale(6)
    },
})

export default Header
