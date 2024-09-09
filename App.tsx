import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigatorContainer from "./src/Pages/MainNavigator/MainNavigatorContainer";
import { ThemeProvider } from "./src/Contexts/ThemeContext";
import { AuthProvider } from "./src/Contexts/AuthContext";
import Navigation from "./src/NewArchitecture/Navigation/Navigation";

export type StackParamList = {
    Oeufs: undefined,
    Settings: undefined,
    Personnalisation: undefined,
    Compte: undefined,
    Historique: undefined,
    Animaux: undefined,
    Statistiques: undefined,
    Tests: undefined,
    Parametres: undefined
}

export default function App() {
    return (
        <SafeAreaProvider>
        <AuthProvider>
        <ThemeProvider>
        <GestureHandlerRootView>
            <Navigation />
        </GestureHandlerRootView>
        </ThemeProvider>
        </AuthProvider>
        </SafeAreaProvider>
    )
}
