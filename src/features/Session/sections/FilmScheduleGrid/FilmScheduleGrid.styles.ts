import { Theme } from '@mui/material';

const getFilmScheduleGridStyles = (theme: Theme) => ({
  filmCardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '10px',
    rowGap: theme.spacing(2),
    width: '100%',
    maxWidth: '1920px',
  },
  filmCardItem: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: '240px',
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
    // padding: theme.spacing(1.5),
    p: '6px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:last-child': {
      pb: '6px', // shorthand for paddingBottom: 0
      // or paddingBottom: 0
    },
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
    // minHeight: '2.4em',
    marginBottom: theme.spacing(1),
    lineHeight: 1.2,
  },
  filmInfoContainer: {
    display: 'flex',
    border: `1px solid ${theme.palette.primary.dark}`, // оранжевый контур
    borderRadius: '10px',
    overflow: 'hidden', // чтобы границы скруглялись и не вылезали
  },

  // Левая часть — грид с сеансами
  sessionTimeBox: {
    flex: 1, // занимает всё доступное место
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', // 3 колонки одинаковой ширины
    gap: theme.spacing(1), // расстояние между таймами
    py: theme.spacing(1), // внутренний отступ
  },

  filmTimeText: {
    fontSize: '0.75rem',
    color: theme.palette.primary.dark, // тот же оранжевый
    textAlign: 'center',
  },

  // Правая часть — фиксированный квадрат с ценой
  sessionPriceBox: {
    bgcolor: theme.palette.primary.dark, // оранжевый фон
    width: '60px',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sessionPriceText: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.palette.primary.light, // светлый (контрастный) текст
    textAlign: 'center',
  },
});

export default getFilmScheduleGridStyles;
