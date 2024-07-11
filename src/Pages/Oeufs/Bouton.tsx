import { StyleSheet, Text, TouchableOpacity } from "react-native"
import * as Dim from '../../Utils/Dimensions'

function Bouton({posx, posy, width, height, couleur, texte, onPress}: {posx: number, posy: number, width: number, height: number, couleur: string, texte: string, onPress: Function}) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.bouton, {left: posx, width: width, height: height, backgroundColor: couleur, bottom: posy}]}
            onPress={() => {
                onPress()
            }}
        >
            <Text style={[styles.boutonTexte]}>{texte}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    bouton: {
        position: 'absolute',
        left: Dim.widthScale(70),
        width: Dim.widthScale(20),
        height: Dim.heightScale(10),

        backgroundColor: 'red',
        borderRadius: Dim.scale(2),

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    boutonTexte: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: Dim.scale(4)
    },
})

export default Bouton
