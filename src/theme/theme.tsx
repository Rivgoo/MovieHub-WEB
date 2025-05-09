import { createTheme } from '@mui/material/styles';

const Orange = '#da621c'; // Orange
const DarkOrange = '#f6770a'; // DarkOrange
const White = '#F8FCF8'; // White
const LightGray = '#F5F5F5'; // LightGray
const DarkGray = '#1e1e1e'; // DarkGray
const PaperBackground = '#242424';
const AdminNavBackground = '#242424';
const ErrorBackground = '#6b1f1a';

const theme = createTheme({
  palette: {
    primary: {
      main: Orange,
      dark: DarkOrange,
      light: White,
      contrastText: LightGray,
    },
    secondary: {
      main: DarkGray,
      contrastText: LightGray,
    },
    background: {
      default: DarkGray,
      paper: PaperBackground,
    },
    text: {
      primary: LightGray,
      secondary: DarkGray,
    },
    admin: {
      main: AdminNavBackground,
      navBackground: AdminNavBackground,
      contrastText: LightGray,
    },
    error: {
      main: ErrorBackground,
      light: '#e84e3d',
      contrastText: LightGray,
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
          width: '100%',
          maxWidth: 'lg',
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
