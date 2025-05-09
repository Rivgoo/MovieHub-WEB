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
  },
  filterBarSelector: {
    width: '100%',
    maxWidth: '200px',
    border: `1px solid ${theme.palette.primary.dark}`,
    color: theme.palette.text.primary,
    '& .MuiSelect-icon': {
      color: theme.palette.primary.main,
    },
  },
  filterBarSelectorItem: {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
  },
});

export default getFilterBarStyles;
