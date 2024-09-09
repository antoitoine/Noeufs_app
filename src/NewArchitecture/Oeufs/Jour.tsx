import { Image, StyleSheet, TouchableOpacity } from "react-native";
import * as Dim from '../../Utils/Dimensions'

const disabledImageSrc = require('../../Images/diagonal_stripes_transparent_50.png')

const taille_disque = Dim.scale(6);

function Jour({posx, posy, style, couleur, id, onPress, selected, disabled}: {posx: number, posy: number, style?: Object, couleur: string, id: number, onPress: Function, selected: Boolean, disabled: Boolean}) {

    if(selected && !disabled) {
        posx += taille_disque / 4
        posy += taille_disque / 4
    }

    if (disabled) {
        return (
            <Image source={disabledImageSrc} alt='disabled' style={[styles.disqueJour, styles.notSelected, {left: posx, bottom: posy}, style, {tintColor: couleur}]} />
        )
    } else {
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
}

const styles = StyleSheet.create({
    disqueJour: {
        position: 'absolute',
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