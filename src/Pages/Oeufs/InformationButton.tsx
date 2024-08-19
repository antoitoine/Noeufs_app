/* IMPORTS */

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../../../App";
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import * as Dim from '../../Utils/Dimensions'
import { FAKE_WHITE } from "../../Constantes/Couleurs";

import { TouchableOpacity } from "react-native";

const informationEggSrc = require('../../Images/information_egg.png')



/* INFORMATION BUTTON */


type informationButtonType = NativeStackScreenProps<StackParamList, 'Oeufs'>
type informationButtonType2 = {
    colors: {dark: string, light: string}
}

function InformationButton({route, navigation, colors}: informationButtonType & informationButtonType2) {

    /* onPress */

    const onInformationPress = () => {
        console.log('Pressed')
    }

    /* Button color */



    /* Render */

    return (
        <TouchableOpacity
            style={[styles.informationButton]}
            activeOpacity={0.8}
            onPress={() => onInformationPress}
        >
            <Image source={informationEggSrc} alt='informations' style={[styles.informationImage, {tintColor: colors.dark}]} />
            
        </TouchableOpacity>
    )
}


/* STYLES */


const styles = StyleSheet.create({
    informationButton: {
        position: 'absolute',
        backgroundColor: FAKE_WHITE,

        width: Dim.scale(12),
        height: Dim.scale(12),

        bottom: Dim.heightScale(70),
        right: Dim.widthScale(10),
    },
    informationImage: {
        flex: 1,
        aspectRatio: 1,
    }
})


export default InformationButton
