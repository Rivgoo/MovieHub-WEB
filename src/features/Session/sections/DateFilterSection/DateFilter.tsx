import { Box, Typography, useTheme } from '@mui/material';
import getSessionSearchDateFilterStyles from './DateFilter.styles';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type DateFilterProps = {
  onChange?: (value: string) => void;
};

type DateOption = {
  value: string; // формат: 'YYYY-MM-DD'
  label: string; // формат: '14 травня'
  weekday: string; // формат: 'Вівторок'
};

export default function DateFilter({ onChange }: DateFilterProps) {
  const theme = useTheme();
  const styles = getSessionSearchDateFilterStyles(theme);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [dates, setDates] = useState<DateOption[]>([]);
  const [pickedIndex, setPickedIndex] = useState<number>(0);

  const generateUkrainianDates = (): DateOption[] =>
    Array.from({ length: 10 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const value = date.toISOString().split('T')[0];

      const weekday = new Intl.DateTimeFormat('uk-UA', {
        weekday: 'long',
      }).format(date);

      const label = new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
      }).format(date);

      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

      console.log(capitalize);

      return {
        value,
        label: capitalize(label),
        weekday: capitalize(weekday),
      };
    });

  useEffect(() => {
    const generatedDates = generateUkrainianDates();
    setDates(generatedDates);

    navigate({
      pathname: '/session-search',
      search: `?MinStartTime=${generatedDates[0].value}T08:00&MaxStartTime=${generatedDates[0].value}T23:00`,
    });

    if (onChange) {
      onChange(generatedDates[0].value);
    }
  }, []);

  useEffect(() => {
    const date = new Date().toISOString().split('T')[0];
    const expectedMin = `${date}T08:00:00.923Z`;
    const expectedMax = `${date}T23:00:00.923Z`;

    const minParam = searchParams.get('MinStartTime');
    const maxParam = searchParams.get('MaxStartTime');
    if (minParam === expectedMin && maxParam === expectedMax) {
      setPickedIndex(0);
    }
  }, [searchParams]);

  const handleButtonClick = (idx: number) => {
    setPickedIndex(idx);
    navigate({
      pathname: '/session-search',
      search: `?MinStartTime=${dates[idx].value}T08:00&MaxStartTime=${dates[idx].value}T23:00`,
    });
  };

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
              handleButtonClick(idx);
            }}
            sx={{
              ...styles.dateBox,
              ...(isPicked ? styles.pickedDateBox : {}),
              ...(isToday ? styles.todayBox : {}),
            }}>
            <Typography sx={styles.dateText}>{date.label}</Typography>
            <Typography sx={styles.weekdayText}>{date.weekday}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}
