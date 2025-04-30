import React, { memo } from 'react';
import {
  AutocompleteRenderInputParams,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { SearchSharp } from '@mui/icons-material';
import getStyles from './FilmSearchPage.styles.ts';
interface SearchBarProps {
  params: AutocompleteRenderInputParams;
  isSubmitting: boolean;
  onSubmit: () => void;
  styles: ReturnType<typeof getStyles>;
}
const SearchBar: React.FC<SearchBarProps> = memo(
  ({ params, isSubmitting, onSubmit, styles }) => {
    return (
      <TextField
        {...params}
        margin="normal"
        placeholder="Введіть назву фільму..."
        fullWidth
        sx={styles.inputArea}
        disabled={isSubmitting}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                <IconButton
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  edge="end"
                  sx={styles.submitButton}>
                  <SearchSharp />
                </IconButton>
              </InputAdornment>
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    );
  }
);
SearchBar.displayName = 'SearchBar';
export default SearchBar;
