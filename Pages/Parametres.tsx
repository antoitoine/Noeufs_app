import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Dim from '../Utils/Dimensions';
import { StackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<StackParamList, 'Parametres'>;

export default function Parametres({route, navigation}: Props) {
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
            </View>
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
        backgroundColor: 'white',
        borderTopRightRadius: Dim.scale(5),
        borderTopLeftRadius: Dim.scale(5),
        borderWidth: 1
    },
    invisible: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: Dim.heightScale(5),
        width: Dim.widthScale(100),
    },
    retourTexte: {
        fontWeight: 'bold',
        textAlign: 'left',
        textAlignVertical: 'center',
        color: 'black',
        fontSize: Dim.scale(4)
    },
    retourWrapper: {
        position: 'relative',
        top: Dim.scale(2),
        left: Dim.scale(5),
    }
});

