// import React, { useState, useMemo, useEffect } from 'react';
// import {
//   Container,
//   Typography,
//   Box,
//   useTheme,
//   Alert,
//   CircularProgress,
//   useMediaQuery,
//   Autocomplete,
//   Paper,
//   TextField,
//   InputAdornment,
//   IconButton,
//   Button,
// } from '@mui/material';
// import FilterBar from '../FilterBar/FilterBar.tsx';
// import SearchIcon from '@mui/icons-material/Search';
// import RotateLeftIcon from '@mui/icons-material/RotateLeft';
// import { ContentDto } from '../../../../../core/api/types/types.content.ts';
// import { searchContent } from '../../../../../core/api/requests/request.content.ts';
// import { useNavigate } from 'react-router-dom';
// import getStyles from './SearchForm.styles.ts';
// import SuggestionItem from './SuggestionItem.tsx';

// type FilterBarKeys =
//   | 'rating'
//   | 'releaseYear'
//   | 'duration'
//   | 'genreId'
//   | 'isNowShowing'
//   | 'ageRating';

// function debounce<F extends (...args: any[]) => void>(fn: F, ms: number): F {
//   let timeoutId: ReturnType<typeof setTimeout>;
//   return function (this: any, ...args: any[]) {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => fn.apply(this, args), ms);
//   } as F;
// }

// interface Props {
//   onSearchTermChange: (query: string) => void;
//   filters: Record<string, string>;
//   onFilterChange: (filterBarKey: FilterBarKeys, value: string) => void;
//   onResetFilters: () => void;
//   initialSearchTerm?: string;
// }

// const SearchForm: React.FC<Props> = ({
//   onSearchTermChange,
//   filters,
//   onFilterChange,
//   onResetFilters,
//   initialSearchTerm = '',
// }) => {
//   const theme = useTheme();
//   const styles = getStyles(theme);
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

//   const [inputValue, setInputValue] = useState<string>(initialSearchTerm);
//   const [options, setOptions] = useState<readonly (ContentDto | string)[]>([]);
//   const [loadingSuggestions, setLoadingSuggestions] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setInputValue(initialSearchTerm);
//   }, [initialSearchTerm]);

//   const fetchSuggestions = async (query: string) => {
//     if (query.length < 2) {
//       setOptions([]);
//       setLoadingSuggestions(false);
//       return;
//     }
//     setLoadingSuggestions(true);
//     setError(null);
//     try {
//       const suggestionQueryParts = new URLSearchParams();
//       suggestionQueryParts.append('SearchTerm', query);
//       suggestionQueryParts.append('pageSize', '5');
//       suggestionQueryParts.append('pageIndex', '1');

//       const response = await searchContent(suggestionQueryParts.toString());
//       setOptions(response.items);
//     } catch (err: any) {
//       const errorDetail =
//         err.response?.data?.detail ||
//         err.message ||
//         'Failed to fetch suggestions';
//       setError(errorDetail);
//       setOptions([]);
//     } finally {
//       setLoadingSuggestions(false);
//     }
//   };

//   const debouncedFetchSuggestions = useMemo(
//     () => debounce(fetchSuggestions, 300),
//     []
//   );

//   const handleLocalInputChange = (
//     _event: React.SyntheticEvent,
//     newValue: string,
//     reason: string
//   ) => {
//     setInputValue(newValue);
//     if (reason === 'input' && newValue) {
//       debouncedFetchSuggestions(newValue);
//     } else if (reason === 'clear' || (reason === 'input' && !newValue)) {
//       setOptions([]);
//     }
//   };

//   const handleSubmit = () => {
//     onSearchTermChange(inputValue.trim());
//     setOptions([]);
//   };

//   const handleOptionSelect = (
//     _event: React.SyntheticEvent,
//     value: string | ContentDto | null
//   ) => {
//     if (value && typeof value !== 'string' && value.id) {
//       navigate(`/film/${value.id}`);
//     } else if (typeof value === 'string') {
//       setInputValue(value);
//       onSearchTermChange(value.trim());
//       setOptions([]);
//     }
//   };

//   const hasActiveFilters = Object.values(filters).some(
//     (value) => value && value !== 'any' && value !== '' && value !== 'Всі'
//   );

