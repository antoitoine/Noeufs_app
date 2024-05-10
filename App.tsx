import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Oeufs from "./Pages/Oeufs";
import * as Dim from './Utils/Dimensions';
import Parametres from "./Pages/Parametres";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { getDefaultHeaderHeight } from "@react-navigation/elements";

export type StackParamList = {
    Oeufs: undefined,
    Parametres: undefined
}

const Stack = createNativeStackNavigator<StackParamList>();


/**
 * Point d'entrée de l'application mobile
 */
export default function App() {
    return (
        <SafeAreaProvider>
        <GestureHandlerRootView>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Oeufs" screenOptions={{gestureEnabled: true }}>
                    <Stack.Group>
                        <Stack.Screen
                            name="Oeufs"
                            component={Oeufs}
                            options={{
                                title: "CocoPoule",
                                headerRight(props) {
                                    return <Image source={require('./Images/settings.png')} style={styles.settings} />
                                },
                                header(props) {
                                    const insets = useSafeAreaInsets()
                                    const headerHeight = Dim.heightScale(7) + insets.top

                                    return (
                                        <View style={[styles.header, props.options.headerStyle, {paddingTop: insets.top, height: headerHeight}]}>
                                            
                                            <Text style={[styles.title, props.options.headerTitleStyle]}>{props.options.title}</Text>
                                            <TouchableOpacity style={styles.settingsWrapper} onPress={() => {
                                                props.navigation.navigate('Parametres')
                                            }}>
                                                <Image source={require('./Images/settings_white.png')} style={[styles.settings, {top: insets.top}]} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                },}}
                        />
                    </Stack.Group>
                    <Stack.Group screenOptions={{
                        presentation: 'transparentModal',
                        headerShown: false,
                        animation: 'slide_from_bottom',
                        gestureEnabled: true,
                        fullScreenGestureEnabled: true
                    }}>
                        <Stack.Screen
                            name="Parametres"
                            component={Parametres}
                        />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
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
    }
})
