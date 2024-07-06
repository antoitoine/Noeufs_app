import { StyleSheet, Text, View, TouchableOpacity, TextInput, Animated, KeyboardAvoidingView, Keyboard } from "react-native";
import * as Dim from '../Utils/Dimensions';
import * as Couleur from '../Utils/Couleurs';
import { useContext, useEffect, useRef, useState } from "react";
import { StackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PanGestureHandler } from "react-native-gesture-handler";
import { database } from "../../firebase";
import { get, onValue, ref, remove, set } from "firebase/database";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEGRADES, FAKE_WHITE } from "../Constantes/Couleurs";
import moment from "moment";
import { ThemeContext } from "../Contexts/ThemeContext";
import { AuthContext } from "../Contexts/AuthContext";

// Paramètres

const NOMS_MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const taille_disque = Dim.scale(6);

export const MODES_OEUFS = ['Poules', 'Cailles', 'Oies', 'Cannes']

type Props = NativeStackScreenProps<StackParamList, 'Oeufs'>;

/**
 * Page principale où se trouve la roue des jours
 */
export default function Oeufs({route, navigation}: Props) {

    const [jourSelectionne, setJourSelectionne] = useState(moment().date() - 1);
    const [moisSelectionne, setMoisSelectionne] = useState(24 * 12 + moment().month());

    const moisReel = moisSelectionne % 12
    const anneeSelectionnee = 2000 + Math.floor(moisSelectionne / 12)

    const bissextile = (anneeSelectionnee % 4 == 0 && anneeSelectionnee % 100 != 0) || (anneeSelectionnee % 400 == 0);
    const JOURS_MOIS = [31, bissextile ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    useEffect(() => {
        if (moisReel === moment().month() && anneeSelectionnee === moment().year()) {
            setJourSelectionne(moment().date() - 1)
        } else if (jourSelectionne !== 0) {
            setJourSelectionne(0)
        }
    }, [moisSelectionne]);

    const translation = useRef(new Animated.Value(0)).current;
    const nb_disques = JOURS_MOIS[moisReel]

    /* Preferences */

    const theme = useContext(ThemeContext)!

    useEffect(() => {
        theme.setIdJour(jourSelectionne)
        console.log(theme.colors)
    }, [jourSelectionne])

    useEffect(() => {
        theme.setNbJours(nb_disques)
    }, [moisSelectionne])

    const gradient = Couleur.degradeCouleur(DEGRADES[theme.backgroundColor][0], DEGRADES[theme.backgroundColor][1], nb_disques)
    const gradient2 = Couleur.degradeCouleur(DEGRADES[theme.backgroundColor][2], DEGRADES[theme.backgroundColor][3], nb_disques)

    /* Mode d'oeufs */

    useEffect(() => {
        navigation.setOptions({title: MODES_OEUFS[theme.mode]})
    }, [theme.mode])

    /* Insets */

    const insets = useSafeAreaInsets()
    const bottomPos = insets.bottom

    /* Database & Auth */

    const authContext = useContext(AuthContext)!

    const [nbOeufsParJour, setNbOeufsParJour] = useState<number[] | undefined[]>(Array(nb_disques))
    const nbOeufsParJour_ref = useRef<number[] | undefined[]>(Array(nb_disques))

    const nbOeufsInput = useRef<number | null>(null)

    useEffect(() => { // Connexion à un utilisateur
        if (authContext.user !== null) {
            console.log('User connected : ' + authContext.user.email + ' ' + authContext.user.displayName) // Connexion
            console.log(authContext.user.uid)

            console.log('Synchronisation des données...')
            try {
                AsyncStorage.getItem('oeufsStorage').then(async(value) => {
                    const localData = value !== null ? JSON.parse(value) : {}

                    get(ref(database, 'users/' + authContext.user!.uid + '/oeufs')).then((snapshot) => {

                        const onlineData = snapshot.val() !== null ? snapshot.val() : {}

                        var mergedData = {}

                        const keys = [...new Set([...Object.keys(onlineData), ...Object.keys(localData)])]
                        console.log(keys)

                        for (var i of keys) {
                            mergedData = {
                                ...mergedData,
                                [i]: {
                                    ...onlineData[i],
                                    ...localData[i]
                                }
                            }
                        }

                        set(ref(database, '/users/' + authContext.user!.uid + '/oeufs'), mergedData)
                    }).catch((error) => {
                        console.error('FIREBASE ERROR : ' + error)
                    })
                })
            } catch(e) {
                console.error(e)
            }
        } else {
            console.log('Déconnecté')                                                    // Déconnexion
            try {
                AsyncStorage.removeItem('oeufsStorage')
            } catch(e) {
                console.error(e)
            }
        }
    }, [authContext.user])
    
    useEffect(() => { // Récupération des données du mois
        if (authContext.user !== null) {
            return onValue(ref(database, 'users/' + authContext.user.uid + '/oeufs/' + moisSelectionne), (snapshot) => {
                const data = snapshot.val()
                console.log('Récupération des données')
                if (data) {
                    for (var i = 0; i < nb_disques; ++i) {
                        if (data[i] !== undefined) {
                            nbOeufsParJour_ref.current[i] = data[i]['nbOeufs']
                        } else {
                            nbOeufsParJour_ref.current[i] = undefined
                        }
                        
                    }
                    setNbOeufsParJour(nbOeufsParJour_ref.current.slice())
                } else {
                    console.log('Aucun oeuf dans le mois')
                    nbOeufsParJour_ref.current = new Array(nbOeufsParJour_ref.current.length).fill(undefined)
                    setNbOeufsParJour(nbOeufsParJour_ref.current.slice())
                }
            }, (error) => {
                console.error(error.message)
            })
        } else {
            console.log('Pas d\'utilisateur connecté')
            
            AsyncStorage.getItem('oeufsStorage').then((value) => {
                console.log('getItem')
                const v = value !== null ? JSON.parse(value) : null

                if (v !== null) { // oeufsStorage existe
                    console.log('oeufsStorage existe')
                    const m = moisSelectionne.toString()
                    if (m in v) { // Mois contient des oeufs
                        console.log('Mois contient des oeufs')
                        for (var i = 0; i < nb_disques; ++i) {
                            if (i.toString() in v[m]) {
                                nbOeufsParJour_ref.current[i] = v[m][i.toString()].nbOeufs
                            } else {
                                nbOeufsParJour_ref.current[i] = undefined
                            }
                        }
                    } else { // Mois ne contient pas d'oeufs
                        console.log('Mois ne contient pas d\'oeufs')
                        nbOeufsParJour_ref.current = new Array(nbOeufsParJour_ref.current.length).fill(undefined)
                    }
                } else { // oeufsStorage n'existe pas
                    console.log('oeufs storage n\'existe pas')
                    nbOeufsParJour_ref.current = new Array(nbOeufsParJour_ref.current.length).fill(undefined)
                }

                console.log('Update nbOeufs...')

                setNbOeufsParJour(nbOeufsParJour_ref.current.slice())
                
            }).catch(error => {
                console.error(error)
            })

            
        }
    }, [moisSelectionne, authContext.user])

    console.log('HEADER HEIGHT : ' + theme.headerHeight + ' ' + Dim.heightScale(7))

    /* Async storage */

    const removeDayData = async() => {
        console.log('removeData')

        try {
            AsyncStorage.getItem('oeufsStorage').then(async(res) => {
                var json_value = res !== null ? JSON.parse(res) : null
                const j = jourSelectionne.toString()
                const m = moisSelectionne.toString()

                if (json_value !== null && m in json_value && j in json_value[m]) {
                    delete json_value[m][j]
                }

                try {
                    await AsyncStorage.setItem('oeufsStorage', JSON.stringify(json_value)).then(() => {
                        nbOeufsParJour_ref.current[jourSelectionne] = undefined
                        setNbOeufsParJour(nbOeufsParJour_ref.current.slice())
                    })
                } catch(e) {
                    console.error(e)
                }
            })
        } catch(e) {
            console.error(e)
        }
    }

    const setData = async(value: string) => {
        try {
            AsyncStorage.getItem('oeufsStorage').then(async(res) => {
                var json_value = res !== null ? JSON.parse(res) : null
                const j = jourSelectionne.toString()
                const m = moisSelectionne.toString()

                if (json_value !== null) {
                    if (m in json_value) {
                        if (j in json_value[m]) { // Mois + jour
                            json_value[m][j].nbOeufs = value
                        } else { // Mois
                            json_value[m] = {
                                ...json_value[m],
                                [j]: {"nbOeufs": value}
                            }
                        }
                    } else { // Aucun
                        json_value[m] = {
                            [j]: {"nbOeufs": value}
                        }
                    }
                } else { // Première connexion ? Pas de oeufsStorage
                    console.log('Aucune donnée... Création de oeufsStorage')
                    json_value = {
                        [m]: {
                            [j]: {"nbOeufs": value}
                        }
                    }
                }

                console.log('Set : ' + JSON.stringify(json_value))
                try {
                    await AsyncStorage.setItem('oeufsStorage', JSON.stringify(json_value)).then(() => {
                        console.log('Data set')
                        nbOeufsParJour_ref.current[jourSelectionne] = parseInt(value)
                        setNbOeufsParJour(nbOeufsParJour_ref.current.slice())
                    })
                } catch(e) {
                    console.error(e)
                }
            })
        } catch(e) {
            console.error(e)
        }
    }

    /* Calcul affichage du nombre d'oeufs */

    var nbOeufs_text = ''
    const nbOeufs_jour = nbOeufsParJour[jourSelectionne]

    if (nbOeufs_jour === undefined) nbOeufs_text = '?'
    else if (nbOeufs_jour < 0)      nbOeufs_text = 'Pas de récolte'
    else if (nbOeufs_jour <= 1)     nbOeufs_text = nbOeufs_jour + ' Oeuf'
    else                            nbOeufs_text = nbOeufs_jour + ' Oeufs'

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
                    <Text style={[styles.affichageOeufsText, {color: theme.colors.dark}]}>
                        {nbOeufs_text}
                    </Text>
                </View>
                {
                    [...Array(nb_disques).keys()].map((i: number) => {
    
                        const angle = i * 2 * Math.PI / nb_disques;
                        const posX = Dim.widthScale(50) + Math.cos(angle) * Dim.scale(45) - taille_disque / 2;
                        const posY = Dim.heightScale(50) + Math.sin(angle) * Dim.scale(45) - taille_disque / 2;
                        
                        const color = Couleur.getRGBColorFromGradient(nbOeufsParJour[i] !== undefined ? gradient2 : gradient, i)
    
                        return (
                            <Jour key={i} posx={posX} posy={posY} couleur={color} id={i} onPress={(id: number) => setJourSelectionne(id)} selected={i == jourSelectionne } />
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
            <Text style={[styles.affichageJour, {color: theme.colors.dark}]}>{jourSelectionne == 0 ? '1er' : jourSelectionne+1} {NOMS_MOIS[moisReel]} {anneeSelectionnee}</Text>

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
                posy={bottomPos}
                width={Dim.widthScale(30)}
                height={Dim.heightScale(10)}
                couleur={theme.colors.dark}
                texte={'Réinitialiser'}
                onPress={() => {
                    if (authContext.user) {
                        remove(ref(database, 'users/' + authContext.user.uid + '/oeufs/' + moisSelectionne + '/' + jourSelectionne))
                    }
                    removeDayData()
                }}
            />

            <Bouton
                posx={Dim.widthScale(2)}
                posy={bottomPos + Dim.heightScale(11)}
                width={Dim.widthScale(96)}
                height={Dim.heightScale(5)}
                couleur={theme.colors.dark}
                texte="Valider"
                onPress={() => {
                    Keyboard.dismiss()
                    if (!Number.isNaN(nbOeufsInput.current)) {
                        if (authContext.user) {
                            set(ref(database, 'users/' + authContext.user.uid + '/oeufs/' + moisSelectionne + '/' + jourSelectionne), {
                                nbOeufs: nbOeufsInput.current
                            }).catch(error => {
                                console.error('FIREBASE ERROR : set nb oeufs - ' + error)
                            })
                        }
                        setData(nbOeufsInput.current!.toString())
                    } else {
                        console.log('Nombre entré incorrect')
                    }
                    
                }}
            />

            <Input
                posx={Dim.widthScale(34)}
                posy={bottomPos}
                width={Dim.widthScale(32)}
                height={Dim.heightScale(10)}
                couleur={theme.colors.dark}
                couleur2={theme.colors.dark}
                onSubmit={(value: number) => {
                    nbOeufsInput.current = value
                }}
            />

            <Bouton
                posx={Dim.widthScale(68)}
                posy={bottomPos}
                width={Dim.widthScale(30)}
                height={Dim.heightScale(10)}
                couleur={theme.colors.dark}
                texte={'Non récoltés'}
                onPress={() => {
                    if (authContext.user) {
                        set(ref(database, 'users/' + authContext.user.uid + '/oeufs/' + moisSelectionne + '/' + jourSelectionne), {
                            nbOeufs: -1
                        })
                    }
                    setData("-1")
                }}
            />

        </KeyboardAvoidingView>
    )
}

function Input({posx, posy, width, height, couleur, couleur2, onSubmit}: {posx: number, posy: number, width: number, height: number, couleur: string, couleur2: string, onSubmit: Function}) {
    
    const text = useRef('')
    
    return (
        <TextInput
            style={[styles.input, styles.inputTexte, {left: posx, bottom: posy, width: width, height: height, borderColor: couleur, color: couleur}]}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={couleur2}
            onBlur={() => {
                onSubmit(parseInt(text.current))
                
            }}
            onChangeText={(t) => {
                text.current = t
                onSubmit(parseInt(text.current))
            }}
            onStartShouldSetResponder={(event) => true}
            onTouchStart={(event) => event.stopPropagation()}
            maxLength={3}
        />
    )
}

function Bouton({posx, posy, width, height, couleur, texte, onPress}: {posx: number, posy: number, width: number, height: number, couleur: string, texte: string, onPress: Function}) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.bouton, {left: posx, width: width, height: height, backgroundColor: couleur, bottom: posy}]}
            onPress={() => {
                onPress()
            }}
        >
            <Text style={[styles.boutonTexte]}>{texte}</Text>
        </TouchableOpacity>
    )
}

function Jour({posx, posy, style, couleur, id, onPress, selected}: {posx: number, posy: number, style?: Object, couleur: string, id: number, onPress: Function, selected: Boolean}) {

    if(selected) {
        posx += taille_disque / 4
        posy += taille_disque / 4
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.disqueJour, {left: posx, bottom: posy}, style, {backgroundColor: couleur}, selected ? styles.selected : styles.notSelected]}
            onPress={() => {
                onPress(id);
            }}>
            
        </TouchableOpacity>
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
    }
});
