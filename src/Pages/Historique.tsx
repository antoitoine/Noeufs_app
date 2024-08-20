import { Image, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as Dim from "../Utils/Dimensions"
import { FAKE_WHITE } from "../Constantes/Couleurs";
import { FlatList } from "react-native-gesture-handler";
import { useContext, useEffect, useState } from "react";
import { NOMS_JOURS } from "../Utils/Date";
import moment from "moment"
import 'moment/min/locales'
import { ThemeContext } from "../Contexts/ThemeContext";
import FastImage from "react-native-fast-image";

const diagonalStripesSrc = require('../Images/diagonal_stripes_transparent_100.png')
const leftArrowSrc = require('../Images/left_arrow.png')
const rightArrowSrc = require('../Images/right_arrow.png')

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
                    <Text style={[styles.gridItemText, {color: theme.colors.dark}]}>{NOMS_JOURS[idDay-1].charAt(0)}</Text>
                </TouchableOpacity>
            )
        }
        else {
            if (disabled || moment().isAfter(moment(day + '/' + moisChoisi + '/2024', 'DD/MM/YYYY'))) {
                return (
                    <TouchableOpacity
                        style={[styles.gridItem, {backgroundColor: selected ? theme.colors.dark : (selected2 ? (!tapping.isFirstTap ? '#A93226' : theme.colors.dark) : theme.colors.light), opacity: disabled ? 0 : 1}]}
                        disabled={disabled}
                        activeOpacity={0.8}
                        onPress={() => {
                            onDayTap(moment(day.toString() + '/' + moisChoisi.toString() + '/' + '2024', 'DD/MM/YYYY').format('DD/MM/YYYY'))
                        }}
                    >
                        <Text style={[styles.gridItemText]}>{day}</Text>
                    </TouchableOpacity>
                )
            } else {
                return (
                    <Image
                        source={diagonalStripesSrc}
                        style={[styles.gridItem, {tintColor: theme.colors.light}]}
                        alt={'disabled'}
                    />
                )
            }
        }
        
    }

    const renderFooterItem = (item: ListRenderItemInfo<{id: number, text: string, value: string}>) => {
        return (
            <TouchableOpacity
                style={[styles.footerItem, {backgroundColor: theme.colors.light}]}
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
                <Image style={[styles.arrowImage, {tintColor: theme.colors.dark}]} source={leftArrowSrc} alt='<' />
            </TouchableOpacity>

            <Text style={[styles.affichageMois, {color: theme.colors.dark}]}>{moment('01/' + moisChoisi.toString() + '/2024', 'DD/MM/YYYY').format('MMMM YYYY')}</Text>
            
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    setMoisChoisi(moisChoisi + 1)
                }}
            >
                <Image style={[styles.arrowImage, {tintColor: theme.colors.dark}]} source={rightArrowSrc} alt='>' />
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
    arrowImage: {
        width: Dim.scale(8),
        height: Dim.scale(8),
        aspectRatio: 1
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
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
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
    },
    gridItemImage: {
        flex: 1
    }
})

