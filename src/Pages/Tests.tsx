import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import * as Dim from '../Utils/Dimensions'
import { Background } from "@react-navigation/elements"
import React from "react"

function Tests() {
    return (
        <View style={styles.container}>
            <View style={[styles.vue, styles.vue1]}>
                <View style={[styles.vue, styles.vue1_child1]}></View>
                <Vue style={{backgroundColor: 'red'}} />
            </View>
            <View style={[styles.vue, styles.vue2]}></View>
            <View style={[styles.vue, styles.vue3]}></View>
            <View style={[styles.vue, styles.vue4]}></View>
        </View>
    )
}

function Vue(style: any) {
    return (
        <View style={style}></View>
    )
}

const styles = StyleSheet.create({
    newVue: {
        backgroundColor: 'white',
        width: 100,
        height: 100
    },
    container: {
        backgroundColor: 'blue',

        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    vue: {
        flexGrow: 100,
        flexShrink: 0
    },
    vue1: {
        backgroundColor: 'red',
        flexGrow: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    vue1_child1: {
        backgroundColor: 'black',
        flexBasis: Dim.heightScale(8),
        aspectRatio: 1,
        flexGrow: 0
    },
    vue2: {
        backgroundColor: 'green',
        flexGrow: 10
    },
    vue3: {
        backgroundColor: 'purple',
        flexGrow: 60
    },
    vue4: {
        backgroundColor: 'orange',
        flexGrow: 25
    }
})


export default Tests
