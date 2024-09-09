import { GestureResponderEvent, Image, StyleSheet, TouchableOpacity } from "react-native"
import * as Dim from '../../../Utils/Dimensions'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StackParamList } from "../../../../App"
import { RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

const imageSource = require('../../../Images/back_128.png')

type backButtonProps = {
    route: RouteProp<StackParamList, keyof StackParamList> | any
    navigation: NativeStackNavigationProp<StackParamList, keyof StackParamList>
}

function BackButton({route, navigation}: backButtonProps) {

    const insets = useSafeAreaInsets()

    const handlePress = (event: GestureResponderEvent) => {
        if(navigation.canGoBack())
            navigation.goBack()
    }

    return (
        <TouchableOpacity
            style={[styles.backWrapper]}
            onPress={handlePress}
        >
            <Image source={imageSource} style={[styles.backImage, {top: insets.top, tintColor: 'white'}]} />
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
    backImage: {
        position: 'relative',
        top: 0,
        left: 0,
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
    }
})

export default BackButton
