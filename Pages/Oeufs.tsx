import { PlatformColor, StyleSheet, Text, View, TouchableOpacity, TextInput, Animated } from "react-native";
import * as Dim from '../Utils/Dimensions';
import * as Couleur from '../Utils/Couleurs';
import { useEffect, useRef, useState } from "react";
import { StackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Swipeable  from "react-native-gesture-handler/Swipeable";
import { PanGestureHandler } from "react-native-gesture-handler";

// Paramètres

const NOMS_MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const taille_disque = Dim.scale(5.5);

const couleur_debut_hex = Couleur.hexToRgb('#FFB9B9'); // Claires
const couleur_fin_hex = Couleur.hexToRgb('#C8B9FF');

const couleur_debut_hex2 = Couleur.hexToRgb('#FF4C4C'); // Foncées
const couleur_fin_hex2 = Couleur.hexToRgb('#7651FF');

const couleur_debut =  couleur_debut_hex ? [couleur_debut_hex.r, couleur_debut_hex.g, couleur_debut_hex.b] : [0, 0, 0];
const couleur_fin = couleur_fin_hex ? [couleur_fin_hex.r, couleur_fin_hex.g, couleur_fin_hex.b] : [0, 0, 0];

const couleur_debut2 =  couleur_debut_hex2 ? [couleur_debut_hex2.r, couleur_debut_hex2.g, couleur_debut_hex2.b] : [0, 0, 0];
const couleur_fin2 = couleur_fin_hex2 ? [couleur_fin_hex2.r, couleur_fin_hex2.g, couleur_fin_hex2.b] : [0, 0, 0];

export var idJour = 0
export var nbJours = 30

type Props = NativeStackScreenProps<StackParamList, 'Oeufs'>;

/**
 * Page principale où se trouve la roue des jours
 */
export default function Oeufs({route, navigation}: Props) {

    const [jourSelectionne, setJourSelectionne] = useState(0);
    const [moisSelectionne, setMoisSelectionne] = useState(24 * 12 + 4);

    const moisReel = moisSelectionne % 12
    const anneeSelectionnee = 2000 + Math.floor(moisSelectionne / 12)

    const bissextile = (anneeSelectionnee % 4 == 0 && anneeSelectionnee % 100 != 0) || (anneeSelectionnee % 400 == 0);
    const JOURS_MOIS = [31, bissextile ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    useEffect(() => {
        
    }, [anneeSelectionnee])

    const translation = useRef(new Animated.Value(0)).current;
    const nb_disques = JOURS_MOIS === undefined ? 0 : JOURS_MOIS[moisReel];
    const gradient = Couleur.degradeCouleur(couleur_debut, couleur_fin, nb_disques);
    const gradient2 = Couleur.degradeCouleur(couleur_debut2, couleur_fin2, nb_disques);

    idJour = jourSelectionne
    nbJours = nb_disques

    useEffect(() => {
        if (jourSelectionne != 0) setJourSelectionne(0);
    }, [moisReel]);

    useEffect(() => {
        navigation.setOptions({headerStyle: {backgroundColor: Couleur.getRGBColorFromGradient(gradient2, jourSelectionne)}, headerTitleStyle: {color: 'white', fontWeight: 'bold', fontSize: Dim.scale(6)}, headerTitleAlign: 'center'})
    }, [jourSelectionne])

    

    function showDays(s : boolean, position: Animated.AnimatedInterpolation<string | number>, background: string) {
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    width: Dim.widthScale(100),
                    height: Dim.heightScale(100),
                    bottom: 0,
                    borderWidth: s ? 3 : 0,
                    transform: [{translateX: position}],
                }}
            >
                <Text style={[styles.affichageOeufs, {color: Couleur.getRGBColorFromGradient(gradient2, jourSelectionne)}]}>5 Oeufs</Text>
                {
                    [...Array(nb_disques).keys()].map((i: number) => {
    
                        const angle = i * 2 * Math.PI / nb_disques;
                        const posX = Dim.widthScale(50) + Math.cos(angle) * Dim.scale(45) - taille_disque / 2;
                        const posY = Dim.heightScale(50) + Math.sin(angle) * Dim.scale(45) - taille_disque / 2;  
    
                        const color = Couleur.getRGBColorFromGradient(gradient, i);
    
                        return (
                            <Jour key={i} posx={posX} posy={posY} couleur={color} id={i} onPress={(id: number) => setJourSelectionne(id)} selected={i == jourSelectionne } />
                        )
                        
                    })
                }
            </Animated.View>
        )
    }

    return (
        <View style={styles.wrapper}>

            <Text style={[styles.affichageJour, {color: Couleur.getRGBColorFromGradient(gradient2, jourSelectionne)}]}>{anneeSelectionnee} {'\n'} {jourSelectionne == 0 ? '1er' : jourSelectionne+1} {NOMS_MOIS[moisReel]}</Text>

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

                            if (etat == 2) setMoisSelectionne(moisSelectionne - 1)
                            else if (etat == 1) setMoisSelectionne(moisSelectionne + 1)
                        });
                    }}
                >
                    <Animated.View style={styles.defaultPosition}>
                        {
                            showDays(false, translation.interpolate({
                                inputRange: [-Dim.widthScale(100), Dim.widthScale(100)],
                                outputRange: [-Dim.widthScale(100), Dim.widthScale(100)]
                            }), 'red')
                        }
                        {
                            showDays(false, translation.interpolate({
                                inputRange: [-Dim.widthScale(100), 0],
                                outputRange: [0, Dim.widthScale(100)]
                            }), 'blue')
                        }
                        {
                            showDays(false, translation.interpolate({
                                inputRange: [0, Dim.widthScale(100)],
                                outputRange: [-Dim.widthScale(100), 0]
                            }), 'green')
                        }
                    </Animated.View>

                </PanGestureHandler>
            </View>


            <Bouton
                posx={Dim.widthScale(2)}
                posy={Dim.heightScale(2)}
                width={Dim.widthScale(30)}
                height={Dim.heightScale(10)}
                couleur={Couleur.getRGBColorFromGradient(gradient2, jourSelectionne)}
                texte={'Réinitialiser'}
            />

            <Input
                posx={Dim.widthScale(34)}
                posy={Dim.heightScale(2)}
                width={Dim.widthScale(32)}
                height={Dim.heightScale(10)}
                couleur={Couleur.getRGBColorFromGradient(gradient2, jourSelectionne)}
                couleur2={Couleur.getRGBColorFromGradient(gradient, jourSelectionne)}
            />

            <Bouton
                posx={Dim.widthScale(68)}
                posy={Dim.heightScale(2)}
                width={Dim.widthScale(30)}
                height={Dim.heightScale(10)}
                couleur={Couleur.getRGBColorFromGradient(gradient2, jourSelectionne)}
                texte={'Non récoltés'}
            />

        </View>
    )
}

