import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { StyleSheet, Text, View } from "react-native"
import { EdgeInsets } from "react-native-safe-area-context"
import * as Dim from '../../Utils/Dimensions'
import { FAKE_WHITE } from "../../Constantes/Couleurs"

type headerComponentProps = {
    insets: EdgeInsets
    height: number
    colors: {light: string, dark: string}
    leftButton: React.ReactNode
    rightButton: React.ReactNode
    options: NativeStackNavigationOptions
}

function HeaderComponent({insets, height, colors, leftButton, rightButton, options}: headerComponentProps) {
    return (
        <View style={[styles.header, options.headerStyle, {paddingTop: insets.top, height: height, backgroundColor: colors.dark}]}>
            
            {options.headerBackVisible ? leftButton : null}

            <Text style={[styles.title, options.headerTitleStyle]}>{options.title}</Text>
            
            {rightButton}

        </View>
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

export default HeaderComponent
