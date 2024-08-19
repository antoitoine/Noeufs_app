import { Animated, Keyboard, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import * as Dim from '../../Utils/Dimensions';
import { StackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PanGestureHandler } from "react-native-gesture-handler";
import { FAKE_WHITE } from "../../Constantes/Couleurs";
import moment from "moment";
import React, { useRef } from "react";
import { EdgeInsets } from "react-native-safe-area-context";
import Bouton from "./Bouton";
import Input from "./Input";
import Jour from "./Jour";
import * as Couleur from '../../Utils/Couleurs'
import { User } from "firebase/auth";
import InformationButton from "./InformationButton";

export const taille_disque = Dim.scale(6);

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

    

    /* Calcul affichage du nombre d'oeufs */

    const translation = useRef(new Animated.Value(0)).current;

    var nbOeufs_text = ''


    if (nbOeufs[date.date()] === undefined) nbOeufs_text = '?'
    else if (nbOeufs[date.date()]! < 0)      nbOeufs_text = 'Pas de récolte'
    else if (nbOeufs[date.date()]! <= 1)     nbOeufs_text = nbOeufs[date.date()] + ' Oeuf'
    else                            nbOeufs_text = nbOeufs[date.date()] + ' Oeufs'

    function showDays(position: Animated.AnimatedInterpolation<string | number>) {
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    width: Dim.widthScale(100),
                    height: Dim.heightScale(100),
                    bottom: 0,
                    transform: [{translateX: position}],
                }}
            >
                
                <View style={styles.affichageOeufs}>
                    <Text style={[styles.affichageOeufsText, {color: colors.dark}]}>
                        {nbOeufs_text}
                    </Text>
                </View>
                {
                    [...Array(date.daysInMonth()).keys()].map((i: number) => {

                        const day = i + 1

                        const angle = day * 2 * Math.PI / date.daysInMonth();
                        const posX = Dim.widthScale(50) + Math.cos(angle) * Dim.scale(45) - taille_disque / 2;
                        const posY = Dim.heightScale(50) + Math.sin(angle) * Dim.scale(45) - taille_disque / 2;
                        
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
        <KeyboardAvoidingView
            onTouchStart={(event) => {
                setTimeout(() => Keyboard.dismiss(), 200)
            }}
            style={{flex: 1}} contentContainerStyle={styles.wrapper}
            behavior="height"
            keyboardVerticalOffset={Dim.heightScale(7) + insets.bottom}
        >
            

            <Text style={[styles.affichageJour, {color: colors.dark}]}>{date.date() == 1 ? '1er' : date.date()} {date.format('MMMM YYYY')}</Text>

            

            <View style={styles.defaultPosition}>
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
                    <Animated.View style={styles.defaultPosition}>
                        {
                            showDays(translation.interpolate({
                                inputRange: [-Dim.widthScale(100), Dim.widthScale(100)],
                                outputRange: [-Dim.widthScale(100), Dim.widthScale(100)]
                            }))
                        }
                        {
                            showDays(translation.interpolate({
                                inputRange: [-Dim.widthScale(100), 0],
                                outputRange: [0, Dim.widthScale(100)]
                            }))
                        }
                        {
                            showDays(translation.interpolate({
                                inputRange: [0, Dim.widthScale(100)],
                                outputRange: [-Dim.widthScale(100), 0]
                            }))
                        }
                    </Animated.View>

                </PanGestureHandler>
            </View>

            <Bouton
                posx={Dim.widthScale(2)}
                posy={50} // Bottom pos
                width={Dim.widthScale(30)}
                height={Dim.heightScale(10)}
                couleur={colors.dark}
                texte={'Réinitialiser'}
                onPress={() => {
                    reinitialiserOeufs()
                }}
            />

            <Bouton
                posx={Dim.widthScale(2)}
                posy={50 + Dim.heightScale(11)} // bottom pos
                width={Dim.widthScale(96)}
                height={Dim.heightScale(5)}
                couleur={colors.dark}
                texte="Valider"
                onPress={() => {
                    Keyboard.dismiss()
                    ajouterOeufs(nbOeufsInput.current!)
                }}
            />

            <Input
                posx={Dim.widthScale(34)}
                posy={50} // Bottom pos
                width={Dim.widthScale(32)}
                height={Dim.heightScale(10)}
                couleur={colors.dark}
                couleur2={colors.dark}
                onSubmit={(value: number) => {
                    nbOeufsInput.current = value
                }}
            />

            <Bouton
                posx={Dim.widthScale(68)}
                posy={50} // Bottom pos
                width={Dim.widthScale(30)}
                height={Dim.heightScale(10)}
                couleur={colors.dark}
                texte={'Aucun oeuf'}
                onPress={() => {
                    ajouterOeufs(0)
                }}
            />

        </KeyboardAvoidingView>
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
        bottom: Dim.heightScale(40) - Dim.scale(5),
        width: Dim.scale(50),
        left: Dim.scale(25),
        height: Dim.scale(50),
        display: 'flex',
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

export default OeufsComponent
