import { Autocomplete, Box, Paper, useTheme } from '@mui/material';
import React, { useState } from 'react';
import SearchFieldSectionStyles from './SearchFieldSection.styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RenderInput from './components/RenderInput';
import { ContentDto } from '../../../../../core/api/types/types.content';
import { searchContent } from '../../../../../core/api/requests/request.content';
import RenderOptions from './components/renderOptions';

function debounce<F extends (...args: any[]) => void>(fn: F, ms: number): F {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  } as F;
}

const SearchFieldSection = () => {
  const theme = useTheme();
  const styles = SearchFieldSectionStyles(theme);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<ContentDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOptions = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await searchContent(`pageSize=5&SearchTerms=${query}`);
      setOptions(response.items);
    } catch (err) {
      // setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchOptions, 300);

  const handleInput = (
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

  const handleOptionSelect = (
    _event: React.SyntheticEvent,
    value: string | ContentDto | null
  ) => {
    if (value && typeof value !== 'string' && value.id) {
      navigate(`/film/${value.id}`);
    } else if (typeof value === 'string') {
      setInputValue(value);
      setOptions([]);
    }
  };

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (inputValue.trim()) {
      params.set('SearchTerms', inputValue.trim());
    } else {
      params.delete('SearchTerms');
    }

    navigate({
      pathname: '/film-search',
      search: params.toString(),
    });
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      sx={styles.searchFormWrapper}>
      <Autocomplete
        freeSolo
        sx={styles.searchFormAutoComplete}
        options={options}
        filterOptions={(x) => x}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : (option as ContentDto).title
        }
        inputValue={inputValue}
        onInputChange={handleInput}
        onChange={handleOptionSelect}
        loading={isLoading && inputValue.length >= 2}
        loadingText={null}
        noOptionsText={null}
        PaperComponent={({ children }) => (
          <Paper sx={styles.autocompletePaper}>{children}</Paper>
        )}
        renderInput={(params) => (
          <RenderInput params={params} isLoading={isLoading} />
        )}
        renderOption={(htmlLiAttributes, optionData) => {
          const itemKey =
            typeof optionData === 'string'
              ? optionData
              : (optionData.id ?? JSON.stringify(optionData));

          return (
            <RenderOptions
              key={itemKey}
              htmlLiProps={
                htmlLiAttributes as React.HTMLAttributes<HTMLLIElement> & {
                  key?: React.Key;
                }
              }
              option={optionData}
            />
          );
        }}
      />
    </Box>
  );
};

export default SearchFieldSection;
