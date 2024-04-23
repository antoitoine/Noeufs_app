import { PlatformColor, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as Dim from '../Utils/Dimensions';
import * as Couleur from '../Utils/Couleurs';
import { useEffect, useState } from "react";
import { StackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Paramètres

const anneeSelectionnee = 2024;

const bissextile = (anneeSelectionnee % 4 == 0 && anneeSelectionnee % 100 != 0) || (anneeSelectionnee % 400 == 0);

const JOURS_MOIS = [31, bissextile ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const NOMS_MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const moisSelectionne = 1;

const taille_disque = Dim.scale(5.5);
const nb_disques = JOURS_MOIS[moisSelectionne];

const couleur_debut_hex = Couleur.hexToRgb('#FFB9B9');
const couleur_fin_hex = Couleur.hexToRgb('#C8B9FF');

const couleur_debut_hex2 = Couleur.hexToRgb('#FF4C4C');
const couleur_fin_hex2 = Couleur.hexToRgb('#7651FF');

const couleur_debut =  couleur_debut_hex ? [couleur_debut_hex.r, couleur_debut_hex.g, couleur_debut_hex.b] : [0, 0, 0];
const couleur_fin = couleur_fin_hex ? [couleur_fin_hex.r, couleur_fin_hex.g, couleur_fin_hex.b] : [0, 0, 0];

const couleur_debut2 =  couleur_debut_hex2 ? [couleur_debut_hex2.r, couleur_debut_hex2.g, couleur_debut_hex2.b] : [0, 0, 0];
const couleur_fin2 = couleur_fin_hex2 ? [couleur_fin_hex2.r, couleur_fin_hex2.g, couleur_fin_hex2.b] : [0, 0, 0];

const gradient = Couleur.degradeCouleur(couleur_debut, couleur_fin, nb_disques);
const gradient2 = Couleur.degradeCouleur(couleur_debut2, couleur_fin2, nb_disques);

function getRGBColorFromGradient(gradient: Array<Array<number>>, pos: number): string {
    const color = 'rgb(' + gradient[0][pos] + ', ' + gradient[1][pos] + ', ' + gradient[2][pos] + ')';
    return color;
}

type Props = NativeStackScreenProps<StackParamList, 'Oeufs'>;

/**
 * Page principale où se trouve la roue des jours
 */
export default function Oeufs({route, navigation}: Props) {

    const [jourSelectionne, setJourSelectionne] = useState(0);

    useEffect(() => {
        navigation.setOptions({headerStyle: {backgroundColor: getRGBColorFromGradient(gradient2, jourSelectionne)}, headerTitleStyle: {color: 'white', fontWeight: 'bold', fontSize: Dim.scale(6)}, headerTitleAlign: 'center'})
    }, [])
    

    return (
        <View style={styles.wrapper}>

            <Text style={[styles.affichageJour, {color: getRGBColorFromGradient(gradient2, jourSelectionne)}]}>{jourSelectionne+1} {NOMS_MOIS[moisSelectionne]} {'\n'} {anneeSelectionnee}</Text>

            <Text style={[styles.affichageOeufs, {color: getRGBColorFromGradient(gradient2, jourSelectionne)}]}>5 Oeufs</Text>

            {
                [...Array(nb_disques).keys()].map((i: number) => {

                    const angle = i * 2 * Math.PI / nb_disques;
                    const posX = Dim.widthScale(50) + Math.cos(angle) * Dim.scale(45) - taille_disque / 2;
                    const posY = Dim.heightScale(50) + Math.sin(angle) * Dim.scale(45) - taille_disque / 2;  

                    const color = getRGBColorFromGradient(gradient, i);

                    return (
                        <Jour key={i} posx={posX} posy={posY} couleur={color} id={i} onPress={(id: number) => setJourSelectionne(id)} selected={i == jourSelectionne } />
                    )
                })
            }
        </View>
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
                const color = getRGBColorFromGradient(gradient2, id);
                setC(color);
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
        top: Dim.heightScale(3),
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
    }
});
