import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";

type ThemeContextProps = {
    backgroundColor: string
    setBackgroundColor: Dispatch<SetStateAction<string>>
    idJour: number
    setIdJour: Dispatch<SetStateAction<number>>
    nbJours: number
    setNbJours: Dispatch<SetStateAction<number>>
    headerHeight: number
    setHeaderHeight: Dispatch<SetStateAction<number>>
    mode: number
    setMode: Dispatch<SetStateAction<number>>
}

const ThemeContext = createContext<ThemeContextProps>({
    backgroundColor: 'c1',
    setBackgroundColor: () => {},
    idJour: 0,
    setIdJour: () => {},
    nbJours: 28,
    setNbJours: () => {},
    headerHeight: 50,
    setHeaderHeight: () => {},
    mode: 0,
    setMode: () => {}
})

type ThemeProviderProps = {
    children: React.ReactNode
}

function ThemeProvider({children}: ThemeProviderProps) {
    const [backgroundColor, setBackgroundColor] = useState('c1')
    const [idJour, setIdJour] = useState(0)
    const [nbJours, setNbJours] = useState(28)
    const [headerHeight, setHeaderHeight] = useState(50)
    const [mode, setMode] = useState(0)

    useEffect(() => {
        AsyncStorage.getItem('userPreferences').then((value) => {
            if (value !== null) {
                setBackgroundColor(JSON.parse(value).backgroundColor)
            }
        })
    }, [])

    return (
        <ThemeContext.Provider value={{
            backgroundColor, setBackgroundColor,
            idJour, setIdJour,
            nbJours, setNbJours,
            headerHeight, setHeaderHeight,
            mode, setMode
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export {ThemeContext, ThemeProvider}
