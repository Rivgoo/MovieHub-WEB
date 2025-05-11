import { Theme } from '@mui/material';

const getFilterBarStyles = (theme: Theme) => ({
  filterBarWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: theme.spacing(1.5),
    px: theme.spacing(2),
    justifyContent: {
      md: 'center',
    },
    overflowX: {
      xs: 'auto',
      md: 'visible',
    },
    minWidth: 0,

    width: '100%',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
  },

  filterLabelText: {
    whiteSpace: 'nowrap',
    fontSize: '0.85rem',
    fontWeight: 500,
    pl: theme.spacing(1),
  },
  filterBarSelector: {
    width: '100%',
    maxWidth: '200px',
    borderRadius: '0.5rem',
    border: `1px solid ${theme.palette.primary.dark}`,
    color: theme.palette.text.primary,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.dark
    },
    '& .MuiSelect-icon': {
      color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
  },
  filterBarSelectorItem: {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
  },
});

export default getFilterBarStyles;
