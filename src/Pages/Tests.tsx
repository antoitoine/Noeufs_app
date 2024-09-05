import { Dimensions, Platform, SafeAreaView, StatusBar, StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native"
import * as Dim from '../Utils/Dimensions'
import { Background } from "@react-navigation/elements"
import React, { useContext, useEffect } from "react"
import { initialWindowMetrics, useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "@react-navigation/native"
import { ThemeContext } from "../Contexts/ThemeContext"
import changeNavigationBarColor, { hideNavigationBar, showNavigationBar } from "react-native-navigation-bar-color"
import { FAKE_WHITE } from "../Constantes/Couleurs"

export const STATUS_BAR_HEIGHT = StatusBar.currentHeight!

export const WINDOW_HEIGHT_NO_STATUS_BAR = Platform.OS !== 'ios' && Dimensions.get('screen').height !== Dimensions.get('window').height && STATUS_BAR_HEIGHT > 24 
? Dimensions.get('screen').height - STATUS_BAR_HEIGHT 
: STATUS_BAR_HEIGHT > 24 
  ? Dimensions.get('window').height - STATUS_BAR_HEIGHT 
  : Dimensions.get('window').height + initialWindowMetrics!.insets.bottom === Dimensions.get('screen').height 
    ? Dimensions.get('window').height - STATUS_BAR_HEIGHT 
    : Dimensions.get('window').height

var height = Dimensions.get('window').height - initialWindowMetrics!.insets.bottom - initialWindowMetrics!.insets.top - StatusBar.currentHeight!

function Tests() {

    const insets = useSafeAreaInsets()

    console.log(insets)

    const theme = useContext(ThemeContext)!

    useEffect(() => {
        StatusBar.setHidden(false)
        StatusBar.setBackgroundColor(theme.colors.dark)
        showNavigationBar()
        changeNavigationBarColor(FAKE_WHITE)
        height = Dimensions.get('window').height - initialWindowMetrics!.insets.bottom - initialWindowMetrics!.insets.top - StatusBar.currentHeight!
    }, [height])

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={styles.date}
            >
                <View style={styles.dateTexte}></View>
            </View>
            <View
                style={styles.oeufs}
            >

            </View>
            <View
                style={styles.boutons}
            >
                <View
                    style={[styles.boutons_lig, styles.boutons_lig1]}
                >
                    <View style={[styles.bouton, styles.bouton1]}></View>
                </View>
                <View
                    style={styles.boutons_lig}
                >
                    <View style={[styles.bouton, styles.bouton2]}></View>
                    <View style={[styles.bouton, styles.bouton3]}></View>
                    <View style={[styles.bouton, styles.bouton4]}></View>
                </View>
                
                
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'blue',

        flexGrow: 1,

        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    date: {
        backgroundColor: 'red',

        flexGrow: 0,
        flexBasis: height * 0.10,

        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',

        padding: Dim.scale(3)
    },
    dateTexte: {
        backgroundColor: 'white',

        flexGrow: 1,
    },
    oeufs: {
        backgroundColor: 'green',

        flexGrow: 0,
        flexBasis: height * 0.70,
    },
    boutons: {
        backgroundColor: FAKE_WHITE,

        flexGrow: 1,
        flexBasis: height * 0.1,

        flexDirection: 'column',
        justifyContent: 'space-around',

        padding: Dim.scale(3),
        gap: Dim.scale(3),
    },
    bouton: {
        flexGrow: 1,

        borderRadius: Dim.scale(1)
    },
    boutons_lig: {
        backgroundColor: FAKE_WHITE,

        flexGrow: 1,
        
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'stretch',

        gap: Dim.scale(3)
    },
    boutons_lig1: {
        flexGrow: 0.4
    },
    bouton1: {
        backgroundColor: 'red',
    },
    bouton2: {
        backgroundColor: 'green',
    },
    bouton3: {
        backgroundColor: 'purple',
    },
    bouton4: {
        backgroundColor: 'orange',
    },
})


export default Tests
