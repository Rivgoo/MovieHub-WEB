import { Theme } from '@mui/material';

const FilmGridSectionStyles = (theme: Theme) => ({
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
    gap: theme.spacing(2),
    justifyContent: 'center',
    width: '100%',
    maxWidth: '1920px',
  },
  filmCardItem: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,

    flexBasis: `calc(50% - ${theme.spacing(2 / 2)})`,
    maxWidth: `calc(50% - ${theme.spacing(2 / 2)})`,

    [theme.breakpoints.up('md')]: {
      flexBasis: `calc(33.333% - ${theme.spacing((2 * 2) / 3)})`,
      maxWidth: `calc(33.333% - ${theme.spacing((2 * 2) / 3)})`,
    },

    [theme.breakpoints.up('lg')]: {
      flexBasis: `calc(25% - ${theme.spacing((2 * 3) / 4)})`,
      maxWidth: `calc(25% - ${theme.spacing((2 * 3) / 4)})`,
    },
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    fontWeight: 600,
    fontSize: '1rem',
    minHeight: '1em',
    marginBottom: theme.spacing(1),
    lineHeight: 1.2,
  },
  filmInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: theme.spacing(0.5),
  },
  filmInfoContainerRows: {
    display: 'flex',

    // flexDirection: {
    //   xs: 'column',
    //   md: 'row',
    // },
    gap: theme.spacing(1.25),
  },
  filmInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1px',
    width: '58px',
    color: theme.palette.text.secondary,
  },
  filmInfoIcon: {
    fontSize: '0.9rem',
    maxHeight: '15px',
    color: theme.palette.primary.main,
  },
  filmInfoText: {
    fontSize: { sm: '0.75rem', md: '0.9rem' },
    color: theme.palette.text.primary,
    maxHeight: 'fit-content',
    opacity: 0.85,
    whiteSpace: 'nowrap',
  },
});

export default FilmGridSectionStyles;
