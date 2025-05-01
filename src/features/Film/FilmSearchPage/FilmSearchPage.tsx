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

import Layout from '../../../shared/components/Layout.tsx';
import getStyles from './FilmSearchPage.styles.ts';
import { searchContent } from '../../../core/api/searchContent.ts';
import apiClient from '../../../core/api/client.ts';
import { ApiErrorResponse, ApiFilmResponse } from '../../../core/api/types.ts';
import SearchBar from './SearchBar.tsx';
import SuggestionItem from './SuggestionItem.tsx';

function debounce<F extends (...args: any[]) => void>(fn: F, ms: number): F {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  }) as F;
}

const FilmSearchPage: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:900px)');

  const [movieQuery, setMovieQuery] = useState('');
  const [options, setOptions] = useState<readonly ApiFilmResponse[]>([]);
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
    const params: { SearchTerms: string; MatchType?: string } = {
      SearchTerms: trimmedQuery,
    };
    if (trimmedQuery.length < 3) {
      params.MatchType = 'prefix';
    }
    try {
      const response = await apiClient.get<{ items: ApiFilmResponse[] }>(
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
    }
  };

  const handleOptionSelect = (
    _: React.SyntheticEvent,
    value: string | ApiFilmResponse | null
  ) => {
    if (value && typeof value !== 'string' && value.id) {
      navigate(`/film/${value.id}`);
    }
  };

  const handleSubmit = async () => {
    const trimmedQuery = movieQuery.trim();
    if (!trimmedQuery) {
      setError('Будь ласка, введіть назву фільму.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const results = await searchContent(trimmedQuery);

      const exactMatch = results.find(
        (f) => f.title.toLowerCase() === trimmedQuery.toLowerCase()
      );

      if (exactMatch) {
        navigate(`/film/${exactMatch.id}`);
      } else {
        setError('Фільм не знайдено');
      }
    } catch (err) {
      let msg = 'Сталася помилка при пошуку. Спробуйте ще раз.';
      if (axios.isAxiosError(err)) {
        const ax = err as AxiosError<ApiErrorResponse>;
        msg = ax.response?.data?.description || ax.message || msg;
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={styles.wrapper}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          sx={styles.form}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={styles.title}>
            Пошук фільму
          </Typography>
          <Typography variant="body1" sx={styles.subText}>
            {isSmallScreen
              ? 'Введіть назву для пошуку.'
              : 'Ми просимо вибачення, але ваші пошукові терміни не дали результатів. Будь ласка, спробуйте ще раз, використовуючи нові пошукові терміни.'}
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
    </Layout>
  );
};

export default FilmSearchPage;
