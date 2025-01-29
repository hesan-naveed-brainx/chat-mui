import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ccc',
        },
        background: {
            default: '#242424',
            paper: '#242424',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
        borderRadius: 8,
    },
    spacing: 8,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    margin: 0,
                    padding: 0,
                },
            },
        },
    },
});

theme.applyStyles = (mode, styles) => (mode === 'dark' ? styles : {});

const AppTheme = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default AppTheme;
