import { GestureResponderEvent, Image, StyleSheet, Text, TouchableOpacity } from "react-native"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"
import * as Dim from '../../../Utils/Dimensions'
import { HeaderButtonProps } from "@react-navigation/elements"
import { ThemeContext } from "../../../Contexts/ThemeContext"
import { useContext } from "react"
import { MODES_OEUFS } from "../../../Pages/Oeufs"
import { RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StackParamList } from "../../../../App"

type modeButtonProps = {
    route: RouteProp<StackParamList, keyof StackParamList> | any
    navigation: NativeStackNavigationProp<StackParamList, keyof StackParamList>
}

const images = [
    require('../../../Images/poule_noir_128.png'),
    require('../../../Images/caille_noir_128.png'),
    require('../../../Images/oie_noir_128.png'),
    require('../../../Images/canard_noir_128.png'),
]

const ModeButton = ({route, navigation}: modeButtonProps & HeaderButtonProps) => {

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
        <TouchableOpacity
            style={[styles.wrapper, {top: insets.top + Dim.heightScale(1)}]}
            activeOpacity={0.8}
            onPress={handlePress}
        >
            <Image source={(images[theme.mode])} style={[styles.image, {tintColor: 'white'}]} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: Dim.heightScale(1),
        top: Dim.heightScale(1),
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        position: 'relative',
        top: 0,
        left: 0,
        height: Dim.heightScale(5),
        aspectRatio: 1
    }
})

export default ModeButton
