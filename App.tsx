import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import MainNavigatorContainer from "./src/Pages/MainNavigator/MainNavigatorContainer";
import { ThemeProvider } from "./src/Contexts/ThemeContext";

export type StackParamList = {
    Oeufs: undefined,
    Settings: undefined,
    Personnalisation: undefined,
    Compte: undefined,
    Historique: undefined,
    Animaux: undefined,
    Statistiques: undefined
}

type authContextType = {
    user: [user: User | null, setUser: Function]
}

export const AuthContext = createContext<authContextType | null>(null)

/**
 * Point d'entrée de l'application mobile
 */
export default function App() {

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
        <ThemeProvider>
        <GestureHandlerRootView>
            <MainNavigatorContainer />
        </GestureHandlerRootView>
        </ThemeProvider>
        </AuthContext.Provider>
        </SafeAreaProvider>
    )
}

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