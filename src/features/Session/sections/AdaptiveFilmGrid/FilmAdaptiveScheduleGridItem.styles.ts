import { Theme } from '@mui/material';

const getFilmAdaptiveScheduleGridItemStyles = (theme: Theme) => ({
  filmCardItem: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: '125px',
    maxHeight: '150px',
  },
  filmPoster: {
    width: '100%',
    maxWidth: '100px',
    aspectRatio: '2 / 3',
    objectFit: 'cover',
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
    p: '6px !important',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
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
    lineHeight: 1.2,
  },
  sessionPriceInfo: {
    backgroundColor: theme.palette.primary.dark,
    borderRadius: '5px',
    width: 'fit-content',
    p: '2px 6px',
  },
  sessionPriceText: {
    fontSize: '0.75rem',
    color: theme.palette.primary.light,
    whiteSpace: 'nowrap',
  },
  filmInfoContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    rowGap: '1px',
    columnGap: '10px',
    border: `1px solid ${theme.palette.primary.dark}`,
    borderRadius: '6px',
    padding: '6px',
    justifyItems: 'center',
  },
});

export default getFilmAdaptiveScheduleGridItemStyles;
