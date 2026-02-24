import { createTheme } from '@mui/material/styles';

const positivusTheme = createTheme({
    palette: {
        primary: {
            main: '#B9FF66', // Positivus electric green
            dark: '#A3E65A',
            contrastText: '#191A23',
        },
        secondary: {
            main: '#191A23', // Dark slate
            light: '#292A32',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F3F3F3', // Light gray background
            paper: '#FFFFFF',
        },
        text: {
            primary: '#191A23',
        },
    },
    typography: {
        fontFamily: '"Space Grotesk", "Outfit", "Inter", sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        }
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '14px',
                    padding: '12px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(185, 255, 102, 0.4)',
                    }
                },
                containedSecondary: {
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(25, 26, 35, 0.3)',
                    }
                }
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                    borderRadius: '16px',
                }
            }
        }
    },
});

export default positivusTheme;
