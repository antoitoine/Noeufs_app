import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Dim from '../Utils/Dimensions';
import { AuthContext, StackParamList, ThemeContext } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext, useEffect, useRef, useState } from "react";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from '../firebase';
import { TextInput } from "react-native-gesture-handler";
import * as Couleur from '../Utils/Couleurs'
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { DEGRADES, FAKE_WHITE } from "../Constantes/Couleurs";

type Props = NativeStackScreenProps<StackParamList, 'Parametres'>;

export default function Parametres({route, navigation}: Props) {

    const theme = useContext(ThemeContext)!
    const [backgroundColor, ] = theme.backgroundColor
    const [idJour, ] = theme.idJour
    const [nbJours, ] = theme.nbJours

    const gradient = Couleur.degradeCouleur(DEGRADES[backgroundColor][2], DEGRADES[backgroundColor][3], nbJours)
    const interactiveColor = Couleur.getRGBColorFromGradient(gradient, idJour)

    const authContext = useContext(AuthContext)!
    const [user, ] = authContext.user

    return (
        <View style={styles.wrapper}>
            <Section
                title={user ? 'Mon compte' : 'Compte'}
                onPress={() => {
                    navigation.navigate('Compte')
                }}
                color={interactiveColor}
            />
            <Section
                title='Personnalisation'
                onPress={() => {
                    navigation.navigate('Personnalisation')
                }}
                color={interactiveColor}
            />
        </View>
    )
}

type SectionType = {
    title: string
    onPress: Function
    color: string
}

function Section({title, onPress, color}: SectionType) {
    return (
        <TouchableOpacity
            style={sectionStyles.wrapper}
            activeOpacity={0.7}
            onPress={() => {
                onPress()
            }}
        >
            <Text style={[sectionStyles.title, {color: color}]}>{title}</Text>
        </TouchableOpacity>
    )
}

const sectionStyles = StyleSheet.create({
    wrapper: {
        width: Dim.widthScale(90),
        height: Dim.heightScale(8),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Dim.heightScale(1),
        marginBottom: Dim.heightScale(1),

        borderRadius: Dim.scale(1),
        backgroundColor: 'white'
    },
    title: {
        textAlign: 'center',
        textAlignVertical: 'center',

        color: 'black',
        fontSize: Dim.scale(5),
        fontWeight: 'bold'
    }
})

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

        color: 'black',
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
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',

        paddingTop: Dim.heightScale(1),

        backgroundColor: FAKE_WHITE
    },
    page: {
        position: 'relative',
        top: Dim.heightScale(5),
        left: 0,
        height: Dim.heightScale(95),
        width: Dim.widthScale(100),
        backgroundColor: "#F5F5F5",
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
        color: 'black',
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
        height: Dim.heightScale(5)
    },
    connexionTitle: {
        fontSize: Dim.scale(6),
        color: 'black',
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
        color: 'black',
        fontSize: Dim.scale(3)
    },

    connexionButton: {
        borderRadius: Dim.scale(2),
        width: Dim.widthScale(50),
        height: Dim.heightScale(5),
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    connexionButtonText: {
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
        color: 'black',
        fontSize: Dim.scale(6),
        textShadowRadius: 10,
        fontWeight: 'bold'
    }
});

