import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    bgcolor: theme.palette.background.default,
    p: 2,
  },
  container: {
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: `0.5px solid`,
    borderRadius: '12px',
    borderColor: theme.palette.primary.dark,
    boxShadow: 'none',
  },
  title: {
    mb: 2,
  },
  form: {
    width: '100%',
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
  button: {
    mt: 3,
    mb: 2,
  },
  textField: {
    '& label': {
      color: theme.palette.primary.light,
      transition: 'color 0.3s ease',
    },
    '& label.Mui-focused': {
      color: theme.palette.primary.light,
    },
    '& .MuiInputBase-root': {
      color: theme.palette.primary.light,
      borderColor: theme.palette.primary.light,
      transition: 'border-color 0.4s ease',
    },
    '& .MuiInputBase-root textarea': {
      backgroundColor: 'transparent',
    },
  },
});
