import { Theme } from '@mui/material';

const getSessionSearchDateFilterStyles = (theme: Theme) => ({
  dateFilterBox: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '130px',
    minHeight: '200px',
    rowGap: '10px',
    borderRadius: '10px',
  },
  dateBox: {
    maxWidth: '130px',
    border: `1px solid ${theme.palette.primary.light}`,
    bgcolor: 'transparent',
    borderRadius: '10px',
    py: '6px',
    transition:
      'background-color 0.25s ease, border-color 0.25s ease, transform 0.2s ease',
    '&:hover': {
      bgcolor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-2px)',
      cursor: 'pointer',
    },
  },
  todayBox: {
    bgcolor: theme.palette.primary.dark,
    border: `1px solid ${theme.palette.primary.dark}`,
    color: `${theme.palette.primary.light} !important`,
    animation: 'fadeIn 0.4s ease-out',
    '@keyframes fadeIn': {
      '0%': { opacity: 0, transform: 'scale(0.9)' },
      '100%': { opacity: 1, transform: 'scale(1)' },
    },
  },
  pickedDateBox: {
    border: `1px solid ${theme.palette.primary.dark}`,
    color: theme.palette.primary.dark,
    animation: 'zoomIn 0.3s ease-in-out',
    '@keyframes zoomIn': {
      '0%': { transform: 'scale(0.95)' },
      '100%': { transform: 'scale(1)' },
    },
  },
  dateText: { textAlign: 'center' },
  weekdayText: { textAlign: 'center' },
});

export default getSessionSearchDateFilterStyles;