//   return (
//     <Container sx={styles.searchFormWrapper}>
//       <Typography variant="h4" component="h1" sx={styles.searchFormTitle}>
//         Шукаєте фільм?
//       </Typography>
//       {!isSmallScreen ? (
//         <Typography variant="subtitle1" sx={styles.searchFormSubText}>
//           Введіть назву і ми обов'язково знайдемо його для вас.
//         </Typography>
//       ) : (
//         <Typography variant="subtitle1" sx={styles.searchFormSubText}>
//           Введіть назву для пошуку.
//         </Typography>
//       )}
//       <Box
//         sx={styles.searchFormForm}
//         component="form"
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSubmit();
//         }}>
//         <Box sx={styles.searchFormInputArea}>
//           <Autocomplete
//             freeSolo
//             autoHighlight
//             sx={styles.searchFormAutoComplete}
//             options={options}
//             getOptionLabel={(option) =>
//               typeof option === 'string' ? option : option.title
//             }
//             inputValue={inputValue}
//             onInputChange={handleLocalInputChange}
//             onChange={handleOptionSelect}
//             loading={loadingSuggestions && inputValue.length >= 2}
//             PaperComponent={(params) => (
//               <Paper
//                 elevation={3}
//                 {...params}
//                 sx={
//                   loadingSuggestions &&
//                   inputValue.length >= 2 &&
//                   options.length === 0
//                     ? styles.searchFormDropdownPaperLoading
//                     : styles.searchFormDropdownPaper
//                 }
//               />
//             )}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 placeholder="Вводьте тут..."
//                 variant="outlined"
//                 InputProps={{
//                   ...params.InputProps,
//                   endAdornment: (
//                     <>
//                       {loadingSuggestions && inputValue.length >= 2 ? (
//                         <CircularProgress
//                           color="inherit"
//                           size={20}
//                           sx={{ mr: 1 }}
//                         />
//                       ) : null}
//                       {params.InputProps.endAdornment}
//                       <InputAdornment position="end" sx={{ height: '100%' }}>
//                         <IconButton
//                           type="submit"
//                           sx={styles.searchFormSubmitButton}
//                           disabled={loadingSuggestions}
//                           onClick={handleSubmit}>
//                           <SearchIcon />
//                         </IconButton>
//                       </InputAdornment>
//                     </>
//                   ),
//                 }}
//               />
//             )}
//             renderOption={(htmlLiProps, optionData) => (
//               <SuggestionItem
//                 htmlLiProps={
//                   htmlLiProps as React.HTMLAttributes<HTMLLIElement> & {
//                     key?: React.Key;
//                   }
//                 }
//                 option={optionData as ContentDto | string}
//               />
//             )}
//             filterOptions={(x) => x}
//             noOptionsText=""
//             loadingText=""
//           />
//         </Box>
//         {error && (
//           <Alert
//             severity="error"
//             sx={{
//               ...styles.searchFormErrorBox,
//               mt: 2,
//               width: '100%',
//               maxWidth: { sm: 'sm' },
//             }}>
//             {error}
//           </Alert>
//         )}
//       </Box>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           width: '100%',
//           mt: 2,
//           gap: 2,
//         }}>
//         <FilterBar filters={filters} onFilterChange={onFilterChange} />
//         {(hasActiveFilters ||
//           (!!initialSearchTerm && inputValue !== initialSearchTerm)) && (
//           <Button
//             variant="outlined"
//             onClick={onResetFilters}
//             startIcon={<RotateLeftIcon />}
//             size="small"
//             sx={{ maxWidth: 'max-content' }}>
//             Скинути фільтри
//           </Button>
//         )}
//       </Box>
//     </Container>
//   );
// };
// export default SearchForm;

import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  useTheme,
  Alert,
  CircularProgress,
  useMediaQuery,
  Autocomplete,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
import FilterBar from '../FilterBar/FilterBar.tsx';
import SearchIcon from '@mui/icons-material/Search';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import SuggestionItem from './SuggestionItem.tsx';
import { ContentDto } from '../../../../../core/api/types/types.content.ts';
import { searchContent } from '../../../../../core/api/requests/request.content.ts';
import { useNavigate } from 'react-router-dom';
import getStyles from './SearchForm.styles.ts';

type FilterBarKeys =
  | 'rating'
  | 'releaseYear'
  | 'duration'
  | 'genreId'
  | 'isNowShowing'
  | 'ageRating';

function debounce<F extends (...args: any[]) => void>(fn: F, ms: number): F {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  } as F;
}

interface Props {
  onSearchTermChange: (query: string) => void;
  filters: Record<string, string>;
  onFilterChange: (filterBarKey: FilterBarKeys, value: string) => void;
  onResetFilters: () => void;
  initialSearchTerm?: string;
}

