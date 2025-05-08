import { Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default (theme: Theme) => ({
  searchFormWrapper: {
    maxWidth: { md: 'md', sm: 'sm', xs: 'xs' },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    mt: 5,
    background: theme.palette.background.default,
    p: 0,
  },
  searchFormForm: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    p: 2,
  },
  searchFormTitle: {
    fontWeight: 600,
    textAlign: 'center',
    mb: 1,
    color: theme.palette.primary.light,
  },
  searchFormSubText: {
    color: theme.palette.text.primary,
    opacity: 0.65,
    textAlign: 'center',
  },

  searchFormInputArea: {
    position: 'relative',
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      paddingRight: 0,
      overflow: 'hidden',
      backgroundColor: theme.palette.secondary.main,
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
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
      paddingLeft: theme.spacing(2),
    },
  },

  searchFormAutoComplete: {
    width: '100%',
    maxWidth: { sm: 'sm' },
    '& .MuiAutocomplete-clearIndicator': {
      color: theme.palette.action.active,
    },
    '& .MuiAutocomplete-popupIndicator': {
      color: theme.palette.action.active,
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: '0.4rem 0 0.4rem 0.4rem', 
    },
    '& .MuiAutocomplete-inputRoot:hover': {
      borderColor: theme.palette.primary.dark,
    },
  },
  searchFormDropdownPaper: {
    bgcolor: theme.palette.background.default,
    color: theme.palette.text.primary,
    marginTop: theme.spacing(0.5),
    borderRadius: '16px',
    overflow: 'hidden',
    '& .MuiAutocomplete-option': {
      padding: theme.spacing(1, 2),
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.divider}`,
      '&:last-child': {
        borderBottom: 'none',
      },
      '&[data-focus="true"]': {
        backgroundColor: theme.palette.grey[800],
      },
      '&[aria-selected="true"]': {
        backgroundColor: theme.palette.grey[700],
        '&[data-focus="true"]': {
          backgroundColor: theme.palette.grey[600],
        },
      },
    },
    '& .MuiAutocomplete-noOptions, & .MuiAutocomplete-loading': {
      color: theme.palette.grey[500],
      padding: theme.spacing(1, 2),
    },
  },

  searchFormOptionText: {
    color: 'inherit',
    opacity: 1,
    textAlign: 'left',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  searchFormSubmitButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0 15px 15px 0',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    m: 0,
    py: 3,
    px: 2.5,
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '&.Mui-disabled': {
      backgroundColor: alpha(theme.palette.primary.main, 0.5),
      color: alpha(theme.palette.text.primary, 0.7),
    },
  },

  searchFormErrorBox: {
    mt: 2,
    padding: theme.spacing(0.5, 1.5),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#D32F2F',
    color: theme.palette.text.primary,
    borderRadius: 20,
    '& .MuiAlert-icon': {
      mr: 1,
      color: 'inherit',
    },
    '& .MuiAlert-message': {
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      fontSize: '0.875rem',
    },
  },
});
