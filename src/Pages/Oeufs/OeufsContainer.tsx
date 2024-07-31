

/* IMPORTS */


import { StackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import OeufsComponent from "./OeufsComponent";
import { ThemeContext } from "../../Contexts/ThemeContext";
import { get, ref, set, remove, child, DataSnapshot } from "firebase/database";
import moment from "moment";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { database } from "../../../firebase";
import { DEGRADES } from "../../Constantes/Couleurs";
import { AuthContext } from "../../Contexts/AuthContext";
import * as Couleur from '../../Utils/Couleurs'
import { User } from "firebase/auth";
import 'moment/locale/fr'



/* EXPORTS */



export const MODES_OEUFS = ['poules', 'cailles', 'oies', 'cannes']



/* PAGE PRINCIPALE */



type NavigationProps = NativeStackScreenProps<StackParamList, 'Oeufs'>;

function OeufsContainer({route, navigation}: NavigationProps) {

    /* States */

    const [dateChoisie, setDateChoisie] = useState(moment())
    const [nbOeufsMois, setNbOeufsMois] = useState(Array<number | undefined>(dateChoisie.daysInMonth()+1))
    const [databaseInitialized, setDatabaseInitialized] = useState(false)

    /* Refs */

    const nbOeufsInput = useRef<number | null>(null)

    /* Language */

    useEffect(() => {
        moment.locale('fr')
    }, [])

    /* Theme */

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

    /* Render */

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
                reinitialiserOeufsDb(dateChoisie, authContext.user, MODES_OEUFS[theme.mode])
                ajouterOeufs(nbOeufsMois, setNbOeufsMois, dateChoisie.date(), undefined)
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

    if ((quantite && !isNaN(quantite)) || quantite === undefined) {
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
                if (snapshotData[day] && snapshotData[day][typeOeufs]) {
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
            if (nbOeufs[i] && nbOeufs[i] !== undefined) {
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



export default OeufsContainer
