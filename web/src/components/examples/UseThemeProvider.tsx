import FunctionContextComponent from './GPTFunctionContextComponent';
import { ThemeProvider } from '../../context/examples/GPTThemeContext';


function UseThemeProvider() {
    return (
        <ThemeProvider>
            <FunctionContextComponent />
        </ThemeProvider>
    );
}

export default UseThemeProvider;
