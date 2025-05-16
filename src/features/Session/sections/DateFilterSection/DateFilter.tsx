import { Box, Typography, useTheme } from '@mui/material';
import getSessionSearchDateFilterStyles from './DateFilter.styles';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

type DateFilterProps = {
  onChange?: (value: string) => void;
};

type DateOption = {
  value: string;
  label: string;
  weekday: string;
};

export default function DateFilter({ onChange }: DateFilterProps) {
  const theme = useTheme();
  const styles = getSessionSearchDateFilterStyles(theme);
  const navigate = useNavigate();
  const loc = useLocation();
  const [searchParams] = useSearchParams();

  const [dates, setDates] = useState<DateOption[]>([]);
  const [pickedIndex, setPickedIndex] = useState<number>(0);

  const toLocalYMD = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // const genDates = Array.from({ length: 10 }, (_, i) => {
  //   const d = new Date();
  //   d.setDate(d.getDate() + i);
  //   const value = toLocalYMD(d);
  //   const weekday = new Intl.DateTimeFormat('uk-UA', {
  //     weekday: 'long',
  //   }).format(d);
  //   const label = new Intl.DateTimeFormat('uk-UA', {
  //     day: 'numeric',
  //     month: 'long',
  //   }).format(d);
  //   const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  //   return { value, label: cap(label), weekday: cap(weekday) };
  // });
  // setDates(genDates);

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
    const date = toLocalYMD(new Date());
    const expectedMin = `${date}T08:00:00.923Z`;
    const expectedMax = `${date}T23:00:00.923Z`;

    const minParam = searchParams.get('MinStartTime') + ':00.923Z';
    const maxParam = searchParams.get('MaxStartTime') + ':00.923Z';

    if (minParam === expectedMin && maxParam === expectedMax) {
      setPickedIndex(0);
    }
  }, [searchParams]);

  const handleButtonClick = (idx: number) => {
    setPickedIndex(idx);
    const qp = new URLSearchParams(loc.search);

    const existingMin = qp.get('MinStartTime')?.split('T')[1];
    const existingMax = qp.get('MaxStartTime')?.split('T')[1];

    const minDateTime = `${dates[idx].value}T${existingMin}`;
    const maxDateTime = `${dates[idx].value}T${existingMax}`;

    qp.set('MinStartTime', minDateTime);
    qp.set('MaxStartTime', maxDateTime);

    navigate({
      pathname: '/session-search',
      search: `?${qp.toString()}`,
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
