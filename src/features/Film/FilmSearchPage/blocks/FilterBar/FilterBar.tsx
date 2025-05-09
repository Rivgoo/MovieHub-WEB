import React, { useEffect, useState } from 'react';
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  useTheme,
  Typography,
} from '@mui/material';
import { getAllGenres } from '../../../../../core/api/requests/request.genre';
import getFilterBarStyles from './FilterBar.styles';
import { GenreDto } from '../../../../../core/api/types/types.genre';

type FilterBarFieldKeys =
  | 'rating'
  | 'releaseYear'
  | 'duration'
  | 'genreId'
  | 'isNowShowing'
  | 'ageRating';

interface FilterBarProps {
  filters: Record<string, string>;
  onFilterChange: (filterBarKey: FilterBarFieldKeys, value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const theme = useTheme();
  const styles = getFilterBarStyles(theme);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);

  useEffect(() => {
    const fetchGenresData = async () => {
      setIsLoadingGenres(true);
      try {
        const fetchedGenres = await getAllGenres();
        setGenres(fetchedGenres);
      } catch (error) {
      } finally {
        setIsLoadingGenres(false);
      }
    };
    fetchGenresData();
  }, []);

  const handleChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    onFilterChange(name as FilterBarFieldKeys, value);
  };

  const ratingOptions = Array.from(new Array(10), (_, i) => {
    const apiValue = 10 - i;
    const displayValue = apiValue * 10;
    return { value: apiValue.toString(), label: `${displayValue}+` };
  }).reverse();

  const releaseYears = Array.from(
    new Array(40),
    (_, i) => new Date().getFullYear() - i
  );

  const durationOptions = [
    { value: 'any', label: 'Всі' },
    { value: 'lt120', label: '< 2 год' },
    { value: 'gte120', label: '≥ 2 год' },
  ];

  const nowShowingOptions = [
    { value: 'any', label: 'Всі' },
    { value: 'true', label: 'Є' },
    { value: 'false', label: 'Немає' },
  ];

  const ageRatingOptions = [
    { value: 'any', label: 'Всі' },
    { value: '0', label: '0+' },
    { value: '6', label: '6+' },
    { value: '12', label: '12+' },
    { value: '16', label: '16+' },
    { value: '18', label: '18+' },
  ];

  const renderSelect = (
    filterBarKey: FilterBarFieldKeys,
    labelText: string,
    initialValueFromProps: string | undefined = filters[filterBarKey],
    options: Array<{ value: string; label: string } | GenreDto>,
    isLoadingOptions?: boolean
  ) => {
    let valueToRender =
      initialValueFromProps !== undefined ? initialValueFromProps : 'any';

    if (filterBarKey === 'genreId') {
      if (isLoadingOptions || (!isLoadingOptions && genres.length === 0)) {
        if (valueToRender !== 'any') {
          valueToRender = 'any';
        }
      } else if (!isLoadingOptions && genres.length > 0) {
        const isValidGenreId = genres.some(
          (g) => g.id.toString() === initialValueFromProps
        );
        if (
          initialValueFromProps !== 'any' &&
          initialValueFromProps !== undefined &&
          !isValidGenreId
        ) {
          valueToRender = 'any';
        }
      }
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          minWidth: 150,
          maxWidth: 200,
        }}>
        <Typography variant="caption" sx={styles.filterLabelText}>
          {labelText}
        </Typography>
        <Select
          aria-label={labelText}
          name={filterBarKey}
          value={valueToRender}
          onChange={handleChange}
          sx={styles.filterBarSelector}
          MenuProps={{ PaperProps: {} }}
          disabled={isLoadingOptions}
          size="small">
          <MenuItem value="any" sx={styles.filterBarSelectorItem}>
            Всі
          </MenuItem>

          {isLoadingOptions && (
            <MenuItem disabled sx={styles.filterBarSelectorItem}>
              Завантаження...
            </MenuItem>
          )}

          {!isLoadingOptions &&
            options.map((opt) => {
              if ('id' in opt && 'name' in opt) {
                return (
                  <MenuItem
                    key={opt.id}
                    value={opt.id.toString()}
                    sx={styles.filterBarSelectorItem}>
                    {opt.name}
                  </MenuItem>
                );
              }
              if ('value' in opt && 'label' in opt && opt.value !== 'any') {
                return (
                  <MenuItem
                    key={opt.value}
                    value={opt.value as string}
                    sx={styles.filterBarSelectorItem}>
                    {opt.label as string}
                  </MenuItem>
                );
              }
              return null;
            })}
        </Select>
      </Box>
    );
  };

  const mapYearsToValueLabel = (years: number[]) =>
    years.map((year) => ({ value: year.toString(), label: year.toString() }));

  return (
    <Box sx={styles.filterBarWrapper}>
      {renderSelect(
        'genreId',
        'Жанр',
        filters.genreId,
        genres,
        isLoadingGenres
      )}
      {renderSelect(
        'releaseYear',
        'Рік',
        filters.releaseYear,
        mapYearsToValueLabel(releaseYears)
      )}
      {renderSelect('rating', 'Рейтинг %', filters.rating, ratingOptions)}
      {renderSelect(
        'duration',
        'Тривалість',
        filters.duration,
        durationOptions
      )}
      {renderSelect(
        'isNowShowing',
        'В кіно',
        filters.isNowShowing,
        nowShowingOptions
      )}
      {renderSelect('ageRating', 'Вік', filters.ageRating, ageRatingOptions)}
    </Box>
  );
};

export default FilterBar;
