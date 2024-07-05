import { GestureResponderEvent } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RouteProp } from "@react-navigation/native"
import { StackParamList } from "../../../../App"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import SettingsButtonComponent from "./SettingsButtonComponent"
import { useEffect, useState } from "react"

type SettingsButtonContainerProps = {
    route: RouteProp<StackParamList, keyof StackParamList> | any
    navigation: NativeStackNavigationProp<StackParamList, keyof StackParamList>
}

function SettingsButtonContainer({route, navigation}: SettingsButtonContainerProps) {

    const insets = useSafeAreaInsets()

    const handlePress = (event: GestureResponderEvent) => {
        navigation.navigate('Settings')
    }
    

    return (
        <SettingsButtonComponent
            onPress={handlePress}
            insets={insets}
        />
    )
}

export default SettingsButtonContainer
