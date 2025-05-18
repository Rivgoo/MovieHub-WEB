import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSectionStyles from './FilterSection.styles';

type Props = {};

type FilterSessionFieldKeys = {
  [key: string]: string | string[];
};

const getDefaultQuery = (): FilterSessionFieldKeys => ({
  GenreIds: [],
  MinRating: '',
  MinReleaseYear: '',
  MinDurationMinutes: '',
  MaxDurationMinutes: '',
  HasSessions: '',
  MaxAgeRating: '',
});

const FilterSection = (props: Props) => {
  const theme = useTheme();
  const styles = FilterSectionStyles(theme);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterSessionFieldKeys>(getDefaultQuery);
  const [selectedSeats, setSelectedSeats] = useState<string>('');

  const priceOptions = ['60', '120', '200', '600'].map((v) => ({
    value: v,
    label: v,
  }));

  const seatsOptions = [
    { value: 'true', label: 'Є' },
    { value: 'false', label: 'Немає' },
  ];

  const handleChange =
    (field: keyof FilterSessionFieldKeys, setLocal: (val: string) => void) =>
    (e: SelectChangeEvent<string>) => {
      const { value } = e.target;
      setLocal(value);
      setFilter((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  return (
    <Box component={'form'}>
      <Box sx={styles.selectorWrapper}>
        <Typography variant="caption" sx={styles.selectorLabelText}>
          Місця
        </Typography>
        <Select
          name="HasAvailableSeats"
          fullWidth
          value={selectedSeats}
          onChange={handleChange('HasAvailableSeats', setSelectedSeats)}
          displayEmpty
          size="small"
          sx={styles.selectorSelector}>
          <MenuItem value="">Всі</MenuItem>
          {seatsOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default FilterSection;
