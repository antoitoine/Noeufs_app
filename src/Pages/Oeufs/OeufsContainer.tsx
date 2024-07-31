import { StackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import OeufsComponent from "./OeufsComponent";
import { ThemeContext } from "../../Contexts/ThemeContext";
import * as Dim from '../../Utils/Dimensions'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get, ref, set, onValue, remove } from "firebase/database";
import moment, { Moment } from "moment";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { database } from "../../../firebase";
import { DEGRADES } from "../../Constantes/Couleurs";
import { AuthContext } from "../../Contexts/AuthContext";
import { MODES_OEUFS } from "../Oeufs";
import * as Couleur from '../../Utils/Couleurs'
import 'moment/locale/fr'
import { User } from "firebase/auth";

export const taille_disque = Dim.scale(6);

type NavigationProps = NativeStackScreenProps<StackParamList, 'Oeufs'>;

function OeufsContainer({route, navigation}: NavigationProps) {

    const [dateChoisie, setDateChoisie] = useState(moment())
    const [nbOeufsMois, setNbOeufsMois] = useState(Array<number | undefined>(dateChoisie.daysInMonth()+1))
    const [databaseInitialized, setDatabaseInitialized] = useState(false)

    const nbOeufsInput = useRef<number | null>(null)

    const theme = useContext(ThemeContext)!

    useEffect(() => {
        theme.setIdJour(dateChoisie.date()-1)
        console.log(theme.colors)
    }, [dateChoisie.date()])

    useEffect(() => {
        theme.setNbJours(dateChoisie.daysInMonth())
    }, [dateChoisie.month()])

    const lightGradient = Couleur.degradeCouleur(DEGRADES[theme.backgroundColor][0], DEGRADES[theme.backgroundColor][1], dateChoisie.daysInMonth())
    const darkGradient = Couleur.degradeCouleur(DEGRADES[theme.backgroundColor][2], DEGRADES[theme.backgroundColor][3], dateChoisie.daysInMonth())

    /* Mode d'oeufs */

    useEffect(() => {
        navigation.setOptions({title: MODES_OEUFS[theme.mode]})
    }, [theme.mode])

    /* Insets */

    const insets = useSafeAreaInsets()

    /* Database & Auth */

    const authContext = useContext(AuthContext)!

    useEffect(() => {
        lireOeufsDb(dateChoisie, setNbOeufsMois, authContext.user, setDatabaseInitialized)
    }, [authContext.user])

    useEffect(() => {
        updateOeufsDb(authContext.user, dateChoisie, nbOeufsMois, databaseInitialized)
    }, [nbOeufsMois.entries()])

    return (
        <OeufsComponent
            route={route}
            navigation={navigation}
            colors={{dark: theme.colors.dark, light: theme.colors.light, darkGradient: darkGradient, lightGradient: lightGradient}}
            date={dateChoisie}
            insets={insets}
            nbOeufsInput={nbOeufsInput}
            user={authContext.user}
            ajouterOeufs={(quantite) => {
                ajouterOeufs(nbOeufsMois, setNbOeufsMois, dateChoisie.date(), quantite)
            }}
            reinitialiserOeufs={() => {
                if (reinitialiserOeufsDb(dateChoisie, authContext.user)) {
                    ajouterOeufs(nbOeufsMois, setNbOeufsMois, dateChoisie.date(), undefined)
                }
            }}
            nbOeufs={nbOeufsMois} // ATTENTION
            events={{changeDay: (id: number) => {

                changerJourChoisi(dateChoisie, setDateChoisie, id)

            }, changeMonth: (decalage: number) => {

                changerMoisChoisi(dateChoisie, setDateChoisie, decalage)

            }}}
        />
    )
}

/**
 * Lis le nombre d'oeufs récoltés chaque jour du mois sélectionné, puis enregistre le résultat à l'aide de la fonction setNbOeufs.
 * 
 * @param date Date à partir de laquelle le mois est extrait
 * @param setFunction Fonction de mise à jour d'état (useState)
 * @param user Utilisateur qui réalise la requête
 * 
 * @returns void
 */
