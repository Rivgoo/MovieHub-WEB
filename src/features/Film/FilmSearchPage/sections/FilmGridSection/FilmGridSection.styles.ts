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
    minWidth: '125  px',
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
});

export default FilmGridSectionStyles;
