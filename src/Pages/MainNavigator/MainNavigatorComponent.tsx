import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import Oeufs from "../Oeufs";
import * as Dim from '../../Utils/Dimensions';
import Personnalisation from "../Personnalisation";
import { FAKE_WHITE } from "../../Constantes/Couleurs";
import Compte from "../Compte";
import Historique from "../Historique";
import Animaux from "../Animaux";
import Statistiques from "../Statistiques";
import SettingsContainer from "../Settings/SettingsContainer";
import { StackParamList } from "../../../App";
import HeaderContainer from "../Header/HeaderContainer";
import BackButtonContainer from "../Header/BackButton/BackButtonContainer";
import SettingsButtonContainer from "../Header/SettingsButton/SettingsButtonContainer";
import { User } from "firebase/auth";
import { ExtendedNavigationOptions } from "../../Declare/types.d";
import ModeButtonContainer from "../Header/ModeButton/ModeButtonContainer";
import OeufsContainer from "../Oeufs/OeufsContainer";

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
                        component={OeufsContainer}
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
