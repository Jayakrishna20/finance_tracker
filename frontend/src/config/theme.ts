import { createTheme } from '@mui/material/styles';
import { COLORS } from './constants';

const positivusTheme = createTheme({
    palette: {
        primary: {
            main: COLORS.PRIMARY,
            dark: COLORS.ACCENT,
            contrastText: COLORS.SECONDARY,
        },
        secondary: {
            main: COLORS.SECONDARY,
            light: COLORS.DARK_GRAY,
            contrastText: '#FFFFFF',
        },
        background: {
            default: COLORS.LIGHT_GRAY,
            paper: '#FFFFFF',
        },
        text: {
            primary: COLORS.SECONDARY,
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
