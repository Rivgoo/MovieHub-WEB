import React, { useState, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  useTheme,
  Alert,
  CircularProgress,
  useMediaQuery,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import SearchBar from './SearchBar.tsx';
import SuggestionItem from './SuggestionItem.tsx';
import { ContentDto } from '../../../../../core/api/types/types.content.ts';
import getStyles from './SearchForm.styles.ts';
import apiClient from '../../../../../core/api/client.ts';
import FilterBar from '../FilterBar/FilterBar.tsx';

function debounce<F extends (...args: any[]) => void>(fn: F, ms: number): F {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  }) as F;
}

interface Props {
  setSearchQuery: (query: string | undefined) => void;
}

const SearchForm: React.FC<Props> = ({ setSearchQuery }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:900px)');

  const [movieQuery, setMovieQuery] = useState('');
  const [options, setOptions] = useState<readonly ContentDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchOptions = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setOptions([]);
      return;
    }
    setIsLoadingOptions(true);
    setError(null);
    const params: { SearchTerms: string; pageSize?: number } = {
      SearchTerms: trimmedQuery,
      pageSize: 10,
    };

    try {
      const response = await apiClient.get<{ items: ContentDto[] }>(
        '/contents/filter',
        { params }
      );
      const items = response.data?.items ?? [];
      setOptions(items);
    } catch (err) {
      setOptions([]);
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  const debouncedFetch = useMemo(
    () => debounce(fetchOptions, 500),
    [fetchOptions]
  );

  const handleInputChange = (_: React.SyntheticEvent, value: string) => {
    setMovieQuery(value);
    if (value.trim()) {
      debouncedFetch(value);
    } else {
      setOptions([]);
      setSearchQuery(undefined);
      setSearchQuery(undefined);
    }
  };

  const handleOptionSelect = (
    _: React.SyntheticEvent,
    value: string | ContentDto | null
  ) => {
    if (value && typeof value !== 'string' && value.id) {
      navigate(`/film/${value.id}`);
    }
  };

  const handleSubmit = async () => {
    const trimmedQuery = movieQuery.trim();
    setError(null);
    setIsSubmitting(true);

    try {
      const filterQuery = Object.entries(filters)
        .filter(([_, v]) => v !== '')
        .map(([k, v]) => {
          switch (k) {
            case 'availableRate':
              return `MinRating=${v}`;
            case 'genreId':
              return `GenreIds=${v}`;
            case 'availableInCinema':
              return `HasSessions=${v}`;
            default:
              return `${k}=${v}`;
          }
        })
        .join('&');

      const apiQuery = `?SearchTerms=${encodeURIComponent(trimmedQuery)}&${filterQuery}&pageSize=10&pageIndex=1`;
      setSearchQuery(apiQuery);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={styles.searchFormWrapper}>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        sx={styles.searchFormForm}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={styles.searchFormTitle}>
          Пошук фільму
        </Typography>

        <Typography variant="body1" sx={styles.searchFormSubText}>
          {isSmallScreen
            ? 'Введіть назву для пошуку.'
            : 'Введіть назву фільму. Це допоможе знайти відповідний результат.'}
        </Typography>

        <Autocomplete
          freeSolo
          disableClearable
          options={options.slice(0, 3)}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : (option?.title ?? '')
          }
          inputValue={movieQuery}
          onInputChange={handleInputChange}
          onChange={handleOptionSelect}
          loading={isLoadingOptions}
          loadingText="Завантаження..."
          noOptionsText="Фільм не знайдено"
          sx={styles.searchFormAutoComplete}
          slotProps={{
            paper: { sx: styles.searchFormDropdownPaper },
          }}
          renderOption={(props, option) => (
            <SuggestionItem
              key={option.id}
              props={props}
              option={option}
              styles={styles}
            />
          )}
          renderInput={(params) => (
            <SearchBar
              params={params}
              isSubmitting={isSubmitting || isLoadingOptions}
              onSubmit={handleSubmit}
              styles={styles}
            />
          )}
        />

        {error && (
          <Alert severity="error" sx={styles.searchFormErrorBox}>
            {error}
          </Alert>
        )}

        {isSubmitting && !isLoadingOptions && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} color="primary" />
          </Box>
        )}

        <FilterBar filters={filters} setFilters={setFilters} />
      </Box>
    </Container>
  );
};

export default SearchForm;
