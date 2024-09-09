import { Animated, Dimensions, Keyboard, KeyboardAvoidingView, StatusBar, StyleSheet, Text, View } from "react-native";
import * as Dim from '../../Utils/Dimensions';
import { StackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PanGestureHandler } from "react-native-gesture-handler";
import { FAKE_WHITE } from "../../Constantes/Couleurs";
import moment from "moment";
import React, { useRef, useState } from "react";
import { EdgeInsets, initialWindowMetrics, SafeAreaView } from "react-native-safe-area-context";
import Bouton from "./Bouton";
import Input from "./Input";
import Jour from "./Jour";
import * as Couleur from '../../Utils/Couleurs'
import { User } from "firebase/auth";
import InformationButton from "./InformationButton";

export const taille_disque = Dim.scale(5.5);

type NavigationProps = NativeStackScreenProps<StackParamList, 'Oeufs'>;

type OeufsComponentProps = {
    colors: {dark: string, light: string, darkGradient: Array<Array<number>>, lightGradient: Array<Array<number>>}
    nbOeufs: Array<number | undefined>
    date: moment.Moment
    insets: EdgeInsets
    events: {changeMonth: (decalage: number) => void, changeDay: (id: number) => void}
    user: User | null
    reinitialiserOeufs: () => void
    ajouterOeufs: (quantite: number | undefined) => void
    nbOeufsInput: React.MutableRefObject<null | number>
}

