import { useRef } from "react"
import { StyleSheet, TextInput } from "react-native"
import * as Dim from '../../Utils/Dimensions'

type inputType = {
    colors: {dark: string, light: string},
    onSubmit: Function
}

function Input({colors, onSubmit}: inputType) {
    
    const text = useRef('')
    
    return (
        <TextInput
            style={[styles.input, {borderColor: colors.dark, color: colors.dark}]}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.light}
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
        flexGrow: 1,

        padding: 0,

        borderWidth: Dim.scale(1),
        borderRadius: Dim.scale(1),

        textAlign: 'center',
        textAlignVertical: 'center',

        fontWeight: 'bold',
        fontSize: Dim.scale(5),
    }
})

// TODO : Afficher initialement le nombre d'oeufs du jour

export default Input
