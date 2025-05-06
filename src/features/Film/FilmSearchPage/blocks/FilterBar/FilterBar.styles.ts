import { Theme } from '@mui/material';

const getFilterBarStyles = (theme: Theme) => ({
  filterBarWrapper: {},
  filterBarForm: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterBarSelector: {
    width: '100%',
    maxWidth: '200px',
    border: `1px solid ${theme.palette.primary.dark}`,
    colors: theme.palette.text.primary,
  },
  filterBarSelectorItem: {
    color: theme.palette.text.secondary,
    backgroundColor: 'transparent',
  },
});

export default getFilterBarStyles;
