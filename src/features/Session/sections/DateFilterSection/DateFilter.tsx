import { Box, Typography, useTheme } from '@mui/material';
import getSessionSearchDateFilterStyles from './DateFilter.styles';
import { useEffect, useState } from 'react';
type Props = {};

export default function DateFilter({}: Props) {
  const theme = useTheme();
  const styles = getSessionSearchDateFilterStyles(theme);

  const generateDates = (): DateItem[] => {
    return Array.from({ length: 10 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const [weekday, month, day] = d.toDateString().split(' ');
      return { weekday, month, day };
    });
  };

  interface DateItem {
    weekday: string;
    month: string;
    day: string;
  }

  const [dates, setDates] = useState<DateItem[]>([]);

  useEffect(() => {
    setDates(generateDates());
  }, []);

  return (
    <Box sx={styles.dateFilterBox}>
      {dates.map((date, idx) => (
        <Box key={idx} sx={styles.dateBox}>
          <Typography sx={styles.dateText}>
            {date.day} {date.month}
          </Typography>
          <Typography sx={styles.weekdayText}>{date.weekday}</Typography>
        </Box>
      ))}
    </Box>
  );
}
