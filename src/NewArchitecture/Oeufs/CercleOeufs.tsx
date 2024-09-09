import { StyleSheet, Text, View } from "react-native";
import Jour from "./Jour";
import { Dispatch, SetStateAction, useState } from "react";
import moment, { Moment } from "moment";
import * as Dim from '../../Utils/Dimensions'
import { degradeCouleur, getRGBColorFromGradient } from "../../Utils/Couleurs";
import { DEGRADES } from "../../Constantes/Couleurs";
import { taille_disque } from "./Oeufs";

type cercleOeufsProps = {
    theme: any
    changerJourChoisi: Function
    dateChoisie: Moment
    setDateChoisie: Dispatch<SetStateAction<Moment>>
}

const CercleOeufs = ({theme, changerJourChoisi, dateChoisie, setDateChoisie}: cercleOeufsProps) => {
    /* States */

    const [nbOeufsMois, setNbOeufsMois] = useState(Array<number | undefined>(dateChoisie.daysInMonth()+1))
    const [containerHeight, setContainerHeight] = useState(100)

    /* Gradients */

    const lightGradient = degradeCouleur(DEGRADES[theme.backgroundColor][0], DEGRADES[theme.backgroundColor][1], dateChoisie.daysInMonth())
    const darkGradient = degradeCouleur(DEGRADES[theme.backgroundColor][2], DEGRADES[theme.backgroundColor][3], dateChoisie.daysInMonth())
    
    /* NbOeufs Affichage */

    var nbOeufs_text = ''
    const circleWidth = Math.min(Dim.widthScale(45), Dim.heightScale(33.33))

    if (nbOeufsMois[dateChoisie.date()] === undefined) nbOeufs_text = '?'
    else if (nbOeufsMois[dateChoisie.date()]! < 0)     nbOeufs_text = 'Pas de récolte'
    else if (nbOeufsMois[dateChoisie.date()]! <= 1)    nbOeufs_text = nbOeufsMois[dateChoisie.date()] + ' Oeuf'
    else                                               nbOeufs_text = nbOeufsMois[dateChoisie.date()] + ' Oeufs'

    return (
        <View
            style={styles.container}
            onLayout={(event) => {
                setContainerHeight(event.nativeEvent.layout.height)
            }}
        >
            
            <View style={[styles.nbOeufs]}>
                <Text style={[styles.nbOeufsText, {color: theme.colors.dark}]}>
                    {nbOeufs_text}
                </Text>
            </View>
            {
                [...Array(dateChoisie.daysInMonth()).keys()].map((i: number) => {

                    const day = i + 1

                    const angle = day * 2 * Math.PI / dateChoisie.daysInMonth();
                    const posX = Dim.widthScale(50) + Math.cos(angle) * circleWidth - taille_disque / 2;
                    const posY = containerHeight / 2 + Math.sin(angle) * circleWidth - taille_disque / 2;
                    
                    const color = getRGBColorFromGradient(nbOeufsMois[day] !== undefined ? darkGradient : lightGradient, day-1)
                    //const color = nbOeufs.parJour[i] !== undefined ? colors.darkGradient[i] : colors.lightGradient[i]

                    return (
                        <Jour
                            key={day}
                            posx={posX}
                            posy={posY}
                            couleur={color}
                            id={day}
                            onPress={(id: number) => changerJourChoisi(dateChoisie, setDateChoisie, id)}
                            selected={day == dateChoisie.date()} disabled={moment().isBefore(moment(day + '/' + (dateChoisie.month()+1) + '/' + dateChoisie.year(), 'DD/MM/YYYY'))}
                        />
                    )
                    
                })
            }
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: Dim.scale(1),

        width: Dim.widthScale(100),

        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',

        padding: Dim.scale(20)
    },
    nbOeufs: {
        flexGrow: 0
    },
    nbOeufsText: {
        textAlign: 'center',
        textAlignVertical: 'center',

        fontSize: Dim.scale(8),
        fontWeight: 'bold'
    }
})

export default CercleOeufs
