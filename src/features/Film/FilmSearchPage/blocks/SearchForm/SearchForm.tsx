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
import { ContentDto } from '../../../../../core/api/types/types.content.ts';
import getStyles from './SearchForm.styles.ts';
import apiClient from '../../../../../core/api/client.ts';
import { searchContent } from '../../../../../core/api/requests.content.ts';

function debounce<F extends (...args: any[]) => void>(fn: F, ms: number): F {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  }) as F;
}

interface Props {
  onSearchResults: (results: ContentDto[]) => void;
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
      setError('Будь ласка, введіть назву фільму.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const results = await searchContent(trimmedQuery);

      if (results.length === 0) {
        setError('Фільм не знайдено.');
      }

      onSearchResults(results);
    } catch (err) {
      let msg = 'Сталася помилка при пошуку. Спробуйте ще раз.';
      if (axios.isAxiosError(err)) {
        const ax = err as AxiosError<ApiError>;
        msg = ax.response?.data?.description || ax.message || msg;
      }
      setError(msg);
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

// import React, { useState, useMemo, useCallback } from 'react';
// import {
//   Container,
//   Typography,
//   Box,
//   useTheme,
//   Alert,
//   CircularProgress,
//   useMediaQuery,
//   Autocomplete,
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import SearchBar from './SearchBar.tsx';
// import SuggestionItem from './SuggestionItem.tsx';
// import { ApiError } from '../../../../../core/api/types/types.error.ts';
// import { ContentDto } from '../../../../../core/api/types/types.content.ts';
// import getStyles from './SearchForm.styles.ts';
// import { searchContent } from '../../../../../core/api/searchContent.ts';

// function debounce<F extends (...args: any[]) => void>(fn: F, ms: number): F {
//   let timer: ReturnType<typeof setTimeout>;
//   return ((...args: any[]) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => fn(...args), ms);
//   }) as F;
// }

// interface Props {
//   onSearchResults: (results: ContentDto[]) => void;
// }

// const SearchForm: React.FC<Props> = ({ onSearchResults }) => {
//   const theme = useTheme();
//   const styles = getStyles(theme);
//   const [options, setOptions] = useState<ContentDto[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<ApiError | null>(null);
//   const [inputValue, setInputValue] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate();

//   const handleInputChange = (_: React.SyntheticEvent, value: string) => {
//     setInputValue(value);
//     debouncedSearch(value);
//   };

//   const handleOptionSelect = (
//     _: React.SyntheticEvent,
//     value: string | ContentDto | null
//   ) => {
//     if (typeof value === 'object' && value !== null) {
//       navigate(`/films/${value.id}`);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!inputValue.trim()) return;
//     try {
//       setIsSubmitting(true);
//       setError(null);
//       const results = await searchContent(inputValue.trim());
//       onSearchResults(results); // ✅ передаємо в FilmGrid
//     } catch (err) {
//       setError({
//         code: 'search_failed',
//         description: 'Не вдалося знайти фільми.',
//         errorType: 'Failure',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const fetchSuggestions = async (value: string) => {
//     if (!value) return;
//     try {
//       const results = await searchContent(value);
//       setOptions(results);
//     } catch {
//       setOptions([]);
//     }
//   };

//   const debouncedSearch = useMemo(() => debounce(fetchSuggestions, 400), []);

//   return (
//     <Container>
//       <Box sx={styles.wrapper}>
//         <Autocomplete
//           freeSolo
//           options={options}
//           getOptionLabel={(option) =>
//             typeof option === 'string' ? option : option.title
//           }
//           renderOption={(props, option) => (
//             <SuggestionItem props={props} option={option} styles={styles} />
//           )}
//           onInputChange={handleInputChange}
//           onChange={handleOptionSelect}
//           renderInput={(params) => (
//             <SearchBar
//               params={params}
//               isSubmitting={isSubmitting}
//               onSubmit={handleSubmit}
//               styles={styles}
//             />
//           )}
//         />
//         {error && (
//           <Alert severity="error" sx={styles.errorBox}>
//             {error.description}
//           </Alert>
//         )}
//       </Box>
//     </Container>
//   );
// };

// export default SearchForm;
