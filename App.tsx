import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Oeufs from "./Pages/Oeufs";
import * as Dim from './Utils/Dimensions';
import Parametres from "./Pages/Parametres";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EdgeInsets, SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Background, HeaderButtonProps, getDefaultHeaderHeight } from "@react-navigation/elements";
import Personnalisation from "./Pages/Personnalisation";
import { createContext, useContext, useEffect, useState } from "react";
import { hexToRgb, getRGBColorFromGradient } from "./Utils/Couleurs";
import { DEGRADES } from "./Constantes/Couleurs";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type StackParamList = {
    Oeufs: undefined,
    Parametres: undefined,
    Personnalisation: undefined
}

type themeContextType = {
    backgroundColor: [backgroundColor: string, setBackgroundColor: Function]
}

export const ThemeContext = createContext<themeContextType | null>(null)

const Stack = createNativeStackNavigator<StackParamList>()

function test() {
    return (
        <View></View>
    )
}

/**
 * Point d'entrée de l'application mobile
 */
export default function App() {

    const [theme, setTheme] = useState({backgroundColor: 'c1'})

    function setBackgroundColor(bg: string) {
        setTheme({backgroundColor: bg})
    }

    useEffect(() => {
        AsyncStorage.getItem('userPreferences').then((value) => {
            if (value !== null) {
                setBackgroundColor(JSON.parse(value).backgroundColor)
            }
        })
    }, [])

    return (
        <SafeAreaProvider>
        <ThemeContext.Provider value={{backgroundColor: [theme.backgroundColor, setBackgroundColor]}}>
        <GestureHandlerRootView>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Oeufs" screenOptions={{gestureEnabled: true}}>
                    <Stack.Group
                    screenOptions={({route, navigation}) => ({
                        title: "CocoPoule",
                        headerRight: (props: HeaderButtonProps) => {

                            const insets = useSafeAreaInsets()
                            
                            return (
                                <TouchableOpacity style={styles.settingsWrapper} onPress={() => {
                                    navigation.navigate('Parametres')
                                }}>
                                    <Image source={require('./Images/settings_white.png')} style={[styles.settings, {top: insets.top}]} />
                                </TouchableOpacity>
                            )
                        },
                        headerLeft: (props: HeaderButtonProps) => {

                            const insets = useSafeAreaInsets()

                            return (
                                <TouchableOpacity style={[styles.backWrapper]} onPress={() => {
                                    navigation.navigate('Oeufs')
                                }}>
                                    <Image source={require('./Images/backButton.png')} style={[styles.back, {top: insets.top}]} />
                                </TouchableOpacity>
                            )
                        },
                        header: (props) => {
                            
                            const insets = useSafeAreaInsets()
                            const headerHeight = Dim.heightScale(7) + insets.top

                            const theme = useContext(ThemeContext)!
                            const [backgroundColor, setBackgroundColor] = theme.backgroundColor

                            const rightButton = props.options.headerRight ? props.options.headerRight({canGoBack: true}) : null
                            const leftButton = props.options.headerLeft ? props.options.headerLeft({canGoBack: true}) : null

                            return (
                                <View style={[styles.header, props.options.headerStyle, {paddingTop: insets.top, height: headerHeight, backgroundColor: DEGRADES[backgroundColor][2]}]}>
                                    
                                    {props.options.headerBackVisible ? leftButton : null}

                                    <Text style={[styles.title, props.options.headerTitleStyle]}>{props.options.title}</Text>
                                    
                                    {rightButton}

                                </View>
                            )

                           
                        },
                    })}
                    >
                        <Stack.Screen
                            name="Oeufs"
                            component={Oeufs}
                            options={{title: 'Oeufs'}}
                        />
                        <Stack.Screen
                            name="Personnalisation"
                            component={Personnalisation}
                            options={{headerBackVisible: true, headerRight: undefined, title: 'Personnaliser'}}
                        />
                        <Stack.Screen
                            name="Parametres"
                            component={Parametres}
                            options={{headerBackVisible: true, headerRight: undefined, title: 'Paramètres'}}
                        />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
        </ThemeContext.Provider>
        </SafeAreaProvider>
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
    header: {
        height: Dim.heightScale(8),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    },
    title: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: Dim.scale(6)
    },
    back: {
        position: 'relative',
        top: 0,
        left: 0,
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
    },
    backWrapper: {
        position: 'absolute',
        height: Dim.heightScale(5),
        width: Dim.heightScale(5),
        left: Dim.widthScale(2),
        top: Dim.heightScale(1),
    }
})
