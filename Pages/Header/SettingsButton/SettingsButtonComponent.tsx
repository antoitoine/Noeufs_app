import { GestureResponderEvent, Image, StyleSheet, TouchableOpacity } from "react-native"
import { EdgeInsets } from "react-native-safe-area-context"
import * as Dim from '../../../Utils/Dimensions'
import { HeaderButtonProps } from "@react-navigation/elements"

type SettingsButtonComponentProps = {
    onPress: (event: GestureResponderEvent) => void
    insets: EdgeInsets
}

function SettingsButtonComponent({onPress, insets, canGoBack, pressColor, pressOpacity, tintColor}: SettingsButtonComponentProps & HeaderButtonProps) {
    return (
        <TouchableOpacity
            style={styles.settingsWrapper}
            onPress={onPress}
        >
            <Image source={require('../../../Images/settings_white.png')} style={[styles.settings, {top: insets.top}]} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    settingsWrapper: {
        position: 'absolute',
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
        right: Dim.widthScale(2),
        top: Dim.heightScale(1),
    },
    settings: {
        position: 'relative',
        top: 0,
        left: 0,
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
    },
})

export default SettingsButtonComponent
