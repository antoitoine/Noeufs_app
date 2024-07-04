import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import Oeufs from "../../Pages/Oeufs";
import * as Dim from '../../Utils/Dimensions';
import Personnalisation from "../../Pages/Personnalisation";
import { FAKE_WHITE } from "../../Constantes/Couleurs";
import Compte from "../../Pages/Compte";
import Historique from "../../Pages/Historique";
import Animaux from "../../Pages/Animaux";
import Statistiques from "../../Pages/Statistiques";
import SettingsContainer from "../../Pages/Settings/SettingsContainer";
import { StackParamList } from "../../App";
import HeaderContainer from "../Header/HeaderContainer";
import BackButtonContainer from "../Header/BackButton/BackButtonContainer";
import SettingsButtonContainer from "../Header/SettingsButton/SettingsButtonContainer";
import { User } from "firebase/auth";
import { ExtendedNavigationOptions } from "../../declarations/types.d";
import ModeButtonContainer from "../Header/ModeButton/ModeButtonContainer";

type MainNavigatorProps = {
    user: User | null
}

const Stack = createNativeStackNavigator<StackParamList>()

/**
 * Point d'entrée de l'application mobile
 */
function MainNavigatorComponent({user}: MainNavigatorProps) {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Oeufs" screenOptions={{gestureEnabled: true}}>
                <Stack.Group
                screenOptions={({route, navigation}) => ({
                    title: "CocoPoule",
                    headerLeft: () => <BackButtonContainer route={route} navigation={navigation} />,
                    headerRight: () => <SettingsButtonContainer navigation={navigation} route={route} />,
                    headerMiddle: () => <ModeButtonContainer navigation={navigation} route={route} />,
                    header: (props) => <HeaderContainer {...props} />,
                    
                } as ExtendedNavigationOptions)}
                >
                    <Stack.Screen
                        name="Oeufs"
                        component={Oeufs}
                        options={{title: 'Oeufs', headerMiddleVisible: true, headerRightVisible: true} as ExtendedNavigationOptions}
                    />
                    <Stack.Screen
                        name="Personnalisation"
                        component={Personnalisation}
                        options={{headerBackVisible: true, title: 'Personnaliser'}}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={SettingsContainer}
                        options={{headerBackVisible: true, title: 'Paramètres'}}
                    />
                    <Stack.Screen
                        name="Compte"
                        component={Compte}
                        options={{headerBackVisible: true, title: user ? 'Mon compte' : 'Connexion'}}
                    />
                    <Stack.Screen
                        name="Historique"
                        component={Historique}
                        options={{headerBackVisible: true, title: 'Historique'}}
                    />
                    <Stack.Screen
                        name="Animaux"
                        component={Animaux}
                        options={{headerBackVisible: true, title: 'Animaux'}}
                    />
                    <Stack.Screen
                        name="Statistiques"
                        component={Statistiques}
                        options={{headerBackVisible: true, title: 'Statistiques'}}
                    />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
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

export default MainNavigatorComponent

/*

headerLeft: (props: HeaderButtonProps) => {
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
                        }
*/
