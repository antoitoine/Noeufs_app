import { Animated, ImageBackground, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import * as Dim from '../Utils/Dimensions';
import { StackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { TextInput } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<StackParamList, 'Parametres'>;

export default function Parametres({route, navigation}: Props) {

    const [initializing, setInitializing] = useState(false);
    const [user, setUser] = useState()

    const email = useRef("");
    const password = useRef("");

    /*createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const u = userCredential.user;
        console.log('User created : ' + u.email);
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error('ERREUR : ' + errorCode + ' ' + errorMessage);
    })*/

    if (initializing)
        return null

    if (!user) {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity style={styles.invisible} activeOpacity={1} onPress={() => {
                    navigation.goBack();
                }}>

                </TouchableOpacity>

                <View style={styles.page}>
                    <TouchableOpacity style={styles.retourWrapper} activeOpacity={0.8} onPress={() => {
                        navigation.goBack();
                    }}>
                    <Text style={styles.retourTexte}>Retour</Text>
                </TouchableOpacity>

                <View style={styles.connexion}>

                    <Text style={styles.connexionTitle}>Connexion</Text>

                    <InputField
                        title="Adresse email"
                        onSubmit={(text: string) => {
                            email.current = text
                        }}
                    />

                    <InputField
                        title="Mot de passe"
                        password={true}
                        onSubmit={(text: string) => {
                            password.current = text
                        }}
                    />

                    <TouchableOpacity
                        style={styles.connexionButton}
                        activeOpacity={0.8}
                        onPress={() => {
                            console.log('Adresse mail : ' + email.current)
                            console.log('Mot de passe : ' + password.current)
                        }}
                    >
                        <Text style={styles.connexionButtonText}>Valider</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
        )
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.invisible} activeOpacity={1} onPress={() => {
                navigation.goBack();
            }}>

            </TouchableOpacity>
            <View style={styles.page}>
                <TouchableOpacity style={styles.retourWrapper} activeOpacity={0.8} onPress={() => {
                    navigation.goBack();
                }}>
                    <Text style={styles.retourTexte}>Retour</Text>
                </TouchableOpacity>

                <Text>Signed up</Text>
            </View>
        </View>
    )
}

function InputField({title, password=false, onSubmit}: {title: string, password?: Boolean, onSubmit: Function}) {

    const text = useRef("")

    return (
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
    )
}

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
        backgroundColor: '#DAC4F7',
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
        color: 'black'
    }
});

