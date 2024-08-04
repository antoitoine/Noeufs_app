import { GestureResponderEvent } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RouteProp } from "@react-navigation/native"
import { StackParamList } from "../../../../App"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext, useEffect, useState } from "react"
import ModeButtonComponent from "./ModeButtonComponent"
import { MODES_OEUFS } from "../../Oeufs"
import { ThemeContext } from "../../../Contexts/ThemeContext"

type ModeButtonContainerType = {
    route: RouteProp<StackParamList, keyof StackParamList> | any
    navigation: NativeStackNavigationProp<StackParamList, keyof StackParamList>
}

function ModeButtonContainer({route, navigation}: ModeButtonContainerType) {

    const insets = useSafeAreaInsets()

    const theme = useContext(ThemeContext)!

    const handlePress = (event: GestureResponderEvent) => {
        if (theme.mode + 1 >= MODES_OEUFS.length) {
            theme.setMode(0)
        } else {
            theme.setMode(theme.mode + 1)
        }
    }
    

    return (
        <ModeButtonComponent
            onPress={handlePress}
            insets={insets}
            mode={theme.mode}
        />
    )
}

export default ModeButtonContainer
