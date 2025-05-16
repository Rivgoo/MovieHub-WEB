import { Theme } from '@mui/material';

const FilterSessionSearchStyles = (theme: Theme) => ({
  filterSessionWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    gap: '6px',
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
  // selectorLabelText: {
  //   fontSize: '0.85rem',
  //   fontWeight: 500,
  //   pl: theme.spacing(1),
  // },
  sliderSelector: {
    width: '100%',
    maxWidth: '100%',
    maxHeight: '40px',
    '@media (pointer: coarse)': {
      padding: '13px 0',
      '& .MuiSlider-markLabel': {
        top: '30px',
      },
    },
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
  selectorWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    minWidth: '105px',
    maxWidth: '160px',
    width: '100%',
  },
  selectorLabelText: {
    fontSize: '0.85rem',
    fontWeight: 500,
    pl: theme.spacing(1),
  },
  selectorSelector: {
    maxWidth: 'none',
    width: '100%',
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

  formControlButtonBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  formControlButton: {
    display: 'flex',
    height: '40px',
    gap: '6px',
  },
});

export default FilterSessionSearchStyles;
