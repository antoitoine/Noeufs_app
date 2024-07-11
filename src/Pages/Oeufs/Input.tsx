import { useRef } from "react"
import { StyleSheet, TextInput } from "react-native"
import * as Dim from '../../Utils/Dimensions'

function Input({posx, posy, width, height, couleur, couleur2, onSubmit}: {posx: number, posy: number, width: number, height: number, couleur: string, couleur2: string, onSubmit: Function}) {
    
    const text = useRef('')
    
    return (
        <TextInput
            style={[styles.input, styles.inputTexte, {left: posx, bottom: posy, width: width, height: height, borderColor: couleur, color: couleur}]}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={couleur2}
            onBlur={() => {
                onSubmit(parseInt(text.current))
                
            }}
            onChangeText={(t) => {
                text.current = t
                onSubmit(parseInt(text.current))
            }}
            onStartShouldSetResponder={(event) => true}
            onTouchStart={(event) => event.stopPropagation()}
            maxLength={3}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        position: 'absolute',
        borderRadius: Dim.scale(2),
        borderWidth: Dim.scale(1)
    },
    inputTexte: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        fontWeight: 'bold',
        fontSize: Dim.scale(6)
    },
})

export default Input
