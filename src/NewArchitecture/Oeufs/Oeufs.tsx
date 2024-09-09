import { Animated, Keyboard, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import * as Dim from '../../Utils/Dimensions';
import { StackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PanGestureHandler } from "react-native-gesture-handler";
import { DEGRADES, FAKE_WHITE } from "../../Constantes/Couleurs";
import moment from "moment";
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { EdgeInsets, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as Couleur from '../../Utils/Couleurs'
import { User } from "firebase/auth";
import { ThemeContext } from "../../Contexts/ThemeContext";
import { AuthContext } from "../../Contexts/AuthContext";
import { database } from "../../../firebase";
import { get, ref, remove, set } from "firebase/database";
import Bouton from "./Bouton";
import Input from "./Input";
import Jour from "./Jour";

export const taille_disque = Dim.scale(5.5);
export const MODES_OEUFS = ['poules', 'cailles', 'oies', 'cannes']

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

function OeufsComponent({route, navigation}: NavigationProps) {

    const [oeufsHeight, setOeufsHeight] = useState(0)

    /* States */

    const [dateChoisie, setDateChoisie] = useState(moment())
    const [nbOeufsMois, setNbOeufsMois] = useState(Array<number | undefined>(dateChoisie.daysInMonth()+1))
    const [databaseInitialized, setDatabaseInitialized] = useState(false)

    /* Refs */

    const nbOeufsInput = useRef<number | null>(null)

    /* Language */

    useEffect(() => {
        moment.locale(['fr', 'en'])
    }, [])

    /* Theme */

    const theme = useContext(ThemeContext)!

    useEffect(() => {
        theme.setIdJour(dateChoisie.date()-1)
    }, [dateChoisie.date()])

    useEffect(() => {
        theme.setNbJours(dateChoisie.daysInMonth())
    }, [dateChoisie.month()])

    const lightGradient = Couleur.degradeCouleur(DEGRADES[theme.backgroundColor][0], DEGRADES[theme.backgroundColor][1], dateChoisie.daysInMonth())
    const darkGradient = Couleur.degradeCouleur(DEGRADES[theme.backgroundColor][2], DEGRADES[theme.backgroundColor][3], dateChoisie.daysInMonth())

    /* Header */

    useEffect(() => {
        navigation.setOptions({title: MODES_OEUFS[theme.mode]})
    }, [theme.mode])

    const insets = useSafeAreaInsets()

    /* Database & Auth */

    const authContext = useContext(AuthContext)!

    useEffect(() => {
        lireOeufsDb(dateChoisie, setNbOeufsMois, authContext.user, setDatabaseInitialized, MODES_OEUFS[theme.mode])
    }, [authContext.user, dateChoisie.month(), theme.mode])

    useEffect(() => {
        updateOeufsDb(authContext.user, dateChoisie, nbOeufsMois, databaseInitialized, MODES_OEUFS[theme.mode])
    }, [nbOeufsMois])

    /* Calcul affichage du nombre d'oeufs */

    const translation = useRef(new Animated.Value(0)).current;

    var nbOeufs_text = ''
    const circleWidth = Math.min(Dim.widthScale(45), Dim.heightScale(33.33))


    if (nbOeufsMois[dateChoisie.date()] === undefined) nbOeufs_text = '?'
    else if (nbOeufsMois[dateChoisie.date()]! < 0)     nbOeufs_text = 'Pas de récolte'
    else if (nbOeufsMois[dateChoisie.date()]! <= 1)    nbOeufs_text = nbOeufsMois[dateChoisie.date()] + ' Oeuf'
    else                                               nbOeufs_text = nbOeufsMois[dateChoisie.date()] + ' Oeufs'

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
                    <Text style={[styles.affichageOeufsText, {color: theme.colors.dark}]}>
                        {nbOeufs_text}
                    </Text>
                </View>
                {
                    [...Array(dateChoisie.daysInMonth()).keys()].map((i: number) => {

                        const day = i + 1

                        const angle = day * 2 * Math.PI / dateChoisie.daysInMonth();
                        const posX = Dim.widthScale(50) + Math.cos(angle) * circleWidth - taille_disque / 2;
                        const posY = oeufsHeight / 2 + Math.sin(angle) * circleWidth - taille_disque / 2;
                        
                        const color = Couleur.getRGBColorFromGradient(nbOeufsMois[day] !== undefined ? darkGradient : lightGradient, day-1)
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
                <Text style={[styles2.dateTexte, {color: theme.colors.dark}]}>{dateChoisie.date() == 1 ? '1er' : dateChoisie.date()} {dateChoisie.format('MMMM YYYY')}</Text>
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

                            if (etat == 2)      changerMoisChoisi(dateChoisie, setDateChoisie, -1)
                            else if (etat == 1) changerMoisChoisi(dateChoisie, setDateChoisie, +1)
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
                        colors={{dark: theme.colors.dark, light: theme.colors.light}}
                        titre={'Valider'}
                        onPress={() => {
                            Keyboard.dismiss()
                            ajouterOeufs(nbOeufsMois, setNbOeufsMois, dateChoisie.date(), nbOeufsInput.current!)
                        }}
                    />
                </View>
                <View style={[styles2.boutons_lig, styles2.boutons_lig2]}>
                    
                    <Bouton
                        colors={{dark: theme.colors.dark, light: theme.colors.light}}
                        titre={'Réinitialiser'}
                        onPress={() => {
                            reinitialiserOeufsDb(dateChoisie, authContext.user, MODES_OEUFS[theme.mode])
                            ajouterOeufs(nbOeufsMois, setNbOeufsMois, dateChoisie.date(), undefined)
                        }}
                    />

                    <Input
                        colors={{dark: theme.colors.dark, light: theme.colors.light}}
                        onSubmit={(value: number) => {
                            nbOeufsInput.current = value
                        }}
                    />

                    <Bouton
                        colors={{dark: theme.colors.dark, light: theme.colors.light}}
                        titre={'Aucun oeuf'}
                        onPress={() => {
                            ajouterOeufs(nbOeufsMois, setNbOeufsMois, dateChoisie.date(), 0)
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

/* STOCKAGE INTERNE */



/** Ajouter Oeufs **
 * 
 * Modifie / ajoute un nombre d'oeufs pour le jour précisé.
 * ATTTENTION : ne modifie que l'état interne, appeler updateOeufsDb ensuite pour modifier en ligne.
 * @param oeufsMois Nombre d'oeufs chaque jour du mois actuel
 * @param setNbOeufs Fonction Dispatch pour mettre à jour l'état du nombre d'oeufs par jour
 * @param jour Jour du mois sélectionné où modifier le nombre d'oeufs
 * @param quantite Valeur à assigner (-1 : pas de récolte, undefined : pas renseigné)
 */
const ajouterOeufs = (oeufsMois: Array<number | undefined>, setNbOeufs: React.Dispatch<SetStateAction<Array<number | undefined>>>, jour: number, quantite: number | undefined) => {
    
    console.log('Tentative d\'ajout du nombre d\'oeufs : ' + quantite)

    if ((quantite && !isNaN(quantite)) || quantite === undefined || quantite === 0) {
        var newOeufs = oeufsMois.slice()
        newOeufs[jour] = quantite
        setNbOeufs(newOeufs.slice())
        console.log('Ajout d\'oeufs réussi')
    } else {
        console.error('Nombre d\'oeufs entré incorrect')
    }
}



/* BASE DE DONNÉES */



/** Lire dans la db **
 * 
 * Lis le nombre d'oeufs récoltés chaque jour du mois sélectionné, puis enregistre le résultat à l'aide de la fonction setNbOeufs.
 * 
 * @param date Date à partir de laquelle le mois est extrait
 * @param setFunction Fonction de mise à jour d'état (useState)
 * @param user Utilisateur qui réalise la requête
 * 
 * @returns void
 */
const lireOeufsDb = (date: moment.Moment, setNbOeufs: React.Dispatch<React.SetStateAction<Array<number | undefined>>>, user: User | null, setDbInit: Dispatch<SetStateAction<boolean>>, type: string) => {

    console.log('Fetching nbOeufs from db...')

    if (!user) {
        console.log('No user found. Can\'t fetch from db.')
        return
    }
    
    const nbOeufsMois_db = Array<number | undefined>(date.daysInMonth()+1)
    const typeOeufs = 'oeufs_' + type

    get(ref(database, 'users/' + user.uid + '/oeufs/' + date.format('YYYY-MM'))).then((snapshot) => {
        
        console.debug(snapshot)

        if (snapshot.exists()) {
            const snapshotData = snapshot.val()

            for (var day = 1; day <= date.daysInMonth(); ++day) {
                if (snapshotData[day] && (snapshotData[day][typeOeufs] || snapshotData[day][typeOeufs] === 0)) {
                    nbOeufsMois_db[day] = snapshotData[day][typeOeufs]
                } else {
                    nbOeufsMois_db[day] = undefined
                }
            }
        } else {
            nbOeufsMois_db.fill(undefined)
        }

        setNbOeufs(nbOeufsMois_db.slice())
        setDbInit(true)
        console.log('Data feteched succesfully !')

    }).catch((error) => {
        console.log('Can\'t fetch data')
        console.error(error)
    })
}

/** Enregistrer dans la db **
 * 
 * @param user Enregistre dans la db les données des oeufs associées à un utilisateur (uniquement lorsqu'un est connecté),
 * pour les enregistrer dans l'état courant.
 * @param date Date sélectionnée, pour en extraire le mois
 * @param nbOeufs Nombre d'oeufs pour chaque jour du mois sélectionné
 * @returns void
 */
const updateOeufsDb = async(user: User | null, date: moment.Moment, nbOeufs: Array<number | undefined>, dbInit: boolean, type: string) => {

    console.log('Tries to save current eggs to database...')

    if (!user || !dbInit) {
        console.log('No user connected or database not ready yet. Can\'t save to database')
        return
    }

    const typeOeufs = 'oeufs_' + type

    try {
        const oldDataSnapshot = await get(ref(database, 'users/' + user.uid + '/oeufs/' + date.format('YYYY-MM')))

        if (oldDataSnapshot.exists()) {

            console.log('Réussite de la lecture des données depuis la db')
            var oldData: {[key: string]: {[key: string]: number}} = oldDataSnapshot.val()

        } else {
            console.log('Aucune donnée existante pour le mois spécifié : ' + date.format('YYYY-MM'))
            oldData = {}
        }

        for (var i = 1; i < nbOeufs.length; ++i) {
            if (nbOeufs[i] && (nbOeufs[i] !== undefined) || nbOeufs[i] === 0) {
                oldData[i] = {...oldData[i], [typeOeufs]: nbOeufs[i]!}
            }
        }

        try {
            await set(ref(database, 'users/' + user.uid + '/oeufs/' + date.format('YYYY-MM')), oldData)
            console.log('Les données ont bien été enregistrées dans la base de données')

        } catch (error) {
            console.error('Erreur lors de l\'écriture des données')
            console.error(error)
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des données')
        console.error(error)
    }
}

/** Supprimer dans la db **
 * 
 * Supprime l'entrée précisée dans la base de données.
 * ATTENTION : Ne modifie pas l'état interne, appeler ajouterOeufs() avec quantite=undefined pour cela.
 * @param date Date sélectionnée, pour en extraire le mois
 * @param user Utlisateur connecté (ou non)
 * @returns void
 */
const reinitialiserOeufsDb = (date: moment.Moment, user: User | null, type: string) => {

    console.log('Tries to delete data from database...')

    if (!user) {
        console.log('No user connected, delete failed.')
        return
    }

    const typeOeufs = 'oeufs_' + type

    remove(ref(database, 'users/' + user.uid + '/oeufs/' + date.format('YYYY-MM/') + date.date() + '/' + typeOeufs)).then(() => {
        console.debug('Réinitialisation du nombre d\'oeufs réussie')
    }).catch((error) => {
        console.log('Impossible de réinitialiser le nombre d\'oeufs.')
        console.error(error)
    })
}



/* DATE ET NAVIGATION */



/** Changer le jour sélectionné **
 * 
 * Change le jour du mois actuel
 * 
 * @param date Date choisie actuellement, dont le mois sera extrait
 * @param setDate Fonction Dispatch permettant de mettre à jour la nouvelle date
 * @param nouveauJour Jour sélectionné, qui viendra remplacer le précédent
 */
const changerJourChoisi = (date: moment.Moment, setDate: React.Dispatch<SetStateAction<moment.Moment>>, nouveauJour: number) => {
    setDate(date.date(nouveauJour).clone())
}

/** Changer le mois sélectionné **
 * 
 * Ajout ou retire un certain nombre de mois au mois sélectionné
 * 
 * @param date Date choisie actuellement, dont le mois sera extrait
 * @param setDate Fonction Dispatch pour mettre à jour l'état de la nouvelle date
 * @param decalage Ajout / Retrait d'un certain nombre de mois au mois choisi actuellement
 */
const changerMoisChoisi = (date: moment.Moment, setDate: React.Dispatch<SetStateAction<moment.Moment>>, decalage: number) => {
    var newDate = undefined

    if (decalage < 0) newDate = date.subtract(1, 'months')
    else              newDate = date.add(1, 'months')

    if (newDate.month() === moment().month() && newDate.year() === newDate.year()) {
        newDate = moment()
    }

    setDate(newDate.clone())
}


export default OeufsComponent
