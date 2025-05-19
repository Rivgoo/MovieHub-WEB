import { TextField, TextFieldProps } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';


export const StandardInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main, 
  },
  '& .MuiInputLabel-root': {
     color: theme.palette.primary.light, 
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.85rem', 
    color: theme.palette.primary.light, 
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.light, 0.5), 
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light, 
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main, 
      borderWidth: '1px', 
    },
   
    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main, 
    },
    '&.Mui-error label.Mui-focused': {
        color: theme.palette.error.main, 
    },
     '&.Mui-error .MuiInputLabel-root': {
        color: theme.palette.error.main, 
    },
  },

  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light, 
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: `inset 0 0 20px 20px ${theme.palette.background.default}`, 
    },
}));


export const UnderlineFocusInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
  },
   '& .MuiInputLabel-root': {
     color: theme.palette.primary.light,
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: alpha(theme.palette.primary.light, 0.5), 
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: theme.palette.primary.light, 
     borderBottomWidth: '2px',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.primary.main, 
    transition: 'transform 0.3s ease', 
  },
   '& .MuiInputBase-input': {
      color: theme.palette.primary.light, 
  },

  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light,
        transition: 'background-color 5000s ease-in-out 0s',

  },
}));


export const NeonOutlineInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
    textShadow: `0 0 5px ${alpha(theme.palette.primary.main, 0.5)}`, 
  },
   '& .MuiInputLabel-root': {
     color: theme.palette.primary.light,
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.85rem',
    color: theme.palette.primary.light,
    transition: 'box-shadow 0.3s ease',
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.light, 0.3),
      transition: 'border-color 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: alpha(theme.palette.primary.light, 0.7),
    },
    '&.Mui-focused': {
       boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}, 0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`, 
       '& fieldset': {
            borderColor: theme.palette.primary.main, 
       }
    },
  },

  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light,
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: `inset 0 0 20px 20px ${theme.palette.background.default}`,
    },
}));

export const FilledHoverInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
   '& .MuiInputLabel-root': {
     color: theme.palette.primary.light,
     '&.Mui-focused': {
        color: theme.palette.primary.main,
     }
  },
  '& .MuiFilledInput-root': {
    borderRadius: '0.85rem 0.85rem 0 0', 
    backgroundColor: alpha(theme.palette.secondary.main, 0.7), 
    color: theme.palette.primary.light,
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.9), 
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.secondary.main, 
    },

    '&:before, &:after': {
      display: 'none',
    },
  },

  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light,
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: `inset 0 0 20px 20px ${alpha(theme.palette.secondary.main, 0.7)}`, 
        borderTopLeftRadius: '0.85rem', 
        borderTopRightRadius: '0.85rem',
    },
}));


export const MinimalInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label': {
     color: alpha(theme.palette.primary.light, 0.6),
     fontSize: '0.9rem',
     '&.Mui-focused': {
        color: theme.palette.primary.main,
     }
  },
  '& .MuiInput-underline:before': {
    borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`, 
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.7)}`,
  },
  '& .MuiInput-underline:after': {
    borderBottom: `1.5px solid ${theme.palette.primary.main}`, 
  },
   '& .MuiInputBase-input': {
      color: theme.palette.primary.light,
      paddingTop: theme.spacing(1.5), 
  },

  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light,
        transition: 'background-color 5000s ease-in-out 0s',
  },
}));


export const ShadowFocusInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
  },
   '& .MuiInputLabel-root': {
     color: theme.palette.primary.light,
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.85rem',
    color: theme.palette.primary.light,
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease', 
    backgroundColor: theme.palette.background.default, 
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.light, 0.4),
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused': {
      boxShadow: theme.shadows[4], 
      '& fieldset': {
         borderColor: theme.palette.primary.main,
      }
    }
  },

  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light,
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: `inset 0 0 20px 20px ${theme.palette.background.default}`,
    },
}));