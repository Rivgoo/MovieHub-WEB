import { Theme } from '@mui/material';

const getSessionSectionStyles = (theme: Theme) => ({
  sectionTitle: {
    fontWeight: '600',
    color: theme.palette.primary.light,
    mb: '2rem',
    textAlign: 'center',
  },
  loadingBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100px',
  },
  sessionDateItem: {},
  sessionDate: {},
  sessionTimeBtn: {
    display: 'flex',
    flexDirection: 'column',
    px: 2,
    py: 1,
    border: `1px solid ${theme.palette.primary.light}`,
    borderRadius: '10px',
    cursor: 'pointer',
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    transition: 'border 0.3s ease, color 0.3s ease',

    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
    },

    '&:active': {
      border: `1px solid ${theme.palette.primary.main}`,
      color: theme.palette.primary.contrastText,
    },

    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  },
  divider: {
    my: 2,
    borderColor: theme.palette.primary.light,
  },
  timeText: {
    fontSize: '1.1rem', // трохи більший час
    fontWeight: 500,
  },
  priceText: {
    fontSize: '0.85rem', // менша ціна
    opacity: 0.6, // сіріша
  },
});
export default getSessionSectionStyles;
