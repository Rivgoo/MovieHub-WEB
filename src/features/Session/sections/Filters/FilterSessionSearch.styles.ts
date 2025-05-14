import { Theme } from '@mui/material';

const FilterSessionSearchStyles = (theme: Theme) => ({
  filterSessionWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  boxSliderContainerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '200px',
    boxSizing: 'border-box',
    flexGrow: 1,
  },
  sliderWrapper: {
    width: '100%',
    maxWidth: '200px',
    height: '40px',
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
    maxWidth: '100%',
    maxHeight: '40px',

    '& .MuiSlider-markLabel': {
      fontSize: '12px',
      maxWidth: 40,
      textAlign: 'center',
    },
    '& .MuiSlider-valueLabel': {
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: '#fff',
      borderRadius: '4px',
      fontSize: '120x',
    },
  },
  modalControlButtonBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  filterControlButton: {
    display: 'flex',
    height: '40px',
    gap: '6px',
  },
});

export default FilterSessionSearchStyles;
