import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StackParamList, ThemeContext } from "../App";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import * as Dim from '../Utils/Dimensions'
import { DEGRADES, FAKE_WHITE } from "../Constantes/Couleurs";

type Props = NativeStackScreenProps<StackParamList, 'Personnalisation'>

export default function Personnalisation({route, navigation}: Props) {

    const theme = useContext(ThemeContext)!
    const [backgroundColor, setBackgroundColor] = theme.backgroundColor

    useEffect(() => {
        AsyncStorage.setItem('userPreferences', JSON.stringify({
            'backgroundColor': backgroundColor
        }))
    }, [backgroundColor])
    
    return (
        <ScrollView contentContainerStyle={pageStyle.container} style={pageStyle.wrapper}>
            <ChoixCouleur
                id={1}
                onPress={(id: string) => {
                    setBackgroundColor(id)
                }}
            />
            <ChoixCouleur
                id={2}
                onPress={(id: string) => {
                    setBackgroundColor(id)
                }}
            />
            <ChoixCouleur
                id={3}
                onPress={(id: string) => {
                    setBackgroundColor(id)
                }}
            />
            <ChoixCouleur
                id={1}
                onPress={(id: string) => {
                    setBackgroundColor(id)
                }}
            />
            <ChoixCouleur
                id={1}
                onPress={(id: string) => {
                    setBackgroundColor(id)
                }}
            />
            <ChoixCouleur
                id={1}
                onPress={(id: string) => {
                    setBackgroundColor(id)
                }}
            />
            <ChoixCouleur
                id={1}
                onPress={(id: string) => {
                    setBackgroundColor(id)
                }}
            />
            <ChoixCouleur
                id={1}
                onPress={(id: string) => {
                    setBackgroundColor(id)
                }}
            />
            <ChoixCouleur
                id={1}
                onPress={(id: string) => {
                    setBackgroundColor(id)
                }}
            />
        </ScrollView>
    )
}

function ChoixCouleur({id, onPress, style=undefined}: {id: number, onPress: Function, style?:Object}) {

    const idStr = 'c' + id.toString()

    return (
        <TouchableOpacity
            containerStyle={[choixCouleurStyle.button, style]}
            activeOpacity={0.8}
            onPress={() => {
                onPress(idStr)
            }}
        >
            <LinearGradient
                colors={[DEGRADES[idStr][2], DEGRADES[idStr][3]]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{flex: 1, aspectRatio: 1, borderRadius: Dim.scale(2)}}
            />
        </TouchableOpacity> 
    )
}

const choixCouleurStyle = StyleSheet.create({
    button: {
        flexBasis: 100,
        flex: 1,
        flexGrow: 1,
        borderRadius: Dim.scale(1),
        margin: Dim.scale(2),
        aspectRatio: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const pageStyle = StyleSheet.create({
    wrapper: {
        backgroundColor: FAKE_WHITE,
        flex: 1,
    },
    container: {
        padding: Dim.scale(1),
        flexWrap: 'wrap',
        flexDirection: 'row'
    }
})
