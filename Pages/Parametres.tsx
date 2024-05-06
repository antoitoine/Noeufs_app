import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Dim from '../Utils/Dimensions';
import { StackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from '../firebase';
import { TextInput } from "react-native-gesture-handler";
import * as Couleur from '../Utils/Couleurs'
import { idJour, nbJours } from "./Oeufs";

const couleur_debut_hex = Couleur.hexToRgb('#FFB9B9'); // Claires
const couleur_fin_hex = Couleur.hexToRgb('#C8B9FF');
const couleur_debut =  couleur_debut_hex ? [couleur_debut_hex.r, couleur_debut_hex.g, couleur_debut_hex.b] : [0, 0, 0];
const couleur_fin = couleur_fin_hex ? [couleur_fin_hex.r, couleur_fin_hex.g, couleur_fin_hex.b] : [0, 0, 0];
const gradient = Couleur.degradeCouleur(couleur_debut, couleur_fin, nbJours)

type Props = NativeStackScreenProps<StackParamList, 'Parametres'>;

export default function Parametres({route, navigation}: Props) {

    const [user, setUser] = useState<User>()

    const [warnMessages, setWarnMessages] = useState({email: '', password: ''})
    const [inscription, setInscription] = useState(false)

    const email = useRef("");
    const password = useRef("");
    const name = useRef("");

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User connected : ' + user.email + ' ' + user.displayName)
                setUser(user)
            } else {
                setUser(undefined)
            }
        })
    }, [])
    

    function createNewUser() {
        console.log('Création d\'un nouveau compte...')
        createUserWithEmailAndPassword(auth, email.current, password.current).then((userCredential) => {
            const u = userCredential.user;
            console.log('User created : ' + u.email);
            updateProfile(u, {
                displayName: name.current
            }).then(() => {
                console.log('Name updated !')
                setUser(u)
            }).catch((error) => {
                console.error('ERREUR : ' + error.code + ' ' + error.message)
            })
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
    
            console.log('INSCRIPTION : ' + errorCode + ' ' + errorMessage);
        })
    }

    function connectUser() {
        signInWithEmailAndPassword(auth, email.current, password.current).then((userCredential) => {
            const u = userCredential.user;
            console.log('User signed in : ' + u.email);
            setUser(u)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log('CONNEXION FAILED : ' + errorCode + ' ' + errorMessage);

            switch(errorCode) {
                case 'auth/user-not-found':
                    alertCreateNewAccount()
                    return
                case 'auth/wrong-password':
                    console.log('WRONG PASSWORD')
                    setWarnMessages({email: '', password: 'Mot de passe incorrect'})
                    return
                case 'auth/invalid-email':
                    console.log('INVALID EMAIL')
                    setWarnMessages({email: 'Adresse email invalide', password: ''})
                    return
                case 'auth/too-many-requests':
                    Alert.alert('Trop de tentatives\nRéessayez plus tard.')
                    return
                default:
                    return
            }
        })
    }

    /* Boite de dialogue : créer un nouveau compte */

    function alertCreateNewAccount() {
        Alert.alert(
            '',
            'Aucun compte n\'est associé à cet email, souhaitez-vous en créer un ?',
            [
                {
                    text: 'Non',
                    onPress: () => {

                    },
                    style: 'cancel'
                },
                {
                    text: 'Oui',
                    onPress: () => {
                        setInscription(true)
                    },
                    style: 'default'
                }
            ],
            {
                cancelable: true,
                onDismiss: () => {
                    
                }
            }
        )
    }

    if (!user) { // Utilisateur déconnecté
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity style={styles.invisible} activeOpacity={1} onPress={() => {
                    navigation.goBack();
                }}>

                </TouchableOpacity>

                <View style={[styles.page, {backgroundColor: Couleur.getRGBColorFromGradient(gradient, nbJours - idJour - 1)}]}>
                    <TouchableOpacity style={styles.retourWrapper} activeOpacity={0.8} onPress={() => {
                        navigation.goBack();
                    }}>
                        <Text style={styles.retourTexte}>Retour</Text>
                    </TouchableOpacity>

                    { /* Page de connexion */}

                    <View style={styles.connexion}>

                        <Text style={styles.connexionTitle}>Connexion</Text>

                        <InputField
                            title="Adresse email"
                            onSubmit={(text: string) => {
                                email.current = text
                            }}
                            footer={warnMessages.email}
                            footerColor='red'
                        />

                        <InputField
                            title="Pseudo"
                            onSubmit={(text: string) => {
                                name.current = text
                            }}
                            visible={inscription}
                        />

                        <InputField
                            title="Mot de passe"
                            password={true}
                            onSubmit={(text: string) => {
                                password.current = text
                            }}
                            footer={warnMessages.password}
                            footerColor='red'
                        />

                        {/* Connexion à un utilisateur existant */}

                        <TouchableOpacity
                            style={styles.connexionButton}
                            activeOpacity={0.8}
                            onPress={() => {
                                console.log('Adresse mail : ' + email.current)
                                console.log('Mot de passe : ' + password.current)

                                if (inscription) createNewUser()
                                else connectUser()
                            }}
                        >
                            <Text style={styles.connexionButtonText}>{inscription ? 'S\'inscrire' : 'Se connecter'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    return ( // Utilisateur connecté
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.invisible} activeOpacity={1} onPress={() => {
                navigation.goBack();
            }}>

            </TouchableOpacity>
            <View style={[styles.page, {backgroundColor: Couleur.getRGBColorFromGradient(gradient, nbJours - idJour - 1)}]}>
                <TouchableOpacity style={styles.retourWrapper} activeOpacity={0.8} onPress={() => {
                    navigation.goBack();
                }}>
                    <Text style={styles.retourTexte}>Retour</Text>
                </TouchableOpacity>

                <Text style={styles.displayName}>{user.displayName}</Text>
                <TouchableOpacity
                    style={deconnexionStyle.button}
                    onPress={() => {
                        console.log('Déconnexion...')
                        signOut(auth).then(() => {
                            console.log('Utilisateur déconnecté.')
                        }).catch((error) => {
                            console.error('ERREUR : ' + error)
                        })
                    }}
                >
                    <Text style={deconnexionStyle.text}>Se déconnecter</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

function InputField({title, password=false, onSubmit, footer='', footerColor='black', visible=true}: {title: string, password?: Boolean, onSubmit: Function, footer?: string, footerColor?: string, visible?: Boolean}) {

    const text = useRef("")

    if (!visible)
        return null

    return (
        <View>
            <View style={styles.fieldWrapper}>
                <Text style={styles.textField}>
                    {title}
                </Text>
                <TextInput
                    style={styles.inputField}
                    secureTextEntry={password ? true : false}
                    onChangeText={(t: string) => {
                        text.current = t
                    }}
                    onBlur={() => {
                        onSubmit(text.current);
                    }}
                />
            </View>
            <Text style={[inputStyle.footer, {color: footerColor}]}>{footer}</Text>
        </View>
    )
}

const deconnexionStyle = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: Dim.heightScale(5),
        width: Dim.widthScale(40),
        height: Dim.heightScale(5),
        left: Dim.widthScale(30),
        borderRadius: Dim.scale(1)
    },
    text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(4),

        color: 'white',
        fontWeight: 'bold',
        textShadowRadius: 5
    }
})

