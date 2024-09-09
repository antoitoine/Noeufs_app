import { Dimensions, Platform, SafeAreaView, StatusBar, StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle, VirtualizedList } from "react-native"
import * as Dim from '../Utils/Dimensions'
import { Background } from "@react-navigation/elements"
import React, { useContext, useEffect, useRef, useState } from "react"
import { initialWindowMetrics, useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "@react-navigation/native"
import { ThemeContext } from "../Contexts/ThemeContext"
import changeNavigationBarColor, { hideNavigationBar, showNavigationBar } from "react-native-navigation-bar-color"
import { FAKE_WHITE } from "../Constantes/Couleurs"

var height = Dimensions.get('window').height - initialWindowMetrics!.insets.bottom - initialWindowMetrics!.insets.top - StatusBar.currentHeight!

function Tests() {

    const [items, setItems] = useState([1, 2, 3])

    console.debug(items)

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

    const virtualizedListRef = useRef<VirtualizedList<number>>(null)

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
                <VirtualizedList
                    style={styles.listWrapper}
                    contentContainerStyle={styles.listContainer}

                    ref={virtualizedListRef}
                    data={items}

                    getItem={((data, index) => {
                        return data[index]
                    })}

                    getItemCount={(data) => {
                        return data.length
                    }}

                    keyExtractor={(item, index) => item.toString()}

                    renderItem={(item) => {
                        return (
                            <View
                                style={styles.item}
                            >
                                <Text>{item.item}</Text>
                            </View>
                        )
                    }}

                    onEndReached={(info) => {
                        setItems([...items, items.length + 1])
                    }}

                    onStartReached={(info) => {
                        setItems([items[0] - 1, ...items])
                        virtualizedListRef.current?.scrollToIndex({index: 1, animated: false})
                    }}

                    horizontal={true}
                    pagingEnabled={true}
                    initialScrollIndex={1}
                    onScrollToIndexFailed={(info) => {
                        console.log('Failed to scroll, waiting 500ms')
                        new Promise(resolve => setTimeout(resolve, 500)).then(() => {
                            virtualizedListRef.current?.scrollToIndex({index: info.index, animated: false})
                        }).catch((e) => {
                            console.error('Error while scrolling : ' + e)
                        })
                    }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    maxToRenderPerBatch={3}
                >

                </VirtualizedList>
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
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'stretch'
    },
    listContainer: {
        backgroundColor: 'yellow',

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    listWrapper: {
        backgroundColor: 'grey',

        flexGrow: 1
    },
    item: {
        borderWidth: 1,
        borderRadius: Dim.scale(1),

        width: Dim.widthScale(95),
        margin: Dim.widthScale(2.5)
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
