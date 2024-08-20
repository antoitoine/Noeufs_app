import { GestureResponderEvent, Image, StyleSheet, Text, TouchableOpacity } from "react-native"
import { EdgeInsets } from "react-native-safe-area-context"
import * as Dim from '../../../Utils/Dimensions'
import { HeaderButtonProps } from "@react-navigation/elements"

type ModeButtonComponentType = {
    onPress: (event: GestureResponderEvent) => void
    insets: EdgeInsets
    mode: number
}

const images = [
    require('../../../Images/poule_noir_128.png'),
    require('../../../Images/caille_noir_128.png'),
    require('../../../Images/oie_noir_128.png'),
    require('../../../Images/canard_noir_128.png'),
]

function ModeButtonComponent({onPress, insets, mode}: ModeButtonComponentType & HeaderButtonProps) {

    return (
        <TouchableOpacity
            style={[styles.headerModeButton, {top: insets.top + Dim.heightScale(1)}]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <Image source={(images[mode])} style={[styles.modeImage, {tintColor: 'white'}]} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    headerModeButton: {
        position: 'absolute',
        left: Dim.heightScale(1),
        top: Dim.heightScale(1),
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerModeButtonText: {
        color: 'black',
        fontSize: Dim.scale(5),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modeImage: {
        position: 'relative',
        top: 0,
        left: 0,
        height: Dim.heightScale(5),
        aspectRatio: 1
    }
})

export default ModeButtonComponent
