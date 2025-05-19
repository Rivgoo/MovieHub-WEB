import { Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { border, display } from '@mui/system';

const SearchFieldSectionStyles = (theme: Theme) => ({
  searchFormWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  searchFormAutoComplete: {
    width: '100%',
    minWidth: '275px',
    maxWidth: '500px',
    maxHeight: '40px',
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    transition: 'border-color 0.3s ease',

    '&:hover': {
      borderColor: theme.palette.primary.main,
    },

    '& .MuiInputBase-root': {
      padding: '0.4rem 0.5rem',
      maxHeight: '40px',
    },

    '& .MuiOutlinedInput-root': {
      paddingRight: 0,
      '& fieldset': {
        border: 'none',
      },
    },

    '& .MuiAutocomplete-input': {
      padding: '0.5rem',
    },

    '& .MuiAutocomplete-clearIndicator': {
      color: theme.palette.action.active,
    },
    '& .MuiAutocomplete-popupIndicator': {
      display: 'none',
    },
    '& .MuiAutocomplete-hasPopupIcon': {
      display: 'none',
    },
  },

  renderInput: {
    flex: 1,
    width: '100%',
    maxHeight: '40px',
    padding: 0,
  },

  renderInputButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0 8px 8px 0',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    mt: '-2px',
    mr: '-1px',
    height: '100%',
    maxHeight: '40px',
    minWidth: '40px',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
  renderOption: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: alpha(theme.palette.action.hover, 0.5),
    },
  },
  autocompletePaper: {
    backgroundColor: alpha(theme.palette.background.paper, 1),
    boxShadow: 'none',
    marginTop: '-2px',

    display: 'flex',
    justifyContent: 'left',
  },
});

export default SearchFieldSectionStyles;
