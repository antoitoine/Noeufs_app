import { GestureResponderEvent } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RouteProp } from "@react-navigation/native"
import { StackParamList, ThemeContext } from "../../../App"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext, useEffect, useState } from "react"
import ModeButtonComponent from "./ModeButtonComponent"
import { MODES_OEUFS } from "../../Oeufs"

type ModeButtonContainerType = {
    route: RouteProp<StackParamList, keyof StackParamList> | any
    navigation: NativeStackNavigationProp<StackParamList, keyof StackParamList>
}

function ModeButtonContainer({route, navigation}: ModeButtonContainerType) {

    const insets = useSafeAreaInsets()
    const [click, setClick] = useState(false)

    const theme = useContext(ThemeContext)!
    const [backgroundColor, ] = theme.backgroundColor
    const [idJour, ] = theme.idJour
    const [nbJours, ] = theme.nbJours
    const [headerHeight, setHeaderHeight] = theme.headerHeight
    const [mode, setMode] = theme.mode

    useEffect(() => {
        console.log('test')
    }, [click])

    const handlePress = (event: GestureResponderEvent) => {
        if (mode + 1 >= MODES_OEUFS.length) {
            setMode(0)
        } else {
            setMode(mode + 1)
        }
    }
    

    return (
        <ModeButtonComponent
            onPress={handlePress}
            insets={insets}
            mode={mode}
        />
    )
}

export default ModeButtonContainer
