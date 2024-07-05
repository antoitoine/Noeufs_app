import { Dimensions, ListRenderItem, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as Dim from "../Utils/Dimensions"
import { DEGRADES, FAKE_WHITE } from "../Constantes/Couleurs";
import { FlatList } from "react-native-gesture-handler";
import * as Couleur from '../Utils/Couleurs'
import { useContext, useEffect, useState } from "react";
import { NOMS_JOURS, NOMS_MOIS, date } from "../Utils/Date";
import moment from "moment"
import 'moment/min/locales'
import { ThemeContext } from "../Contexts/ThemeContext";

function createData(nbItems: number) {
    const data = []
    
    for(var i = 1; i <= nbItems; ++i) {
        data.push({id: i.toString(), text: i.toString()})
    }

    return data
}

function createFooterData(items: Array<{text: string, value: string}>) {
    const data = []

    for (var i = 0; i < items.length; i++) {
        data.push({id: i, text: items[i].text, value: items[i].value})
    }

    return data
}

export default function Historique() {

    const theme = useContext(ThemeContext)!

    const [moisChoisi, setMoisChoisi] = useState(parseInt(moment().format('MM')))
    const [tapping, setTapping] = useState({isFirstTap: true, firstDate: moment().format('DD/MM/YYYY'), secondDate: moment().format('DD/MM/YYYY')})

    const gradient = Couleur.degradeCouleur(DEGRADES[theme.backgroundColor][0], DEGRADES[theme.backgroundColor][1], theme.nbJours)
    const gradientDark = Couleur.degradeCouleur(DEGRADES[theme.backgroundColor][2], DEGRADES[theme.backgroundColor][3], theme.nbJours)
    const interactiveColor = Couleur.getRGBColorFromGradient(gradient, theme.idJour)
    const interactiveDarkColor = Couleur.getRGBColorFromGradient(gradientDark, theme.idJour)

    useEffect(() => {
        moment.locale(['fr', 'en'])
    }, [])

    const firstDay = moment('01/' + moisChoisi.toString() + '/2024', 'DD/MM/YYYY').startOf('month').day()
    const lastDay = moment('01/' + moisChoisi.toString() + '/2024', 'DD/MM/YYYY').endOf('month').date()

    const nbItems = 49
    const data = createData(nbItems)

    console.log('First : ' + firstDay.toString())

    var idDay = 0

    const renderItem = (item: ListRenderItemInfo<{id: string, text: string}>) => {

        idDay ++
        const day = parseInt(item.item.text) - (firstDay === 0 ? 7 : firstDay) + 1 - 7
        const disabled = day < 1 || day > lastDay

        const momentCurrentDay = moment(day.toString() + '/' + moisChoisi.toString() + '/2024', 'DD/MM/YYYY')

        const selected = tapping.isFirstTap && 
                         moment(tapping.firstDate, 'DD/MM/YYYY').isBefore(momentCurrentDay) &&
                         moment(tapping.secondDate, 'DD/MM/YYYY').isAfter(momentCurrentDay)
        const selected2 = tapping.firstDate === momentCurrentDay.format('DD/MM/YYYY') || (tapping.isFirstTap && tapping.secondDate === momentCurrentDay.format('DD/MM/YYYY'))

        if (idDay <= 7) {
            return (
                <TouchableOpacity
                    style={[styles.gridItem, {backgroundColor: FAKE_WHITE, opacity: 0.5}]}
                    disabled={true}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.gridItemText, {color: interactiveColor}]}>{NOMS_JOURS[idDay-1].charAt(0)}</Text>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <TouchableOpacity
                    style={[styles.gridItem, {backgroundColor: selected ? interactiveDarkColor : (selected2 ? (!tapping.isFirstTap ? 'red' : interactiveDarkColor) : interactiveColor), opacity: disabled ? 0 : 1}]}
                    disabled={disabled}
                    activeOpacity={0.8}
                    onPress={() => {
                        onDayTap(moment(day.toString() + '/' + moisChoisi.toString() + '/' + '2024', 'DD/MM/YYYY').format('DD/MM/YYYY'))
                    }}
                >
                    <Text style={[styles.gridItemText]}>{day}</Text>
                </TouchableOpacity>
            )
        }
        
    }

    const renderFooterItem = (item: ListRenderItemInfo<{id: number, text: string, value: string}>) => {
        return (
            <TouchableOpacity
                style={[styles.footerItem, {backgroundColor: interactiveColor}]}
                activeOpacity={0.8}
            >
                <Text style={styles.footerText}>{item.item.text}</Text>
                <Text style={styles.footerValue}>{item.item.value}</Text>
            </TouchableOpacity>
        )
    }

    const footerData = createFooterData([
        {text: 'Début période', value: tapping.firstDate},
        {text: 'Fin période', value: tapping.secondDate},
        {text: 'Poules', value: '0'},
        {text: 'Cailles', value: '0'},
        {text: 'Oies', value: '0'},
        {text: 'Cannes', value: '0'}
    ])

    const footerComponent = () => (
        <FlatList
            data={footerData}
            renderItem={renderFooterItem}
            style={styles.footerWrapper}
            contentContainerStyle={styles.footerContainer}
            scrollEnabled={false}
        />
    )

    const headerComponent = () => (
        <View style={styles.header}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    setMoisChoisi(moisChoisi - 1)
                }}
            >
                <Text style={styles.buttonText}>{'<'}</Text>
            </TouchableOpacity>

            <Text style={[styles.affichageMois, {color: interactiveDarkColor}]}>{moment('01/' + moisChoisi.toString() + '/2024', 'DD/MM/YYYY').format('MMMM YYYY')}</Text>
            
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    setMoisChoisi(moisChoisi + 1)
                }}
            >
                <Text style={styles.buttonText}>{'>'}</Text>
            </TouchableOpacity>
        </View>
        
    )

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={7}
            contentContainerStyle={styles.container}
            style={styles.wrapper}
            scrollEnabled={true}
            ListHeaderComponent={headerComponent}
            ListFooterComponent={footerComponent}
        />
    )

    function onDayTap(day: string) {
        console.log('Tap on : ' + day)
        // TODO : Faire en sorte de cliquer sur un premier jour puis un deuxième
        // Utiliser un state avec une structure {isFirstTap: bool, firstDate: string, secondDate: string}

        if (tapping.isFirstTap) {
            setTapping({isFirstTap: false, firstDate: day, secondDate: ''})
        } else if (moment(tapping.firstDate, 'DD/MM/YYYY').isBefore(moment(day, 'DD/MM/YYYY)')) || tapping.firstDate === day) {
            setTapping({isFirstTap: true, firstDate: tapping.firstDate, secondDate: day})
        }
    }
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: Dim.scale(5),
        fontWeight: 'bold'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerWrapper: {
        marginTop: Dim.heightScale(5),
    },
    footerContainer: {
        
    },
    footerText: {
        fontSize: Dim.scale(5),
        textAlign: 'left',
        flex: 1,
        color: 'white',
        fontWeight: 'bold'
    },
    footerItem: {
        width: Dim.widthScale(100) - 2 * Dim.scale(2),
        justifyContent: 'flex-end',
        padding: Dim.scale(3),
        marginBottom: Dim.heightScale(2),
        borderRadius: Dim.scale(2),
        height: Dim.heightScale(10)
    },
    wrapper: {
        flex: 1,
        backgroundColor: FAKE_WHITE
    },
    container: {
        padding: Dim.scale(2),
        
    },
    gridItem: {
        flex: 1,
        margin: 4,
        aspectRatio: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    gridItemText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: Dim.scale(4)
    },
    affichageMois: {
        fontSize: Dim.scale(6),
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    footerValue: {
        color: FAKE_WHITE,
        fontWeight: 'bold',
        fontSize: Dim.scale(5),
        alignSelf: 'flex-end'
    }
})

