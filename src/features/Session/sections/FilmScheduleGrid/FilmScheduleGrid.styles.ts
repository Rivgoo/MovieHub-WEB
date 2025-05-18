import { Theme } from '@mui/material';
import { maxHeight, maxWidth } from '@mui/system';

const getFilmScheduleGridStyles = (theme: Theme) => ({
  filmCardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    rowGap: '10px',
    columnGap: '10px',
    justifyItems: 'center',
  },
  nothingFound: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '400px',
    textAlign: 'center',
  },
  filmCardItem: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: '240px',
    minWidth: '125px',
    maxHeight: 'fit-content',
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
    p: '6px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
    '&:last-child': {
      pb: '6px',
    },
  },
  filmTitle: {
    color: theme.palette.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    fontWeight: 600,
    fontSize: '1rem',
    marginBottom: theme.spacing(1),
    lineHeight: 1.2,
    cursor: 'pointer',
    width: 'fit-content',
    maxWidth: '228px',
    transiton: 'color 0.4s ease',
    '&:hover': {
      color: theme.palette.primary.dark,
      transition: 'color 0.4s ease',
    },
  },
  filmInfoContainer: {
    display: 'flex',
    border: `1px solid ${theme.palette.primary.dark}`,
    borderRadius: '10px',
    overflow: 'hidden',
  },

  sessionTimeBox: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '2px',
    p: '6px',
  },

  filmTimeText: {
    fontSize: '0.75rem',
    color: theme.palette.primary.light,
    textAlign: 'center',
    transiton: 'color 0.4s ease',
    cursor: 'pointer',
    maxHeight: '16px',
    maxWidth: 'fit-content',
    '&:hover': {
      color: theme.palette.primary.dark,
      transition: 'color 0.4s ease',
    },
  },

  sessionPriceBox: {
    bgcolor: theme.palette.primary.dark,
    width: '60px',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sessionPriceText: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.palette.primary.light,
    textAlign: 'center',
  },
});

export default getFilmScheduleGridStyles;
