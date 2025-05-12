import { Box, Typography, useTheme } from '@mui/material';
import getSessionSearchDateFilterStyles from './DateFilter.styles';
import { useEffect, useRef, useState } from 'react';

type DateFilterProps = {};

interface DateItem {
  weekday: string;
  month: string;
  day: string;
}

export default function DateFilter({}: DateFilterProps) {
  const theme = useTheme();
  const styles = getSessionSearchDateFilterStyles(theme);

  const [dates, setDates] = useState<DateItem[]>([]);
  const [pickedIndex, setPickedIndex] = useState<number>(0);

  const generateDates = (): DateItem[] =>
    Array.from({ length: 10 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const [weekday, month, day] = d.toDateString().split(' ');
      return { weekday, month, day };
    });

  useEffect(() => {
    setDates(generateDates());
  }, []);

  return (
    <Box sx={styles.dateFilterBox}>
      {dates.map((date, idx) => {
        const isToday = idx === 0;
        const isPicked = idx === pickedIndex;

        return (
          <Box
            key={idx}
            component="button"
            onClick={(e) => {
              e.preventDefault();
              setPickedIndex(idx);
            }}
            sx={{
              ...styles.dateBox,
              ...(isPicked ? styles.pickedDateBox : {}),
              ...(isToday ? styles.todayBox : {}),
            }}>
            <Typography sx={styles.dateText}>
              {date.day} {date.month}
            </Typography>
            <Typography sx={styles.weekdayText}>{date.weekday}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}
