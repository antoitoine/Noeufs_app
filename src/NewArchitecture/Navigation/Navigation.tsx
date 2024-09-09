import { User } from "@firebase/auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackParamList } from "../../../App";
import BackButton from "./Header/BackButton";
import SettingsButton from "./Header/SettingsButton";
import ModeButton from "./Header/ModeButton";
import Header from "./Header/Header";
import Oeufs from "../Oeufs/Oeufs";
import Personnalisation from "../Personnalisation/Personnalisation";
import Parametres from "../Parametres/Parametres";
import Compte from "../Compte/Compte";
import Animaux from "../Animaux/Animaux";
import Statistiques from "../Statistiques/Statistiques";
import Tests from "../../Pages/Tests";
import { ExtendedNavigationOptions } from "../../Declare/types.d";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { NavigationContainer } from "@react-navigation/native";

type NavigationProps = {
    
}

const Stack = createNativeStackNavigator<StackParamList>()

const Navigation = ({}: NavigationProps) => {

    const user = useContext(AuthContext)!.user

    return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Oeufs" screenOptions={{gestureEnabled: true}}>
            <Stack.Group
            screenOptions={({route, navigation}) => ({
                title: "CocoPoule",
                headerLeft: () => <BackButton route={route} navigation={navigation} />,
                headerRight: () => <SettingsButton navigation={navigation} route={route} />,
                headerMiddle: () => <ModeButton navigation={navigation} route={route} />,
                header: (props) => <Header {...props} />,
                
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
                    name="Parametres"
                    component={Parametres}
                    options={{headerBackVisible: true, title: 'Paramètres'}}
                />
                <Stack.Screen
                    name="Compte"
                    component={Compte}
                    options={{headerBackVisible: true, title: user ? 'Mon compte' : 'Connexion'}}
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
                <Stack.Screen
                    name="Tests"
                    component={Tests}
                    options={{headerBackVisible: true, title: 'Tests'}}
                />
            </Stack.Group>
        </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
