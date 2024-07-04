import { StyleSheet } from "react-native";
import * as Dim from './Utils/Dimensions';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createContext, useEffect, useState } from "react";
import { FAKE_WHITE } from "./Constantes/Couleurs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import MainNavigatorContainer from "./Pages/MainNavigator/MainNavigatorContainer";

export type StackParamList = {
    Oeufs: undefined,
    Settings: undefined,
    Personnalisation: undefined,
    Compte: undefined,
    Historique: undefined,
    Animaux: undefined,
    Statistiques: undefined
}

type themeContextType = {
    backgroundColor: [backgroundColor: string, setBackgroundColor: Function]
    idJour: [idJour: number, setIdJour: Function]
    nbJours: [nbJours: number, setNbJours: Function]
    headerHeight: [headerHeight: number, setHeaderHeight: Function]
    mode: [mode: number, setMode: Function]
}

type authContextType = {
    user: [user: User | null, setUser: Function]
}

export const ThemeContext = createContext<themeContextType | null>(null)
export const AuthContext = createContext<authContextType | null>(null)

/**
 * Point d'entrée de l'application mobile
 */
export default function App() {

    /* Theme context */

    const [theme, setTheme] = useState({backgroundColor: 'c1', idJour: 0, nbJours: 31, headerHeight: Dim.heightScale(7), mode: 0})

    function setBackgroundColor(bg: string) {
        setTheme({backgroundColor: bg, idJour: theme.idJour, nbJours: theme.nbJours, headerHeight: theme.headerHeight, mode: theme.mode})
    }
    function setIdJour(j: number) {
        setTheme({backgroundColor: theme.backgroundColor, idJour: j, nbJours: theme.nbJours, headerHeight: theme.headerHeight, mode: theme.mode})
    }
    function setNbJours(n: number) {
        setTheme({backgroundColor: theme.backgroundColor, idJour: theme.idJour, nbJours: n, headerHeight: theme.headerHeight, mode: theme.mode})
    }
    function setHeaderHeight(h: number) {
        setTheme({backgroundColor: theme.backgroundColor, idJour: theme.idJour, nbJours: theme.nbJours, headerHeight: h, mode: theme.mode})
    }
    function setMode(m: number) {
        setTheme({backgroundColor: theme.backgroundColor, idJour: theme.idJour, nbJours: theme.nbJours, headerHeight: theme.headerHeight, mode: m})
    }

    useEffect(() => {
        AsyncStorage.getItem('userPreferences').then((value) => {
            if (value !== null) {
                setBackgroundColor(JSON.parse(value).backgroundColor)
            }
        })
    }, [])

    /* Auth context */

    const [authContext, setAuthContext] = useState<{user: User | null}>({user: null})

    function setUser(u: User | null) {
        setAuthContext({user: u})
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User connected : ' + user.email + ' ' + user.displayName)
                setUser(user)
            } else {
                setUser(null)
            }
        })
    }, [])

    return (
        <SafeAreaProvider>
        <AuthContext.Provider value={{
            user: [authContext.user, setUser]
        }}>
        <ThemeContext.Provider value={{
            backgroundColor: [theme.backgroundColor, setBackgroundColor],
            idJour: [theme.idJour, setIdJour],
            nbJours: [theme.nbJours, setNbJours],
            headerHeight: [theme.headerHeight, setHeaderHeight],
            mode: [theme.mode, setMode]
        }}>
        <GestureHandlerRootView>
            <MainNavigatorContainer />
        </GestureHandlerRootView>
        </ThemeContext.Provider>
        </AuthContext.Provider>
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
    },
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

// TODO : Ajouter dans le theme context - interactiveLightColor et interactiveDarkColor


/*

<NavigationContainer>
                <Stack.Navigator initialRouteName="Oeufs" screenOptions={{gestureEnabled: true}}>
                    <Stack.Group
                    screenOptions={({route, navigation}) => ({
                        title: "CocoPoule",
                        headerRight: (props: HeaderButtonProps) => {

                            const insets = useSafeAreaInsets()
                            
                            return (
                                <TouchableOpacity style={styles.settingsWrapper} onPress={() => {
                                    navigation.navigate('Settings')
                                }}>
                                    <Image source={require('./Images/settings_white.png')} style={[styles.settings, {top: insets.top}]} />
                                </TouchableOpacity>
                            )
                        },
                        headerLeft: (props: HeaderButtonProps) => {

                            const insets = useSafeAreaInsets()

                            return (
                                <TouchableOpacity style={[styles.backWrapper]} onPress={() => {
                                    navigation.pop()
                                }}>
                                    <Image source={require('./Images/backButton.png')} style={[styles.back, {top: insets.top}]} />
                                </TouchableOpacity>
                            )
                        },
                        header: (props) => {
                            
                            const insets = useSafeAreaInsets()
                            const hHeight = Dim.heightScale(7) + insets.top

                            const theme = useContext(ThemeContext)!
                            const [backgroundColor, ] = theme.backgroundColor
                            const [idJour, ] = theme.idJour
                            const [nbJours, ] = theme.nbJours
                            const [headerHeight, setHeaderHeight] = theme.headerHeight

                            if (headerHeight !== hHeight)
                                setHeaderHeight(hHeight)

                            const gradient = degradeCouleur(DEGRADES[backgroundColor][2], DEGRADES[backgroundColor][3], nbJours)
                            const color = getRGBColorFromGradient(gradient, idJour)

                            const rightButton = props.options.headerRight ? props.options.headerRight({canGoBack: true}) : null
                            const leftButton = props.options.headerLeft ? props.options.headerLeft({canGoBack: true}) : null

                            return (
                                <View style={[styles.header, props.options.headerStyle, {paddingTop: insets.top, height: headerHeight, backgroundColor: color}]}>
                                    
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
                            options={{title: 'Oeufs', headerLeft: (props: HeaderButtonProps) => {
                                const insets = useSafeAreaInsets()
                                return (
                                    <TouchableOpacity
                                        style={[styles.headerModeButton, {top: insets.top + Dim.heightScale(1)}]}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            if (theme.mode + 1 >= MODES_OEUFS.length) {
                                                setMode(0)
                                            } else {
                                                setMode(theme.mode + 1)
                                            }
                                        }}
                                    >
                                        <Text style={[styles.headerModeButtonText]}>{MODES_OEUFS[theme.mode].charAt(0)}</Text>
                                    </TouchableOpacity>
                                )
                            }, headerBackVisible: true}}
                        />
                        <Stack.Screen
                            name="Personnalisation"
                            component={Personnalisation}
                            options={{headerBackVisible: true, headerRight: undefined, title: 'Personnaliser'}}
                        />
                        <Stack.Screen
                            name="Settings"
                            component={SettingsContainer}
                            options={{headerBackVisible: true, headerRight: undefined, title: 'Paramètres'}}
                        />
                        <Stack.Screen
                            name="Compte"
                            component={Compte}
                            options={{headerBackVisible: true, headerRight: undefined, title: authContext.user ? 'Mon compte' : 'Connexion'}}
                        />
                        <Stack.Screen
                            name="Historique"
                            component={Historique}
                            options={{headerBackVisible: true, headerRight: undefined, title: 'Historique'}}
                        />
                        <Stack.Screen
                            name="Animaux"
                            component={Animaux}
                            options={{headerBackVisible: true, headerRight: undefined, title: 'Animaux'}}
                        />
                        <Stack.Screen
                            name="Statistiques"
                            component={Statistiques}
                            options={{headerBackVisible: true, headerRight: undefined, title: 'Statistiques'}}
                        />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
            */