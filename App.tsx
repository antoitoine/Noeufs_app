import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigatorContainer from "./src/Pages/MainNavigator/MainNavigatorContainer";
import { ThemeProvider } from "./src/Contexts/ThemeContext";
import { AuthProvider } from "./src/Contexts/AuthContext";

export type StackParamList = {
    Oeufs: undefined,
    Settings: undefined,
    Personnalisation: undefined,
    Compte: undefined,
    Historique: undefined,
    Animaux: undefined,
    Statistiques: undefined
}

export default function App() {
    return (
        <SafeAreaProvider>
        <AuthProvider>
        <ThemeProvider>
        <GestureHandlerRootView>
            <MainNavigatorContainer />
        </GestureHandlerRootView>
        </ThemeProvider>
        </AuthProvider>
        </SafeAreaProvider>
    )
}
