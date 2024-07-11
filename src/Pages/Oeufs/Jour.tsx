import { StyleSheet, TouchableOpacity } from "react-native";
import * as Dim from '../../Utils/Dimensions'

const taille_disque = Dim.scale(6);

function Jour({posx, posy, style, couleur, id, onPress, selected}: {posx: number, posy: number, style?: Object, couleur: string, id: number, onPress: Function, selected: Boolean}) {

    if(selected) {
        posx += taille_disque / 4
        posy += taille_disque / 4
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.disqueJour, {left: posx, bottom: posy}, style, {backgroundColor: couleur}, selected ? styles.selected : styles.notSelected]}
            onPress={() => {
                onPress(id);
            }}>
            
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    disqueJour: {
        position: 'absolute',
        backgroundColor: 'blue',
    },
    selected: {
        height: taille_disque / 2,
        width: taille_disque / 2,
        borderRadius: taille_disque / 4
    },
    notSelected: {
        height: taille_disque,
        width: taille_disque,
        borderRadius: taille_disque / 2
    },
})

export default Jour