import MainNavigatorComponent from "./MainNavigatorComponent";
import { AuthContext } from "../../../App";
import { useContext } from "react";

type MainNavigatorContainerProps = {
    
}

function MainNavigatorContainer({}: MainNavigatorContainerProps) {
    const [user, ] = useContext(AuthContext)!.user

    return (
        <MainNavigatorComponent
            user={user}
        />
    )
}


// TODO : Ajouter dans le theme context - interactiveLightColor et interactiveDarkColor

export default MainNavigatorContainer
