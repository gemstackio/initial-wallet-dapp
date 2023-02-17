import React, { useContext, useState, FC, ReactNode, MouseEventHandler } from "react";
import { IProps } from "../../interfaces/IPros";


// Create two sets of context:
// 1. Which stores will store the boolean value for out theme
const ThemeContext = React.createContext(false);
// 2. Stores an void returning function. We have to have this set to a void return due to the fact that our toggleTheme function returns a void
const ThemeUpdateContext = React.createContext<MouseEventHandler<HTMLButtonElement>>(() => { });

export function useTheme() {
    return useContext(ThemeContext);
}

export function useThemeUpdate() {
    return useContext(ThemeUpdateContext);
}

export function ThemeProvider({ children }: IProps) {

    const [darkTheme, setDarkTheme] = useState<boolean>(true);

    function toggleTheme() {
        setDarkTheme(prevDarkTheme => !prevDarkTheme)
    }

    return (
        <ThemeContext.Provider value={darkTheme}>
            <ThemeUpdateContext.Provider value={toggleTheme}>
                {children}
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    )
}