const lireOeufsDb = (date: moment.Moment, setNbOeufs: React.Dispatch<React.SetStateAction<Array<number | undefined>>>, user: User | null, setDbInit: Dispatch<SetStateAction<boolean>>) => {

    console.log('[DEBUG] Fetching nbOeufs from db...')

    if (!user) {
        console.log('[DEBUG] ...No user found')
        return
    }
    
    const nbOeufsMois_db = Array<number>(date.daysInMonth()+1)

    get(ref(database, 'users/' + user.uid + '/oeufs/' + date.format('YYYY-MM'))).then((snapshot) => {
        
        if (snapshot) {
            const snapshotData = snapshot.val()

            for (var day = 1; day <= date.daysInMonth(); ++day) {
                nbOeufsMois_db[day] = snapshotData[day] ? snapshotData[day].nbOeufs : undefined
            }
        }

        setNbOeufs(nbOeufsMois_db.slice())
        setDbInit(true)
        console.log('[DEBUG] ...Data feteched succesfully !')

    }).catch((error) => {
        console.log('[ERROR]' + error)
    })
}

/**
 * 
 * @param user Enregistre dans la db les données des oeufs associées à un utilisateur (uniquement lorsqu'un est connecté),
 * pour les enregistrer dans l'état courant.
 * @param date Date sélectionnée, pour en extraire le mois
 * @param nbOeufs Nombre d'oeufs pour chaque jour du mois sélectionné
 * @returns void
 */
const updateOeufsDb = (user: User | null, date: moment.Moment, nbOeufs: Array<number | undefined>, dbInit: boolean) => {
    if (!user || !dbInit) {
        return
    }

    var newData = {}

    for (var i = 1; i < nbOeufs.length; ++i) {
        if (nbOeufs[i]) {
            newData = {...newData, [i]: {'nbOeufs': nbOeufs[i]}}
        }
    }

    console.log(newData)

    set(ref(database, 'users/' + user.uid + '/oeufs/' + date.format('YYYY-MM')), newData)
}

/**
 * Change le jour du mois actuel
 * 
 * @param date Date choisie actuellement, dont le mois sera extrait
 * @param setDate Fonction Dispatch permettant de mettre à jour la nouvelle date
 * @param nouveauJour Jour sélectionné, qui viendra remplacer le précédent
 */
const changerJourChoisi = (date: moment.Moment, setDate: React.Dispatch<SetStateAction<moment.Moment>>, nouveauJour: number) => {
    setDate(date.date(nouveauJour).clone())
}

/**
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

/**
 * Modifie / ajoute un nombre d'oeufs pour le jour précisé.
 * ATTTENTION : ne modifie que l'état interne, appeler updateOeufsDb ensuite pour modifier en ligne.
 * @param oeufsMois Nombre d'oeufs chaque jour du mois actuel
 * @param setNbOeufs Fonction Dispatch pour mettre à jour l'état du nombre d'oeufs par jour
 * @param jour Jour du mois sélectionné où modifier le nombre d'oeufs
 * @param quantite Valeur à assigner (-1 : pas de récolte, undefined : pas renseigné)
 */
const ajouterOeufs = (oeufsMois: Array<number | undefined>, setNbOeufs: React.Dispatch<SetStateAction<Array<number | undefined>>>, jour: number, quantite: number | undefined) => {
    
    if ((quantite && !isNaN(quantite)) || quantite === undefined) {
        var newOeufs = oeufsMois.slice()
        newOeufs[jour] = quantite
        setNbOeufs(newOeufs.slice())
    } else {
        console.error('[ERREUR] Nombre d\'oeufs entré incorrect')
    }
}

/**
 * Supprime l'entrée précisée dans la base de données.
 * ATTENTION : Ne modifie pas l'état interne, appeler ajouterOeufs() avec quantite=undefined pour cela.
 * @param date Date sélectionnée, pour en extraire le mois
 * @param user Utlisateur connecté (ou non)
 * @returns true si la réinitialisation s'est bien effectuée
 */
const reinitialiserOeufsDb = (date: moment.Moment, user: User | null) => {
    if (!user) {
        return false
    }

    remove(ref(database, 'users/' + user.uid + '/oeufs/' + date.format('YYYY-MM/') + date.date())).then(() => {
        console.debug('Réinitialisation du nombre d\'oeufs réussie')
        return true
    }).catch((error) => {
        console.error(error)
        return false
    })
}

export default OeufsContainer
