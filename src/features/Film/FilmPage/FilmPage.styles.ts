import { Theme } from '@mui/material';

const getStyles = (theme: Theme) => ({
  wrapper: {
    mt: 4,
    mb: 4,
    display: 'flex',
    justifyContent: 'center',
  },
  paper: {
    p: 4,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid white',
    backgroundColor: theme.palette.background.default,
    color: 'white',
  },
  title: {
    color: 'white',
    fontWeight: 600,
    mb: 2,
    textAlign: 'center',
  },
  infoText: {
    color: 'white',
    opacity: 0.85,
    mb: 1,
    textAlign: 'center',
  },
  description: {
    color: 'white',
    opacity: 0.7,
    textAlign: 'center',
  },
  errorBox: {
    mt: 2,
    padding: '3px 6px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    '& .MuiAlert-icon': {
      mr: 1,
      color: theme.palette.text.primary,
    },
    '& .MuiAlert-message': {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.text.primary,
      width: '100%',
    },
  },
});

export default getStyles;
