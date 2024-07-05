import { GestureResponderEvent, Image, StyleSheet, Text, TouchableOpacity } from "react-native"
import { EdgeInsets } from "react-native-safe-area-context"
import * as Dim from '../../../Utils/Dimensions'
import { HeaderButtonProps } from "@react-navigation/elements"
import { useState } from "react"
import { FAKE_WHITE } from "../../../Constantes/Couleurs"
import { MODES_OEUFS } from "../../Oeufs"

type ModeButtonComponentType = {
    onPress: (event: GestureResponderEvent) => void
    insets: EdgeInsets
    mode: number
}

function ModeButtonComponent({onPress, insets, mode}: ModeButtonComponentType & HeaderButtonProps) {
    
    return (
        <TouchableOpacity
            style={[styles.headerModeButton, {top: insets.top + Dim.heightScale(1)}]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <Text style={[styles.headerModeButtonText]}>{MODES_OEUFS[mode].charAt(0)}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    headerModeButton: {
        position: 'absolute',
        backgroundColor: FAKE_WHITE,
        left: Dim.heightScale(1),
        top: Dim.heightScale(1),
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Dim.scale(1)
    },
    headerModeButtonText: {
        color: 'black',
        fontSize: Dim.scale(5),
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

export default ModeButtonComponent
