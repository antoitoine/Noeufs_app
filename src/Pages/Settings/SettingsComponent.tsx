import { ListRenderItemInfo, StyleSheet } from "react-native";
import * as Dim from '../../Utils/Dimensions';
import { StackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList } from "react-native-gesture-handler";
import { FAKE_WHITE } from "../../Constantes/Couleurs";

import Section from "./Section";

type NavigationProps = NativeStackScreenProps<StackParamList, 'Settings'>;

type SettingsComponentProps = {
    colors: {dark: string, light: string}
}

type SettingsItem = {
    id: string,
    title: string
}

const pages = [
    {id: 'Historique', title: 'Historique'},
    {id: 'Personnalisation', title: 'Personnalisation'},
    {id: 'Animaux', title: 'Animaux'},
    {id: 'Compte', title: 'Mon compte'},
    {id: 'Statistiques', title: 'Statistiques'},
]

function SettingsComponent({route, navigation, colors}: NavigationProps & SettingsComponentProps) {

    const renderItem = (item: ListRenderItemInfo<SettingsItem>) => {
        return (
            <Section
                title={item.item.title}
                onPress={() => {
                    navigation.navigate(item.item.id as keyof StackParamList)
                }}
                color={colors.dark}
            />
        )
    }

    return (
        <FlatList
            data={pages}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
            style={styles.wrapper}
        />
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: FAKE_WHITE
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: Dim.heightScale(1)
    }
});

export default SettingsComponent
