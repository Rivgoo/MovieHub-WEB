import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    bgcolor: theme.palette.background.default,
    py: 4,
    px: 2,
  },
  container: {
    p: { xs: 3, sm: 4 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: `5px solid ${theme.palette.divider}`,
    borderRadius: '1rem',
    boxShadow: 'none',
    maxWidth: '550px',
    width: '100%',
    mt: 2,
    mb: 6,
    bgcolor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
  },
  title: {
    mb: 3,
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  formControl: {},
  formLabel: {
    mb: 0.65,
    pl: 1.25,
    fontWeight: 500,
    color: theme.palette.text.primary,
    '& .MuiFormLabel-asterisk': {
      display: 'none',
    },
  },
  textField: {
    '& label.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '0.75rem',
      color: theme.palette.text.primary,
      '& fieldset': {
        borderColor: '#5b3926',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.light,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '& input:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
        caretColor: theme.palette.text.primary,
        borderRadius: 'inherit',
      },
      '& input:-webkit-autofill:focus': {
        WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
        caretColor: theme.palette.text.primary,
      },
      '& input:-webkit-autofill:hover': {
        WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
        caretColor: theme.palette.text.primary,
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderWidth: '2px',
    },
    '& .MuiInputBase-input': {
      color: theme.palette.text.primary,
    },

    '&& .MuiFormHelperText-root': {
      fontSize: '0.75rem',
      marginLeft: 1.5,
      color: theme.palette.error.light,
    },
    '& .MuiInputAdornment-root': {
      '& .MuiIconButton-root': {
        color: theme.palette.text.primary,
        transition: 'color 0.2s ease-in-out',
        '&:hover': {
          color: theme.palette.primary.main,
          backgroundColor: 'transparent',
        },
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1.25rem',
      },
    },
  },
  apiErrorAlert: {
    mt: 1,
    padding: '3px 8px',
    fontSize: '0.875rem',
    backgroundColor: theme.palette.error.main,
    '& .MuiAlert-icon': {
      color: theme.palette.error.contrastText,
      paddingTop: '7px',
    },
    '& .MuiAlert-message': {
      color: theme.palette.error.contrastText,
    },
  },
  button: {
    mt: 2,
    mb: 1,
    py: 1.5,
  },
  link: {
    alignSelf: 'center',
    mt: 1,
    cursor: 'pointer',
    fontWeight: 700,
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});
