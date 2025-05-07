import { Theme } from '@mui/material';

const getFilterBarStyles = (theme: Theme) => ({
  filterBarWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: '12px',
    px: 2,
    overflowX: {
      xs: 'auto',
      md: 'visible',
    },
    minWidth: 'max-content',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
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
    color: theme.palette.text.secondary,
    backgroundColor: 'transparent',
  },
});

export default getFilterBarStyles;