const SearchForm: React.FC<Props> = ({
  onSearchTermChange,
  filters,
  onFilterChange,
  onResetFilters,
  initialSearchTerm = '',
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [inputValue, setInputValue] = useState<string>(initialSearchTerm);
  const [options, setOptions] = useState<readonly (ContentDto | string)[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setInputValue(initialSearchTerm);
  }, [initialSearchTerm]);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setOptions([]);
      setLoadingSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    setError(null);
    try {
      const suggestionQueryParts = new URLSearchParams();
      suggestionQueryParts.append('SearchTerm', query);
      suggestionQueryParts.append('pageSize', '5');
      suggestionQueryParts.append('pageIndex', '1');

      const response = await searchContent(suggestionQueryParts.toString());
      setOptions(response.items);
    } catch (err: any) {
      const errorDetail =
        err.response?.data?.detail ||
        err.message ||
        'Failed to fetch suggestions';
      setError(errorDetail);
      setOptions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 300),
    []
  );

  const handleLocalInputChange = (
    _event: React.SyntheticEvent,
    newValue: string,
    reason: string
  ) => {
    setInputValue(newValue);
    if (reason === 'input' && newValue) {
      debouncedFetchSuggestions(newValue);
    } else if (reason === 'clear' || (reason === 'input' && !newValue)) {
      setOptions([]);
    }
  };

  const handleSubmit = () => {
    onSearchTermChange(inputValue.trim());
    setOptions([]);
  };

  const handleOptionSelect = (
    _event: React.SyntheticEvent,
    value: string | ContentDto | null
  ) => {
    if (value && typeof value !== 'string' && value.id) {
      navigate(`/film/${value.id}`);
    } else if (typeof value === 'string') {
      setInputValue(value);
      onSearchTermChange(value.trim());
      setOptions([]);
    }
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== 'any' && value !== '' && value !== 'Всі'
  );

  return (
    <Container sx={styles.searchFormWrapper}>
      <Typography variant="h4" component="h1" sx={styles.searchFormTitle}>
        Шукаєте фільм?
      </Typography>
      {!isSmallScreen ? (
        <Typography variant="subtitle1" sx={styles.searchFormSubText}>
          Введіть назву і ми обов'язково знайдемо його для вас.
        </Typography>
      ) : (
        <Typography variant="subtitle1" sx={styles.searchFormSubText}>
          Введіть назву для пошуку.
        </Typography>
      )}
      <Box
        sx={styles.searchFormForm}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
        <Box sx={styles.searchFormInputArea}>
          <Autocomplete
            freeSolo
            autoHighlight
            sx={styles.searchFormAutoComplete}
            options={options}
            getOptionLabel={
              (option) =>
                typeof option === 'string'
                  ? option
                  : (option as ContentDto).title // Безпечне звернення до title
            }
            inputValue={inputValue}
            onInputChange={handleLocalInputChange}
            onChange={handleOptionSelect}
            loading={loadingSuggestions && inputValue.length >= 2}
            PaperComponent={(params) => (
              <Paper
                elevation={3}
                {...params}
                sx={
                  loadingSuggestions &&
                  inputValue.length >= 2 &&
                  options.length === 0
                    ? styles.searchFormDropdownPaperLoading
                    : styles.searchFormDropdownPaper
                }
              />
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for movies..."
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingSuggestions && inputValue.length >= 2 ? (
                        <CircularProgress
                          color="inherit"
                          size={20}
                          sx={{ mr: 1 }}
                        />
                      ) : null}
                      {params.InputProps.endAdornment}
                      <InputAdornment position="end" sx={{ height: '100%' }}>
                        <IconButton
                          type="submit"
                          sx={styles.searchFormSubmitButton}
                          disabled={loadingSuggestions}
                          onClick={handleSubmit}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
            renderOption={(htmlLiAttributes, optionData) => {
              // Використовуємо ваш попередній робочий підхід для key
              const itemKey =
                typeof optionData === 'string'
                  ? optionData
                  : (optionData as ContentDto).id !== undefined
                    ? (optionData as ContentDto).id
                    : JSON.stringify(optionData); // Як крайній варіант, якщо ID може бути undefined

              return (
                <SuggestionItem
                  key={itemKey}
                  htmlLiProps={
                    htmlLiAttributes as React.HTMLAttributes<HTMLLIElement> & {
                      key?: React.Key;
                    }
                  } // MUI може передавати key тут
                  option={optionData as ContentDto | string}
                />
              );
            }}
            filterOptions={(x) => x}
            noOptionsText=""
            loadingText=""
          />
        </Box>
        {error && (
          <Alert
            severity="error"
            sx={{
              ...styles.searchFormErrorBox,
              mt: 2,
              width: '100%',
              maxWidth: { sm: 'sm' },
            }}>
            {error}
          </Alert>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          mt: 2,
          gap: 2,
        }}>
        <FilterBar filters={filters} onFilterChange={onFilterChange} />
        {(hasActiveFilters ||
          (!!initialSearchTerm && inputValue !== initialSearchTerm)) && (
          <Button
            variant="outlined"
            onClick={onResetFilters}
            startIcon={<RotateLeftIcon />}
            size="small"
            sx={{ maxWidth: 'max-content' }}>
            Скинути фільтри
          </Button>
        )}
      </Box>
    </Container>
  );
};
export default SearchForm;
