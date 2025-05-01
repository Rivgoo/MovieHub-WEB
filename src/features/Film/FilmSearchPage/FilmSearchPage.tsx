import React, { useState, useMemo } from 'react';
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
import { ApiErrorResponse, ApiFilmResponse } from '../../../core/api/types.ts';
import SearchBar from './SearchBar.tsx';
import SuggestionItem from './SuggestionItem.tsx';

// debounce-функція
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
  const [options, setOptions] = useState<ApiFilmResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const test: ApiFilmResponse[] = [
    {
      id: 1,
      title: 'string',
      description: 'string',
      rating: 1,
      releaseYear: 1,
      trailerUrl: 'string',
      posterUrl: 'string',
      durationMinutes: 1,
      genreIds: [1, 2],
      actorIds: [1, 2],
      createdAt: 'string',
      updatedAt: 'string',
    },
    {
      id: 2,
      title: 'string',
      description: 'string',
      rating: 1,
      releaseYear: 1,
      trailerUrl: 'string',
      posterUrl: 'string',
      durationMinutes: 1,
      genreIds: [1, 2],
      actorIds: [1, 2],
      createdAt: 'string',
      updatedAt: 'string',
    },
    {
      id: 3,
      title: 'string',
      description: 'string',
      rating: 1,
      releaseYear: 1,
      trailerUrl: 'string',
      posterUrl: 'string',
      durationMinutes: 1,
      genreIds: [1, 2],
      actorIds: [1, 2],
      createdAt: 'string',
      updatedAt: 'string',
    },
    {
      id: 4,
      title: 'string',
      description: 'string',
      rating: 1,
      releaseYear: 1,
      trailerUrl: 'string',
      posterUrl: 'string',
      durationMinutes: 1,
      genreIds: [1, 2],
      actorIds: [1, 2],
      createdAt: 'string',
      updatedAt: 'string',
    },
  ];

  // Фетч варіантів для Autocomplete
  const fetchOptions = async (q: string) => {
    try {
      const items = await searchContent(q);
      console.log(items);
      // setOptions(items);
      setOptions(test);
    } catch {
      setOptions([]);
    }
  };

  // Debounce для запитів
  const debouncedFetch = useMemo(() => debounce(fetchOptions, 500), []);

  // Обробка вводу
  const handleInputChange = (_: React.SyntheticEvent, value: string) => {
    setMovieQuery(value);
    if (value.trim()) debouncedFetch(value);
    else setOptions([]);
  };

  // Обробка вибору варіанта
  const handleOptionSelect = (
    _: React.SyntheticEvent,
    value: string | ApiFilmResponse
  ) => {
    if (typeof value !== 'string') {
      navigate(`/film/${value.id}`);
    }
  };

  // Пошук при сабміті
  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const results = await searchContent(movieQuery);
      const match = results.find(
        (f) => f.title.toLowerCase() === movieQuery.trim().toLowerCase()
      );
      if (!match) {
        setError('Фільм не знайдено');
      } else {
        navigate(`/film/${match.id}`);
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
            color="text.secondary"
            sx={styles.title}>
            Пошук фільму
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={styles.subText}>
            {isSmallScreen
              ? 'Будь ласка, спробуйте ще раз'
              : 'Ми просимо вибачення, але ваші пошукові терміни не дали результатів. Будь ласка, спробуйте ще раз, використовуючи нові пошукові терміни.'}
          </Typography>

          <Autocomplete
            freeSolo
            disableClearable
            clearIcon={null}
            options={options.slice(0, 3)}
            // getOptionLabel={(opt) =>
            //   typeof opt === 'string' ? opt : opt.title
            // }
            getOptionLabel={(option) => {
              // Handle string case for freeSolo input
              if (typeof option === 'string') {
                return option;
              }
              // Check if option exists and has a title, provide fallback
              if (option && typeof option.title === 'string') {
                return option.title;
              }
              // Return empty string or placeholder if title is missing
              console.warn('Option missing title:', option); // Log problematic options
              return '';
            }}
            inputValue={movieQuery}
            onInputChange={handleInputChange}
            onChange={handleOptionSelect}
            noOptionsText="Фільм не знайдено"
            sx={styles.autoComplete}
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
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                styles={styles}
              />
            )}
            slotProps={{
              paper: styles.slotProps,
            }}
          />

          {error && (
            <Alert severity="error" sx={styles.errorBox}>
              {error}
            </Alert>
          )}

          {isSubmitting && (
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
