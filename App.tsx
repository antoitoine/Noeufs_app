import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import Oeufs from "./Pages/Oeufs";

const Stack = createNativeStackNavigator();

/**
 * Point d'entrée de l'application mobile
 */
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Oeufs">
                <Stack.Screen name="Oeufs" component={Oeufs} options={{title: "Noeufs"}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

