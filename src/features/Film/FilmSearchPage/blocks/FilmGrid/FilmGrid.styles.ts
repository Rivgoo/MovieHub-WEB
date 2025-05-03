import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  wrapper: {
    mt: 4,
    mb: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(3),
    // padding: theme.spacing(1),
    width: '100%',
    maxWidth: '1920px',
  },
  cardItem: {
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
  posterAltBox: {
    height: 200,
    backgroundColor: '#555',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterAltText: {
    color: theme.palette.text.secondary,
  },
  filmTitle: {
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  filmDuration: {
    color: theme.palette.text.secondary,
  },
  pagesList: {
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    mt: 4,
    p: 1,
  },
  pageNavigationButton: {
    // maxWidth: '30px',
    height: 'auto',
    p: 0,
  },
  pageNavigationButtonActive: { color: theme.palette.secondary.contrastText },
  pageNavigationButtonDisable: { color: '#3C3C3C' },
  pageNavavigationButtonText: { color: theme.palette.text.primary },

  // pageNavavigationButtonText: { color: theme.palette.text.primary },
});
