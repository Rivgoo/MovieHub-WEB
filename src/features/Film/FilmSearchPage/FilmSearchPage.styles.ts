import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  wrapper: {
    mt: 4,
    mb: 4,
    display: 'flex',
    justifyContent: 'center',
    background: theme.palette.background.default,
    height: '100%',
  },
  form: {
    // p: 4,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: 600, mb: 2, color: theme.palette.primary.light },
  subText: {
    mb: 2,
    color: theme.palette.text.primary,
    opacity: 0.6,
    textAlign: 'center',
  },
  inputArea: {
    position: 'relative',
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      paddingRight: 0,
      overflow: 'hidden',
      '& fieldset': {
        borderColor: theme.palette.primary.light,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.light,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.dark,
      },
      '& .MuiInputAdornment-root': {
        height: '100%',
      },
    },
    '& input': {
      color: theme.palette.primary.light,
    },
  },
  submitButton: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    m: 0,
    py: 3,
    width: '4dvw',
    fontWeight: 500,
    fontSize: '1rem',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
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
