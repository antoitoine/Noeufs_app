import { StyleSheet, Text, View } from "react-native";

/**
 * Page principale où se trouve la roue des jours
 */
export default function Oeufs() {
    return (
        <>
            {
                [...Array(100).keys()].map((i: number) => {
                    return (
                        <Jour key={i} posx={3*i} posy={Math.exp(0.066*i)} />
                    )
                })
            }
        </>
    )
}

function Jour({posx, posy}: {posx: number, posy: number}) {

    return (
        <View style={[styles.disqueJour, {left: posx, bottom: posy}]}>
            
        </View>
    )
}

const styles = StyleSheet.create({
    disqueJour: {
        position: 'absolute',
        height: 10,
        width: 10,
        borderRadius: 5,

        backgroundColor: 'blue'
    }
});
