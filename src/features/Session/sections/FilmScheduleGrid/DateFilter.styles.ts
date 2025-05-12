import { Theme } from '@mui/material';

const getSessionSearchDateFilterStyles = (theme: Theme) => ({
  dateFilterBox: {
    border: `1px solid ${theme.palette.primary.dark}`,
    minWidth: '146px',
    minHeight: '200px',
  },
  filmCardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    justifyContent: 'center',
    width: '100%',
    maxWidth: '1920px',
  },
  filmCardItem: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: '250px',
    // flexBasis: `calc(50% - ${theme.spacing(2 / 2)})`,
    // maxWidth: `calc(50% - ${theme.spacing(2 / 2)})`,

    // [theme.breakpoints.up('md')]: {
    //   flexBasis: `calc(33.333% - ${theme.spacing((2 * 2) / 3)})`,
    //   maxWidth: `calc(33.333% - ${theme.spacing((2 * 2) / 3)})`,
    // },

    // [theme.breakpoints.up('lg')]: {
    //   flexBasis: `calc(25% - ${theme.spacing((2 * 3) / 4)})`,
    //   maxWidth: `calc(25% - ${theme.spacing((2 * 3) / 4)})`,
    // },
    minWidth: '125px',
  },
  filmPoster: {
    width: '100%',
    aspectRatio: '2 / 3',
    objectFit: 'cover',
    borderRadius: '4px 4px 0 0',
  },
  filmPosterAltBox: {
    aspectRatio: '2 / 3',
    width: '100%',
    backgroundColor: '#555',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px 4px 0 0',
  },
  filmPosterAltText: {
    color: theme.palette.text.primary,
  },
  filmCardContent: {
    padding: theme.spacing(1.5),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  filmTitle: {
    color: theme.palette.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    fontWeight: 600,
    fontSize: '1rem',
    minHeight: '2.4em',
    marginBottom: theme.spacing(1),
    lineHeight: 1.2,
  },
  filmInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1.25),
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: theme.spacing(0.5),
  },
  filmInfoContainerRows: {
    display: 'flex',
    flexDirection: {
      xs: 'column',
      md: 'row',
    },
    gap: theme.spacing(1.25),
  },
  filmInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: {
      xs: theme.spacing(0.1),
      md: theme.spacing(0.5),
    },
    color: theme.palette.text.secondary,
  },
  filmInfoIcon: {
    fontSize: '0.9rem',
    color: theme.palette.primary.main,
  },
  filmInfoText: {
    fontSize: '0.75rem',
    color: theme.palette.text.primary,
    opacity: 0.85,
    whiteSpace: 'nowrap',
  },
  filmPagesList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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

export default getSessionSearchDateFilterStyles;
