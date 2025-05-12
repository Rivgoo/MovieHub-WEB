import { Theme } from '@mui/material';

const getFilmScheduleGridStyles = (theme: Theme) => ({
  dateFilterBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1.25),
    // border: `1px solid ${theme.palette.primary.dark}`,
    width: '100%',
    minHeight: '200px',

    p: '15px 0px',
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
  filmPriceText: {
    fontSize: '0.75rem',
    color: theme.palette.text.primary,
    opacity: 0.85,
    whiteSpace: 'nowrap',
  },
  sessionPriceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: {
      xs: theme.spacing(0.1),
      md: theme.spacing(0.5),
    },
    color: theme.palette.text.secondary,
  },
});

export default getFilmScheduleGridStyles;
