import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StackParamList } from "../../App";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import * as Dim from '../Utils/Dimensions'
import { DEGRADES, FAKE_WHITE } from "../Constantes/Couleurs";
import { ThemeContext } from "../Contexts/ThemeContext";

type Props = NativeStackScreenProps<StackParamList, 'Personnalisation'>

export default function Personnalisation({route, navigation}: Props) {

    const theme = useContext(ThemeContext)!

    useEffect(() => {
        AsyncStorage.setItem('userPreferences', JSON.stringify({
            'backgroundColor': theme.backgroundColor
        }))
    }, [theme.backgroundColor])

    const [show, setShow] = useState(false)
    
    return (
        <>
        <ScrollView contentContainerStyle={pageStyle.container} style={pageStyle.wrapper}>
            {
                Object.keys(DEGRADES).map((value, i) => {
                    return (
                        <ChoixCouleur
                            key={i}
                            id={i}
                            onPress={(id: string) => {
                                theme.setBackgroundColor(id)
                                //setShow(!show)
                            }}
                        />
                    )
                    
                })
            }
        </ScrollView>
        <Preview
            id={1}
            show={show}
            back={() => {

            }}
            confirm={() => {

            }}
        />
        </>
    )
}

function ChoixCouleur({id, onPress, style=undefined}: {id: number, onPress: Function, style?:Object}) {

    const idStr = 'c' + id.toString()

    return (
        <TouchableOpacity
            containerStyle={[choixCouleurStyle.button, style]}
            activeOpacity={0.8}
            onPress={() => {
                onPress(idStr)
            }}
        >
            <LinearGradient
                colors={[DEGRADES[idStr][2], DEGRADES[idStr][3]]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{flex: 1, aspectRatio: 1, borderRadius: Dim.scale(2)}}
            />
        </TouchableOpacity> 
    )
}

const choixCouleurStyle = StyleSheet.create({
    button: {
        flexBasis: Dim.widthScale(20),
        flex: 1,
        flexGrow: 1,
        borderRadius: Dim.scale(1),
        margin: Dim.scale(3),
        aspectRatio: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

type PreviewProps = {
    id: number
    show: Boolean
    back: Function
    confirm: Function
}

function Preview({id, show, back, confirm}: PreviewProps) {
    return (
        <View style={[previewStyles.wrapper, {display: show ? 'flex' : 'none'}]}>
            <View style={previewStyles.content}>

            </View>
            <View style={previewStyles.footer}>
                <PreviewButton
                    title='Retour'
                    onPress={() => {

                    }}
                />
                <PreviewButton
                    title='Confirmer'
                    onPress={() => {

                    }}
                />
            </View>
        </View>
    )
}

const previewStyles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        width: Dim.widthScale(60),
        height: Dim.heightScale(60),
        left: Dim.widthScale(20),
        bottom: Dim.heightScale(20),

        display: 'flex',
        flexDirection: 'column',

        backgroundColor: 'red'
    },
    content: {
        flexGrow: 95,
        backgroundColor: 'green',
        
    },
    footer: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 5,
        backgroundColor: 'blue',
        justifyContent: 'space-evenly'
    }
})

type previewButtonProps = {
    title: string,
    onPress: Function
}

function PreviewButton({title, onPress}: previewButtonProps) {
    return (
        <TouchableOpacity
            containerStyle={previewButtonStyle.wrapper}
            onPress={() => {
                onPress()
            }}
        >
            <Text style={previewButtonStyle.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const previewButtonStyle = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: Dim.scale(4),
        color: 'white'
    }
})

const pageStyle = StyleSheet.create({
    wrapper: {
        backgroundColor: FAKE_WHITE,
        flex: 1,
    },
    container: {
        padding: Dim.scale(3),
        flexWrap: 'wrap',
        flexDirection: 'row'
    }
})
