import {
  AutocompleteRenderInputParams,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchFieldSectionStyles from '../SearchFieldSection.styles';

type Props = {
  isLoading: boolean;
  params: AutocompleteRenderInputParams;
};

const RenderInput = ({ isLoading, params }: Props) => {
  const theme = useTheme();
  const styles = SearchFieldSectionStyles(theme);
  return (
    <TextField
      {...params}
      sx={styles.renderInput}
      inputRef={params.InputProps.ref}
      placeholder="Пошук фільмів..."
      variant="outlined"
      InputProps={{
        ...params.InputProps,
        sx: {
          alignItems: 'center',
          paddingRight: '0 !important',
        },
        endAdornment: (
          <InputAdornment position="end" sx={{ height: '100%', p: 0 }}>
            <IconButton
              type="submit"
              sx={styles.renderInputButton}
              disabled={isLoading}>
              {/* {props.isLoading ? (
                <CircularProgress size={20} />
              ) : ( */}
              <SearchIcon />
              {/* )} */}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default RenderInput;
