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
  boxSliderContainerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden', // важливо!
    position: 'relative',
    maxWidth: '200px',
    boxSizing: 'border-box',
  },
  sliderWrapper: {
    width: '100%',
    maxWidth: '200px',
    overflow: 'hidden',
    position: 'relative',
    px: 2,
  },
  selectorLabelText: {
    fontSize: '0.85rem',
    fontWeight: 500,
    pl: theme.spacing(1),
  },
  sliderSelector: {
    width: '100%',
    '& .MuiSlider-markLabel': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '12px',
      maxWidth: 40,
      textAlign: 'center',
    },
    '& .MuiSlider-valueLabel': {
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: '#fff',
      borderRadius: '4px',
      fontSize: '12px',
      whiteSpace: 'nowrap',
    },
  },
});

export default FilterSessionSearchStyles;
