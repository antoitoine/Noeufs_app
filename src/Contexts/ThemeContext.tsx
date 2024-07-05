import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import { DEGRADES } from "../Constantes/Couleurs";
import { degradeCouleur, getRGBColorFromGradient } from "../Utils/Couleurs";

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
    colors: {light: string, dark: string},
    setColors: Dispatch<SetStateAction<{light: string, dark: string}>>
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
    setMode: () => {},
    colors: {light: 'blue', dark: 'green'},
    setColors: () => {}
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
    const [colors, setColors] = useState({light: 'blue', dark: 'green'})

    useEffect(() => {
        AsyncStorage.getItem('userPreferences').then((value) => {
            if (value !== null) {
                setBackgroundColor(JSON.parse(value).backgroundColor)
            }
        })
    }, [])

    useEffect(() => {
        AsyncStorage.setItem('userPreferences', JSON.stringify({
            'backgroundColor': backgroundColor
        }))

        const lightGradient = degradeCouleur(DEGRADES[backgroundColor][0], DEGRADES[backgroundColor][1], nbJours)
        const lightColor = getRGBColorFromGradient(lightGradient, idJour)
        const darkGradient = degradeCouleur(DEGRADES[backgroundColor][2], DEGRADES[backgroundColor][3], nbJours)
        const darkColor = getRGBColorFromGradient(darkGradient, idJour)

        setColors({light: lightColor, dark: darkColor})

    }, [backgroundColor])

    return (
        <ThemeContext.Provider value={{
            backgroundColor, setBackgroundColor,
            idJour, setIdJour,
            nbJours, setNbJours,
            headerHeight, setHeaderHeight,
            mode, setMode,
            colors, setColors
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export {ThemeContext, ThemeProvider}
