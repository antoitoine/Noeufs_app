import { StyleSheet, Text, TouchableOpacity } from "react-native"
import * as Dim from '../../Utils/Dimensions'

type boutonType = {
    colors: {dark: string, light: string}
    titre: string
    onPress: Function
}

function Bouton({colors, titre, onPress}: boutonType) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.background, {backgroundColor: colors.dark}]}
            onPress={() => {
                onPress()
            }}
        >
            <Text style={[styles.texte]}>{titre}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    background: {
        flexGrow: 1,
        borderRadius: Dim.scale(1),

        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    texte: {
        color: 'white',
        fontSize: Dim.scale(4),
        fontWeight: 'bold',

        textAlign: 'center',
        textAlignVertical: 'center',
    }
})

export default Bouton
