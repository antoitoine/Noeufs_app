import { StyleSheet, Text, TouchableOpacity } from "react-native"
import * as Dim from '../../Utils/Dimensions'

type SectionType = {
    title: string
    onPress: Function
    color: string
}

function Section({title, onPress, color}: SectionType) {
    return (
        <TouchableOpacity
            style={styles.wrapper}
            activeOpacity={0.7}
            onPress={() => {
                onPress()
            }}
        >
            <Text style={[styles.title, {color: color}]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: Dim.widthScale(90),
        height: Dim.heightScale(8),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Dim.heightScale(1),
        marginBottom: Dim.heightScale(1),

        borderRadius: Dim.scale(1),
        backgroundColor: 'white'
    },
    title: {
        textAlign: 'center',
        textAlignVertical: 'center',

        color: 'black',
        fontSize: Dim.scale(5),
        fontWeight: 'bold'
    }
})

export default Section
