import React from 'react';
// import { useTheme, useThemeUpdate } from '../context/ThemeContext';
import { useTheme, useThemeUpdate } from '../../context/examples/GPTThemeContext';


const GPTFunctionContextComponent = () => {
    const darkTheme = useTheme();
    const toggleTheme = useThemeUpdate();

    const themeStyles = {
        backgroundColor: darkTheme ? '#333' : '#CCC',
        color: darkTheme ? '#CCC' : '#333',
        padding: '2rem',
        margin: '2rem'
    }
    return (
        <>
            <button onClick={toggleTheme}>Toggle Theme</button>
            <div style={themeStyles}>
                Function Theme
            </div>
        </>
    );
};

export default GPTFunctionContextComponent;