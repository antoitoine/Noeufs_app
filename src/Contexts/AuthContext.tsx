import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, onAuthStateChanged } from "firebase/auth";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";

type AuthContextProps = {
    user: User | null
    setUser: Dispatch<SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    setUser: () => {}
})

type AuthProviderProps = {
    children: React.ReactNode
}

function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User connected : ' + user.email + ' ' + user.displayName)
                setUser(user)
            } else {
                setUser(null)
            }
        })
    }, [])

    return (
        <AuthContext.Provider value={{
            user, setUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}
