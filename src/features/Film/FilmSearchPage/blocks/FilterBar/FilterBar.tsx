import {
  Box,
  Container,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { GenreDto } from '../../../../../core/api/types/types.genre';
import { getAllGenres } from '../../../../../core/api/requests/request.genre';
import getStyles from './FilterBar.styles';

interface FiltersState {
  genreId: string;
  availableRate: string;
  availableInCinema: string;
  [key: string]: string;
}

const FilterBar = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filterFields = [
    {
      name: 'genreId',
      label: 'Жанр',
      options: genres.map((g) => ({ value: g.id.toString(), label: g.name })),
      defaultLabel: 'Усі жанри',
    },
    {
      name: 'availableRate',
      label: 'Рейтинг',
      options: [30, 40, 50, 60, 70, 80, 90, 100].map((rate) => ({
        value: rate.toString(),
        label: rate.toString(),
      })),
      defaultLabel: 'Будь-який',
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
  ];

  const handleChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        if (Array.isArray(data)) {
          setGenres(data);
        }
      } catch (error) {
        setGenres([]);
      }
    };

    fetchGenres();
  }, []);

  return (
    <Container sx={styles.wraper}>
      <FormControl fullWidth sx={styles.form}>
        {filterFields.map((el) => (
          <Box key={el.name}>
            <Typography>{el.label}</Typography>
            <Select
              value={filters[el.name] ?? ''}
              onChange={handleChange}
              name={el.name}
              displayEmpty
              sx={styles.selector}>
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
      </FormControl>
    </Container>
  );
};

export default FilterBar;