function Input({posx, posy, width, height, couleur, couleur2}: {posx: number, posy: number, width: number, height: number, couleur: string, couleur2: string}) {
    return (
        <TextInput
            style={[styles.input, styles.inputTexte, {left: posx, bottom: posy, width: width, height: height, borderColor: couleur, color: couleur}]}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={couleur2}
        />
    )
}

function Bouton({posx, posy, width, height, couleur, texte}: {posx: number, posy: number, width: number, height: number, couleur: string, texte: string}) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.bouton, {left: posx, bottom: posy, width: width, height: height, backgroundColor: couleur}]}
        >
            <Text style={[styles.boutonTexte, {width: width, height: height}]}>{texte}</Text>
        </TouchableOpacity>
    )
}

function Jour({posx, posy, style, couleur, id, onPress, selected}: {posx: number, posy: number, style?: Object, couleur: string, id: number, onPress: Function, selected: Boolean}) {

    const [c, setC] = useState(couleur);

    if(selected) {
        posx += taille_disque / 4
        posy += taille_disque / 4
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.disqueJour, {left: posx, bottom: posy}, style, {backgroundColor: c}, selected ? styles.selected : styles.notSelected]}
            onPress={() => {
                onPress(id);
            }}>
            
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    disqueJour: {
        position: 'absolute',
        backgroundColor: 'blue'
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
        fontWeight: 'bold'
    },
    wrapper: {
        width: Dim.widthScale(100),
        height: Dim.heightScale(100),
        display: 'flex',
        flex: 1,
        backgroundColor: 'white'
    },
    affichageOeufs: {
        position: 'absolute',
        bottom: Dim.heightScale(50) - Dim.scale(5),
        width: Dim.widthScale(50),
        left: Dim.widthScale(25),
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(10),
        fontWeight: 'bold'
    },
    bouton: {
        position: 'absolute',
        bottom: Dim.heightScale(2),
        left: Dim.widthScale(70),
        width: Dim.widthScale(20),
        height: Dim.heightScale(10),

        backgroundColor: 'red',
        borderRadius: Dim.scale(2)
    },
    boutonTexte: {
        position: 'relative',
        width: Dim.widthScale(20),
        height: Dim.heightScale(10),
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
    }
});