function OeufsComponent({route, navigation, colors, nbOeufs, date, insets, events, user, reinitialiserOeufs, ajouterOeufs, nbOeufsInput}: NavigationProps & OeufsComponentProps) {

    const [oeufsHeight, setOeufsHeight] = useState(0)

    /* Calcul affichage du nombre d'oeufs */

    const translation = useRef(new Animated.Value(0)).current;

    var nbOeufs_text = ''
    const circleWidth = Math.min(Dim.widthScale(45), Dim.heightScale(33.33))


    if (nbOeufs[date.date()] === undefined) nbOeufs_text = '?'
    else if (nbOeufs[date.date()]! < 0)      nbOeufs_text = 'Pas de récolte'
    else if (nbOeufs[date.date()]! <= 1)     nbOeufs_text = nbOeufs[date.date()] + ' Oeuf'
    else                            nbOeufs_text = nbOeufs[date.date()] + ' Oeufs'

    function showDays(position: Animated.AnimatedInterpolation<string | number>, color?: string) {
        return (
            <Animated.View
                style={{
                    position: 'relative',
                    flexBasis: Dim.widthScale(100),
                    transform: [{translateX: position}],
                }}
            >
                
                <View style={[styles.affichageOeufs, {height: oeufsHeight / 2, bottom: oeufsHeight / 4}]}>
                    <Text style={[styles.affichageOeufsText, {color: colors.dark}]}>
                        {nbOeufs_text}
                    </Text>
                </View>
                {
                    [...Array(date.daysInMonth()).keys()].map((i: number) => {

                        const day = i + 1

                        const angle = day * 2 * Math.PI / date.daysInMonth();
                        const posX = Dim.widthScale(50) + Math.cos(angle) * circleWidth - taille_disque / 2;
                        const posY = oeufsHeight / 2 + Math.sin(angle) * circleWidth - taille_disque / 2;
                        
                        const color = Couleur.getRGBColorFromGradient(nbOeufs[day] !== undefined ? colors.darkGradient : colors.lightGradient, day-1)
                        //const color = nbOeufs.parJour[i] !== undefined ? colors.darkGradient[i] : colors.lightGradient[i]
    
                        return (
                            <Jour key={day} posx={posX} posy={posY} couleur={color} id={day} onPress={(id: number) => events.changeDay(id)} selected={day == date.date()} disabled={moment().isBefore(moment(day + '/' + (date.month()+1) + '/' + date.year(), 'DD/MM/YYYY'))} />
                        )
                        
                    })
                }
            </Animated.View>
        )
    }

    return (
        <SafeAreaView style={{position: 'absolute', height: Dim.heightScale(100), width: Dim.widthScale(100), bottom: 0}}>
        <KeyboardAvoidingView
            onTouchStart={(event) => {
                setTimeout(() => Keyboard.dismiss(), 200)
            }}
            style={styles2.wrapper} contentContainerStyle={styles2.container}
            behavior="height"
            keyboardVerticalOffset={Dim.heightScale(7) + insets.bottom}
        >
            

            <View style={styles2.date}>
                <Text style={[styles2.dateTexte, {color: colors.dark}]}>{date.date() == 1 ? '1er' : date.date()} {date.format('MMMM YYYY')}</Text>
            </View>

            
                <PanGestureHandler
                    onGestureEvent={Animated.event([{
                        nativeEvent: {
                            translationX: translation
                        }
                    }],
                    {useNativeDriver: true}
                    )}
                    onEnded={(event) => {
                        const dragX = event.nativeEvent.translationX as number

                        var etat = 0;                 // 0 : Pas de slide / 1 : gauche / 2 : droite
                        if (Math.abs(dragX) > 80) {
                            if (dragX < 0) {
                                etat = 1;
                            }
                            else {
                                etat = 2;
                            }
                        }

                        const val = etat == 0 ? 0 : (etat == 1 ? -Dim.widthScale(100) : Dim.widthScale(100));

                        Animated.timing(translation, {
                            toValue: val,
                            useNativeDriver: true,
                        }).start(() => {
                            translation.setValue(0);

                            if (etat == 2) events.changeMonth(- 1)
                            else if (etat == 1) events.changeMonth(+ 1)
                        });
                    }}
                >
                    <Animated.View
                        style={styles2.oeufs}
                        onLayout={(event) => {
                            setOeufsHeight(event.nativeEvent.layout.height)
                        }}
                    >
                        {
                            // Rouge au centre
                            showDays(translation.interpolate({
                                inputRange: [-Dim.widthScale(100), 0, Dim.widthScale(100)], // 0 pour centrer
                                outputRange: [-Dim.widthScale(100), 0, Dim.widthScale(100)]  // Déplacement fluide de gauche à droite
                            }), 'red')
                        }
                        {
                            // Bleu à gauche
                            showDays(translation.interpolate({
                                inputRange: [-Dim.widthScale(100), 0, Dim.widthScale(100)],
                                outputRange: [-Dim.widthScale(300), -Dim.widthScale(200), -Dim.widthScale(100)] // Bleue décalée à gauche
                            }), 'blue')
                        }
                        {
                            // Orange à droite
                            showDays(translation.interpolate({
                                inputRange: [-Dim.widthScale(100), 0, Dim.widthScale(100)],
                                outputRange: [-Dim.widthScale(200), -Dim.widthScale(100), 0] // Orange décalée à droite
                            }), 'orange')
                        }
                    </Animated.View>

                </PanGestureHandler>
            
            
            <View style={styles2.boutons}>
                <View style={[styles2.boutons_lig, styles2.boutons_lig1]}>
                    <Bouton
                        colors={{dark: colors.dark, light: colors.light}}
                        titre={'Valider'}
                        onPress={() => {
                            Keyboard.dismiss()
                            ajouterOeufs(nbOeufsInput.current!)
                        }}
                    />
                </View>
                <View style={[styles2.boutons_lig, styles2.boutons_lig2]}>
                    
                    <Bouton
                        colors={{dark: colors.dark, light: colors.light}}
                        titre={'Réinitialiser'}
                        onPress={() => {
                            reinitialiserOeufs()
                        }}
                    />

                    <Input
                        colors={{dark: colors.dark, light: colors.light}}
                        onSubmit={(value: number) => {
                            nbOeufsInput.current = value
                        }}
                    />

                    <Bouton
                        colors={{dark: colors.dark, light: colors.light}}
                        titre={'Aucun oeuf'}
                        onPress={() => {
                            ajouterOeufs(0)
                        }}
                    />
                </View>
            </View>


        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mode: {
        borderRadius: Dim.scale(1),
        width: Dim.scale(12),
        height: Dim.scale(12),
        backgroundColor: 'red',
        position: 'absolute',
        right: Dim.scale(3),
        bottom: Dim.heightScale(100),
        justifyContent: 'center',
        alignItems: 'center'
    },
    disqueJour: {
        position: 'absolute',
        backgroundColor: 'blue',
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
    affichageJour: {
        position: 'absolute',
        bottom: Dim.heightScale(78),
        width: Dim.widthScale(100),
        left: 0,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(6),
        fontWeight: 'bold',
    },
    wrapper: {
        width: Dim.widthScale(100),
        height: Dim.heightScale(100),
        display: 'flex',
        flex: 1,
        backgroundColor: FAKE_WHITE
    },
    affichageOeufs: {
        position: 'absolute',
        width: Dim.widthScale(50),
        left: Dim.widthScale(25),

        alignItems: 'center',
        justifyContent: 'center'
    },
    affichageOeufsText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(10),
        fontWeight: 'bold'
    },
    bouton: {
        position: 'absolute',
        left: Dim.widthScale(70),
        width: Dim.widthScale(20),
        height: Dim.heightScale(10),

        backgroundColor: 'red',
        borderRadius: Dim.scale(2),

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    boutonTexte: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: Dim.scale(4)
    },
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
    defaultPosition: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: Dim.widthScale(100),
        height: Dim.heightScale(100)
    },
});

const styles2 = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: FAKE_WHITE,
    },
    container: {
        flexGrow: 1,

        backgroundColor: 'blue',

        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    date: {
        flexGrow: 0,
        flexBasis: Dim.heightScale(10),

        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',

        padding: Dim.scale(3)
    },
    dateTexte: {
        textAlign: 'center',
        textAlignVertical: 'center',

        flexGrow: 0,

        fontSize: Dim.scale(5),
        fontWeight: 'bold'
    },
    oeufs: {
        flexGrow: 0,
        flexBasis: Dim.heightScale(70),

        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'flex-start'
    },
    boutons: {
        flexGrow: 1,
        flexBasis: Dim.heightScale(20),

        flexDirection: 'column',
        justifyContent: 'space-around',

        padding: Dim.scale(3),
        gap: Dim.scale(3),
    },
    boutons_lig: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'stretch',

        gap: Dim.scale(3)
    },
    boutons_lig1: {
        flexGrow: 0.5,
    },
    boutons_lig2: {
        flexGrow: 1,
    },


})

// TODO : Préparer l'affichages des vues de gauche et droite (mois précédent et suivant) à l'avance

export default OeufsComponent
