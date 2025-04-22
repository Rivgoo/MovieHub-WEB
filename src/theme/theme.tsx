import { createTheme } from '@mui/material/styles';

const Orange = '#FF9A3D'; // Оранжевий
const DarkOrange = '#FF6715'; // Темніший оранжевий
const Withe = '#FFFFFF'; // Білий
const LightGray = '#F5F5F5'; // Світло-сірий
const DarkGray = '#333333'; // Темно-сірий

const theme = createTheme({
  palette: {
    primary: {
      main: Orange, 
      dark: DarkOrange, 
      contrastText: Withe, 
    },
    secondary: {
      main: LightGray,
      contrastText: Withe, 
    },
    background: {
      default: LightGray, 
      paper: Withe, 
    },
    text: {
      primary: LightGray,
      secondary: DarkGray,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: DarkGray,
          borderRadius: '12px',
          padding: '16px',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;