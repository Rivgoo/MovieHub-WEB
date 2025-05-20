import { Theme } from '@mui/material';

const FilmModalFiltersSectionStyles = (theme: Theme) => ({
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
    zIndex: 1200,
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
    lineHeight: '1.66',
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
  divider: {
    my: '6px',
    width: '100%',
    border: `1px solid ${theme.palette.primary.dark}`,
  },
  modalControlButtonBox: { display: 'flex', width: '100%', gap: '6px' },
  modalControlButton: { width: '100%' },
});

export default FilmModalFiltersSectionStyles;
