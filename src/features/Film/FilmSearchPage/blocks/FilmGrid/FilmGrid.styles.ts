import { Theme } from '@mui/material';

const getFilmGridStyles = (theme: Theme) => ({
  filmGridWrapper: {
    mb: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  filmCardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(3),
    width: '100%',
    maxWidth: '1920px',
  },
  filmCardItem: {
    flexGrow: 1,
    flexBasis: '100%',
    maxWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      flexBasis: 'calc(50% - 16px)',
      maxWidth: 'calc(50% - 16px)',
    },
    [theme.breakpoints.up('md')]: {
      flexBasis: 'calc(33.33% - 18px)',
      maxWidth: 'calc(33.33% - 18px)',
    },
    [theme.breakpoints.up('lg')]: {
      flexBasis: 'calc(25% - 20px)',
      maxWidth: 'calc(25% - 20px)',
    },
    [theme.breakpoints.up('xl')]: {
      flexBasis: 'calc(20% - 20px)',
      maxWidth: 'calc(20% - 20px)',
    },
    minWidth: '200px',
  },
  filmPoster: {
    width: '100%',
    height: 'auto',
    borderRadius: 4,
  },
  filmPosterAltBox: {
    height: 200,
    backgroundColor: '#555',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filmPosterAltText: {
    color: theme.palette.text.primary,
  },
  filmTitle: {
    color: theme.palette.text.primary,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  filmDuration: {
    color: theme.palette.text.primary,
  },
  filmPagesList: {
    display: 'flex',
    justifyContent: 'center',
    gap: {
      xs: 1,
      sm: 1.5,
      md: 2,
    },
    mt: 4,
    p: 1,
    ml: 'auto',
    mr: 'auto',
    boxSizing: 'border-box',
  },
  filmPageNavigationButton: {
    height: 'auto',
    p: 0,
    minWidth: {
      xs: '26px',
      sm: '36px',
      md: '48px',
    },
  },
  filmPageNavigationButtonActive: {
    color: theme.palette.secondary.contrastText,
  },
  filmPageNavigationButtonDisable: {
    color: theme.palette.primary.light,
    opacity: '0.3',
  },
});

export default getFilmGridStyles;
