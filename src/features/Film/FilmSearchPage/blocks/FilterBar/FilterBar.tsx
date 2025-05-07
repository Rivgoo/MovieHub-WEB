import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import { GenreDto } from '../../../../../core/api/types/types.genre';
import { getAllGenres } from '../../../../../core/api/requests/request.genre';
import getFilterBarStyles from './FilterBar.styles';

interface FilterBarProps {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const theme = useTheme();
  const styles = getFilterBarStyles(theme);

  const [genres, setGenres] = useState<GenreDto[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        if (Array.isArray(data)) {
          setGenres(data);
        }
      } catch {
        setGenres([]);
      }
    };

    fetchGenres();
  }, []);

  const filterFields = [
    {
      name: 'genreId',
      label: 'Жанр',
      options: genres.map((g) => ({ value: g.id.toString(), label: g.name })),
      defaultLabel: 'Усі жанри',
    },
    {
      name: 'availableRate',
      label: 'Рейтинг вище, за ...',
      options: [30, 40, 50, 60, 70, 80, 90, 100].map((rate) => ({
        value: rate.toString(),
        label: rate.toString(),
      })),
      defaultLabel: 'Будь-який',
    },
    {
      name: 'duration',
      label: 'Тривалість',
      options: [
        { value: 'MaxDurationMinutes', label: '< 2 год' },
        { value: 'MinDurationMinutes', label: '> 2 год' },
      ],
      defaultLabel: 'Усі',
    },
    {
      name: 'availableInCinema',
      label: 'У кінотеатрі',
      options: [
        { value: 'true', label: 'Так' },
        { value: 'false', label: 'Ні' },
      ],
      defaultLabel: 'Усі',
    },
    {
      name: 'releaseYear',
      label: 'Рік виходу',
      options: Array.from({ length: 50 }, (_, i) => {
        const currentYear = new Date().getFullYear();
        const year = currentYear - i;
        return {
          value: year,
          label: year.toString(),
        };
      }),
      defaultLabel: 'Усі',
    },
  ];

  const handleChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container sx={styles.filterBarWrapper}>
      {filterFields.map((el) => (
        <Box key={el.name}>
          <Typography sx={styles.filterLabelText}>{el.label}</Typography>
          <Select
            value={filters[el.name] ?? ''}
            onChange={handleChange}
            name={el.name}
            displayEmpty
            sx={styles.filterBarSelector}>
            <MenuItem value="">
              <em>{el.defaultLabel}</em>
            </MenuItem>
            {el.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ))}
    </Container>
  );
};

export default FilterBar;
