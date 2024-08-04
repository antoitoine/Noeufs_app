import { GestureResponderEvent, Image, StyleSheet, TouchableOpacity } from "react-native"
import * as Dim from '../../../Utils/Dimensions'
import { EdgeInsets } from "react-native-safe-area-context"

const imageSource = require('../../../Images/backButton.png')

type BackButtonComponentProps = {
    onPress: (event: GestureResponderEvent) => void
    insets: EdgeInsets
}

function BackButtonComponent({onPress, insets}: BackButtonComponentProps) {
    return (
        <TouchableOpacity
            style={[styles.backWrapper]}
            onPress={onPress}
        >
            <Image source={imageSource} style={[styles.back, {top: insets.top}]} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    backWrapper: {
        position: 'absolute',
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
        left: Dim.widthScale(2),
        top: Dim.heightScale(1),
    },
    back: {
        position: 'relative',
        top: 0,
        left: 0,
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
    }
})

export default BackButtonComponent
