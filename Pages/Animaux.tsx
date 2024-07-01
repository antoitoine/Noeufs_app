import { ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as Dim from '../Utils/Dimensions'
import { FAKE_WHITE } from "../Constantes/Couleurs";

const createAnimauxData = (src: Array<string>) => {
    const data = []

    for (var i = 0; i < src.length; ++i) {
        data.push({id: i, name: src[i]})
    }

    return data
}

const animaux = createAnimauxData([
    'Poules',
    'Oies',
    'Cannes',
    'Cailles'
])

export default function Animaux() {

    const renderAnimaux = (item: ListRenderItemInfo<{id: number, name: string}>) => {
        return (
            <View style={stylesItem.item}>
                <Text style={stylesItem.text}>{item.item.name}</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={animaux}
            renderItem={renderAnimaux}
            style={styles.listWrapper}
            contentContainerStyle={styles.listContainer}
        />
    )
}

// TODO : Ajouter notion de groupes
// TODO : Ajouter dans les items - nombres d'animaux, combien couvent

const styles = StyleSheet.create({
    listWrapper: {
        flex: 1,
        backgroundColor: FAKE_WHITE
    },
    listContainer: {
        flexDirection: 'column',
        padding: Dim.scale(4),
        paddingTop: Dim.heightScale(2)
    }
})

const stylesItem = StyleSheet.create({
    item: {
        flex: 1,
        height: Dim.heightScale(20),
        borderRadius: Dim.scale(1),
        backgroundColor: 'white',
        marginBottom: Dim.heightScale(2),
        padding: Dim.scale(1),
        shadowOffset: {width: 1, height: 5},
        shadowColor: 'black',
        shadowOpacity: 0.1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: Dim.scale(4),
    }
})
