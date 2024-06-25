import { Dimensions, ListRenderItem, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as Dim from "../Utils/Dimensions"
import { DEGRADES, FAKE_WHITE } from "../Constantes/Couleurs";
import { FlatList } from "react-native-gesture-handler";
import * as Couleur from '../Utils/Couleurs'
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../App";
import { NOMS_JOURS, NOMS_MOIS, date } from "../Utils/Date";
import moment from "moment"
import 'moment/min/locales'

const nbItems = 42

function createData(nbItems: number) {
    const data = []
    
    for(var i = 1; i <= nbItems; ++i) {
        data.push({id: i.toString(), text: i.toString()})
    }

    return data
}

const data = createData(nbItems)

export default function Animaux() {

    const theme = useContext(ThemeContext)!
    const [backgroundColor, ] = theme.backgroundColor
    const [idJour, ] = theme.idJour
    const [nbJours, ] = theme.nbJours

    const gradient = Couleur.degradeCouleur(DEGRADES[backgroundColor][0], DEGRADES[backgroundColor][1], nbJours)
    const interactiveColor = Couleur.getRGBColorFromGradient(gradient, idJour)

    useEffect(() => {
        moment.locale(['fr', 'en'])
    }, [])

    const renderItem = (item: ListRenderItemInfo<{id: string, text: string}>) => {

        const firstDay = moment('01-09-2024', 'DD-MM-YYYY').startOf('month').day()
        const lastDay = moment('01-09-2024', 'DD-MM-YYYY').endOf('month').date()
        const day = parseInt(item.item.text) - (firstDay === 0 ? 7 : firstDay) + 1
        const disabled = day < 1 || day > lastDay

        console.log('day : ' + firstDay)

        return (
            <TouchableOpacity
                style={[styles.gridItem, {backgroundColor: interactiveColor, opacity: disabled ? 0 : 1}]}
                disabled={disabled}
            >
                <Text style={[styles.gridItemText]}>{day}</Text>
            </TouchableOpacity>
        )
    }

    const footerComponent = () => (
        <Text>{moment().startOf('month').day()} - {moment().endOf('month').format('dddd Do MMMM')}</Text>
    )

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={7}
            contentContainerStyle={styles.container}
            ListFooterComponent={footerComponent}
            style={styles.wrapper}
            scrollEnabled={false}
        />
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: FAKE_WHITE
    },
    container: {
        padding: Dim.scale(2)
    },
    gridItem: {
        flex: 1,
        margin: 8,
        aspectRatio: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    gridItemText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: Dim.scale(4)
    }
})

