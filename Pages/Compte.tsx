import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthContext, StackParamList, ThemeContext } from "../App";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useContext, useRef, useState } from "react";
import { DEGRADES, FAKE_WHITE } from "../Constantes/Couleurs";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase";
import * as Dim from '../Utils/Dimensions'
import * as Couleur from '../Utils/Couleurs'


type Props = NativeStackScreenProps<StackParamList, 'Compte'>

export default function Compte({route, navigation}: Props) {

    const [warnMessages, setWarnMessages] = useState({email: '', password: ''})
    const [inscription, setInscription] = useState(false)

    const email = useRef("");
    const password = useRef("");
    const name = useRef("");

    const authContext = useContext(AuthContext)!
    const [user, setUser] = authContext.user

    const insets = useSafeAreaInsets()

    /* Theme */

    const themeContext = useContext(ThemeContext)!
    const [backgroundColor, ] = themeContext.backgroundColor
    const [idJour, ] = themeContext.idJour
    const [nbJours, ] = themeContext.nbJours

    const gradient = Couleur.degradeCouleur(DEGRADES[backgroundColor][2], DEGRADES[backgroundColor][3], nbJours)
    const interactiveColor = Couleur.getRGBColorFromGradient(gradient, idJour)

    /* Account functions */

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
                case 'auth/missing-password': {
                    setWarnMessages({email: '', password: 'Veuillez entrer un mot de passe'})
                }
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

    /* Render */

    if (user) {
        return (
            <View style={[connectedStyles.wrapper, {paddingBottom: insets.bottom}]}>
                <View style={connectedStyles.upperPart}>
                    <Text style={[connectedStyles.helloMessage, {color: interactiveColor}]}>
                        Bonjour, {user.displayName} !
                    </Text>
                </View>
                <View style={connectedStyles.lowerPart}>
                    <DeconnectButton
                        onPress={() => {
                            signOut(auth).then(() => {
                                console.log('Utilisateur déconnecté.')
                                
                                setUser(null)
                            }).catch((error) => {
                                console.error('ERREUR : ' + error)
                            })
                            
                        }}
                    />
                </View>
            </View>
        )
    } else {
        return (
            <View style={disconnectedStyles.wrapper}>
                <Text style={[disconnectedStyles.message, {color: interactiveColor}]}>Connectez-vous pour enregistrer vos récoltes dans le cloud !</Text>
                <InputField
                    title="Adresse email"
                    onSubmit={(text: string) => {
                        email.current = text
                    }}
                    footer={warnMessages.email}
                    footerColor='red'
                    titleColor={Couleur.getRGBColorFromGradient(gradient, idJour)}
                    email={true}
                />

                <InputField
                    title="Pseudo"
                    onSubmit={(text: string) => {
                        name.current = text
                    }}
                    visible={inscription}
                    titleColor={Couleur.getRGBColorFromGradient(gradient, idJour)}
                    maxSize={20}
                />

                <InputField
                    title="Mot de passe"
                    password={true}
                    onSubmit={(text: string) => {
                        password.current = text
                    }}
                    footer={warnMessages.password}
                    footerColor='red'
                    titleColor={Couleur.getRGBColorFromGradient(gradient, idJour)}
                    maxSize={256}
                />

                <ConnexionButton
                />
            </View>
        )
    }

    function ConnexionButton() {
    return (
        <TouchableOpacity
            style={connexionButtonStyles.wrapper}
            activeOpacity={0.8}
            onPress={() => {
                console.log('Adresse mail : ' + email.current)
                console.log('Mot de passe : ' + password.current)

                if (inscription) createNewUser()
                else connectUser()
            }}
        >
            <Text style={[connexionButtonStyles.text, {color: interactiveColor}]}>{inscription ? 'S\'inscrire' : 'Se connecter'}</Text>
        </TouchableOpacity>
    )
}
}

type inputFieldProps = {
    title: string
    password?: Boolean
    onSubmit: Function
    footer?: string
    footerColor?: string
    visible?: Boolean
    titleColor?: string
    maxSize?: number
    email?: Boolean
}

function InputField({title, password=false, email=false, onSubmit, footer='', footerColor='black', visible=true, titleColor='grey', maxSize=320}: inputFieldProps) {

    const text = useRef("")

    if (!visible)
        return null

    return (
        <View>
            <View style={inputFieldStyles.wrapper}>
                <Text style={[inputFieldStyles.title, {color: titleColor}]}>
                    {title}
                </Text>
                <TextInput
                    style={inputFieldStyles.input}
                    secureTextEntry={password ? true : false}
                    onChangeText={(t: string) => {
                        text.current = t
                    }}
                    onBlur={() => {
                        onSubmit(text.current);
                    }}
                    returnKeyType="done"
                    keyboardType={email ? "email-address" : "default"}
                    autoCapitalize="none"
                    maxLength={maxSize}
                />
            </View>
            <Text style={[inputFieldStyles.footer, {color: footerColor}]}>{footer}</Text>
        </View>
    )
}

const inputFieldStyles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        borderRadius: Dim.scale(2),
        padding: Dim.scale(1),
        marginTop: Dim.heightScale(4),
        width: Dim.widthScale(90)
    },
    title: {
        textAlign: 'center',
        color: 'black',
        fontSize: Dim.scale(3)
    },
    input: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(4),
        color: 'black',
        minHeight: Dim.heightScale(5),
    },
    footer: {
        textAlign: 'left',
        fontSize: Dim.scale(3),
    }
})

const connexionButtonStyles = StyleSheet.create({
    wrapper: {
        borderRadius: Dim.scale(2),
        width: Dim.widthScale(50),
        height: Dim.heightScale(5),
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Dim.heightScale(4)
    },
    text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(5),
        color: 'black',
    },
})

type deconnectButtonProps = {
    onPress: Function
}

function DeconnectButton({onPress}: deconnectButtonProps) {
    return (
        <TouchableOpacity
            style={deconnectButtonStyles.button}
            activeOpacity={0.8}
            onPress={() => {
                onPress()
            }}
        >
            <Text style={deconnectButtonStyles.title}>Se déconnecter</Text>
        </TouchableOpacity>
    )
}

const deconnectButtonStyles = StyleSheet.create({
    button: {
        alignSelf: 'flex-end'
    },
    title: {

    }
})

const connectedStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: FAKE_WHITE,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    upperPart: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dim.scale(100)
    },
    lowerPart: {

    },
    helloMessage: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(6),
        fontWeight: 'bold',
        marginTop: Dim.heightScale(5),
        width: Dim.widthScale(70),
    }
})

const disconnectedStyles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: FAKE_WHITE
    },
    message: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(5),
        fontWeight: 'bold',
        marginTop: Dim.heightScale(5),
        width: Dim.widthScale(60)
    }
})
