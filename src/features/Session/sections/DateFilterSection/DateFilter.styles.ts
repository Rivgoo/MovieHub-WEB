import { Theme } from '@mui/material';

const getSessionSearchDateFilterStyles = (theme: Theme) => ({
  dateFilterBox: {
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${theme.palette.primary.dark}`,
    maxWidth: '146px',
    minHeight: '200px',
    rowGap: '15px',
    p: '15px 8px',
    mt: '15px',
    borderRadius: '10px',
  },
  dateBox: {
    maxWidth: '130px',
    // maxHeight: '50px',
    border: `1px solid ${theme.palette.primary.light}`,
    borderRadius: '10px',
    py: '6px',
  },
  dateText: { textAlign: 'center' },
  weekdayText: { textAlign: 'center' },
});

export default getSessionSearchDateFilterStyles;
