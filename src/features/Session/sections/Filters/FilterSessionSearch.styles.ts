import { Theme } from '@mui/material';

const FilterSessionSearchStyles = (theme: Theme) => ({
  filterSessionWrapper: {
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
});

export default FilterSessionSearchStyles;
