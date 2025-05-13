import { Theme } from '@mui/material';

const getModalFiltersStyles = (theme: Theme) => ({
  openModalButton: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '50px',
    height: '50px',
    minWidth: '50px',
    minHeight: '50px',
    p: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
  },
  openModalButtonIcon: {
    fontSize: '25px',
  },
  modalContainer: {},
  modalFormBox: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '10px 10px 0px 0px',
    borderTop: `1px solid ${theme.palette.primary.dark}`,
    borderLeft: `1px solid ${theme.palette.primary.dark}`,
    borderRight: `1px solid ${theme.palette.primary.dark}`,
    p: '13px',
    bottom: '0px',
    width: '100%',
    gap: '6px',
  },
  boxSliderContainerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden', // важливо!
    position: 'relative',
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  sliderWrapper: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'relative',
    px: 2,
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
  boxRowContainerWrapper: {
    display: 'flex',
    width: '100%',
    gap: '6px',
  },
  selectorWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    minWidth: '105px',
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
  buttonGroup: {
    display: 'flex',
    borderRadius: '10px',
    overflow: 'hidden',
    p: '0',
    border: `1px solid ${theme.palette.primary.dark}`,
  },
  toggleButton: (active: boolean) => ({
    border: 'none',
    borderRadius: 0,
    color: 'white',
    backgroundColor: active
      ? theme.palette.primary.dark
      : 'transparent !important',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: active
        ? theme.palette.primary.dark
        : 'rgba(255, 255, 255, 0.1)',
    },
    fontWeight: 500,
    py: 1,
    textTransform: 'none',
    maxHeight: '40px',
    flex: 1,
  }),
  divider: {
    my: '6px',
    width: '100%',
    border: `1px solid ${theme.palette.primary.dark}`,
  },
  modalControlButtonBox: { display: 'flex', width: '100%', gap: '6px' },
  modalControlButton: { width: '100%' },
});

export default getModalFiltersStyles;