const inputStyle = StyleSheet.create({
    footer: {
        textAlign: 'left',
        fontSize: Dim.scale(3),
    }
})

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    page: {
        position: 'relative',
        top: Dim.heightScale(5),
        left: 0,
        height: Dim.heightScale(95),
        width: Dim.widthScale(100),
        backgroundColor: "#C8B9FC",
        borderTopRightRadius: Dim.scale(5),
        borderTopLeftRadius: Dim.scale(5),
    },
    connexion: {
        position: 'absolute',
        top: Dim.heightScale(5),
        left: 0,
        width: Dim.widthScale(100),
        height: Dim.heightScale(50),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    invisible: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: Dim.heightScale(5),
        width: Dim.widthScale(100),
    },
    retourTexte: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        textAlign: 'left',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: Dim.scale(4),
        textShadowRadius: 5
    },
    retourWrapper: {
        position: 'relative',
        top: Dim.scale(2),
        left: Dim.scale(5),
    },

    test: {
        backgroundColor: 'red'
    },
    inputField: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(4),
        color: 'black',
        width: Dim.widthScale(80),
    },
    connexionTitle: {
        fontSize: Dim.scale(6),
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        textShadowRadius: 10
    },
    fieldWrapper: {
        backgroundColor: 'white',
        borderRadius: Dim.scale(2),
        padding: Dim.scale(1)
    },
    textField: {
        textAlign: 'center',
        color: 'grey',
        fontSize: Dim.scale(3),
    },

    connexionButton: {
        borderRadius: Dim.scale(2),
        width: Dim.widthScale(50),
        height: Dim.heightScale(5),
        backgroundColor: 'white'
    },
    connexionButtonText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(5),
        color: 'black',
    },
    
    displayName: {
        textAlign: 'center',
        textAlignVertical: 'center',
        width: Dim.widthScale(100),
        position: 'absolute',
        top: Dim.heightScale(5),
        color: 'white',
        fontSize: Dim.scale(6),
        textShadowRadius: 10,
        fontWeight: 'bold'
    }
});

