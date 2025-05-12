import { Theme } from '@mui/material';

const getSelectorFieldStyles = (theme: Theme) => ({
  selectorWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    maxWidth: '200px',
    minWidth: '130px',
  },

  selectorLabelText: {
    whiteSpace: 'nowrap',
    fontSize: '0.85rem',
    fontWeight: 500,
    pl: theme.spacing(1),
  },
  selectorSelector: {
    width: '100%',
    maxWidth: '200px',
    borderRadius: '0.5rem',
    border: `1px solid ${theme.palette.primary.dark}`,
    color: theme.palette.text.primary,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.dark,
    },
    '& .MuiSelect-icon': {
      color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
  selectorSelectorItem: {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
  },
});

export default getSelectorFieldStyles;
