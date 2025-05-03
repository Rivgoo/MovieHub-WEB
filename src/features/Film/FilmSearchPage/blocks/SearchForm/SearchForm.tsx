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
import axios, { AxiosError } from 'axios';

import SearchBar from './SearchBar.tsx';
import SuggestionItem from './SuggestionItem.tsx';
import { ApiError } from '../../../../../core/api/types/types.error.ts';
import {
  ContentDto,
  ContentFilterResponse,
} from '../../../../../core/api/types/types.content.ts';
import getStyles from './SearchForm.styles.ts';
import apiClient from '../../../../../core/api/client.ts';
import { searchContent } from '../../../../../core/api/requests/request.content.ts';

function debounce<F extends (...args: any[]) => void>(fn: F, ms: number): F {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  }) as F;
}

interface Props {
  onSearchResults: (results: ContentFilterResponse | null) => void;
}

const SearchForm: React.FC<Props> = ({ onSearchResults }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:900px)');

  const [movieQuery, setMovieQuery] = useState('');
  const [options, setOptions] = useState<readonly ContentDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

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
      onSearchResults(null);
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
    if (!trimmedQuery) {
      onSearchResults({
        items: [],
        pageIndex: 1,
        pageSize: 20,
        totalPages: 0,
        totalCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      });
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const apiQuery = `?SearchTerms=${encodeURIComponent(trimmedQuery)}&pageSize=20&pageIndex=1`;
      const results = await searchContent(apiQuery);
      onSearchResults(results);
    } catch (err) {
      let msg = 'Сталася помилка при пошуку. Спробуйте ще раз.';
      if (axios.isAxiosError(err)) {
        const ax = err as AxiosError<ApiError>;
        msg = (ax.response?.data as any)?.description || ax.message || msg;
      }
      setError(msg);
      onSearchResults({
        items: [],
        pageIndex: 1,
        pageSize: 0,
        totalPages: 0,
        totalCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={styles.wrapper}>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        sx={styles.form}>
        <Typography variant="h4" component="h1" gutterBottom sx={styles.title}>
          Пошук фільму
        </Typography>
        <Typography variant="body1" sx={styles.subText}>
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
          sx={styles.autoComplete}
          slotProps={{
            paper: { sx: styles.dropdownPaperStyles },
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
          <Alert severity="error" sx={styles.errorBox}>
            {error}
          </Alert>
        )}

        {isSubmitting && !isLoadingOptions && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} color="primary" />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SearchForm;
