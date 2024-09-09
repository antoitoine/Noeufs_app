import { GestureResponderEvent, Image, StyleSheet, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Dim from '../../../Utils/Dimensions'
import { HeaderButtonProps } from "@react-navigation/elements"
import { StackParamList } from "../../../../App"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RouteProp } from "@react-navigation/native"

type settingsButtonProps = {
    route: RouteProp<StackParamList, keyof StackParamList> | any
    navigation: NativeStackNavigationProp<StackParamList, keyof StackParamList>
}


const SettingsButton = ({route, navigation}: settingsButtonProps & HeaderButtonProps) => {

    const insets = useSafeAreaInsets()

    const handlePress = (event: GestureResponderEvent) => {
        navigation.navigate('Parametres')
    }

    return (
        <TouchableOpacity
            style={styles.wrapper}
            onPress={handlePress}
        >
            <Image source={require('../../../Images/settings_128.png')} style={[styles.image, {top: insets.top, tintColor: 'white'}]} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
        right: Dim.widthScale(2),
        top: Dim.heightScale(1),
    },
    image: {
        position: 'relative',
        top: 0,
        left: 0,
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
    },
})

export default SettingsButton
