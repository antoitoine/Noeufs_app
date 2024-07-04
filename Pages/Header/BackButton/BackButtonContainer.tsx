import { useSafeAreaInsets } from "react-native-safe-area-context"
import BackButtonComponent from "./BackButtonComponent"
import { RouteProp } from "@react-navigation/native"
import { StackParamList } from "../../../App"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { GestureResponderEvent } from "react-native"

type BackButtonComponentProps = {
    route: RouteProp<StackParamList, keyof StackParamList> | any
    navigation: NativeStackNavigationProp<StackParamList, keyof StackParamList>
}

function BackButtonContainer({route, navigation}: BackButtonComponentProps) {

    const insets = useSafeAreaInsets()

    const handlePress = (event: GestureResponderEvent) => {
        if(navigation.canGoBack())
            navigation.goBack()
    }

    return (
        <BackButtonComponent
            onPress={handlePress}
            insets={insets}
        />
    )
}

export default BackButtonContainer
