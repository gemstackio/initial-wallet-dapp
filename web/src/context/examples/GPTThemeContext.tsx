import React, { FC, ReactNode, useContext, useState } from "react";

interface Props {
    children: ReactNode;
}

interface ThemeContextValue {
    darkTheme: boolean;
    toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context.darkTheme;
}

export function useThemeUpdate() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeUpdate must be used within a ThemeProvider');
    }
    return context.toggleTheme;
}

export const ThemeProvider = ({ children }: Props) => {
    const [darkTheme, setDarkTheme] = useState<boolean>(true);

    function toggleTheme() {
        setDarkTheme((prevDarkTheme) => !prevDarkTheme);
    }

    const value: ThemeContextValue = {
        darkTheme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
