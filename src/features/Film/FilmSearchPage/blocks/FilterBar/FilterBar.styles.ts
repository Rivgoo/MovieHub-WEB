import { Theme } from '@mui/material';

const getFilterBarStyles = (theme: Theme) => ({
  filterBarWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: '12px',
    justifyContent: {
      md: 'space-between',
    },
    overflowX: {
      xs: 'auto',
      md: 'visible',
    },
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
