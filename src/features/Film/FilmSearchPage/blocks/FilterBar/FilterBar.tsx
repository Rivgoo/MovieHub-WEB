import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ApiGenreResponse, SuccessResponse } from './types';

type Props = {};

const FilterBar = (props: Props) => {
  const [filtersValues, setFiltersValues] = useState<string>(() => {
    return localStorage.getItem('filters') || '';
  });

  const [genres, setGenres] = useState<SuccessResponse[]>([]);

  useEffect(() => {
    handleApiResponse();
  }, []);

  const handleApiResponse = async (): Promise<void> => {
    try {
      const response = await fetch('/your-endpoint');
      const status = response.status;
      const data = await response.json();

      if (status === 200) {
        const apiResponse: Extract<ApiGenreResponse, { status: 200 }> = {
          status,
          data,
        };
        setGenres(apiResponse.data);
      } else if (status === 401 || status === 403) {
        const apiResponse: Extract<ApiGenreResponse, { status: 401 | 403 }> = {
          status,
          data,
        };
        console.error('API Error:', apiResponse.data.detail);
      } else {
        console.warn('Unexpected status code:', status);
      }
    } catch (error) {
      console.error('Network or parsing error:', error);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    const selected = event.target.value;
    setFiltersValues(selected);
    localStorage.setItem('filters', selected);
  };

  return (
    <Container maxWidth="sm">
      <Box>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={filtersValues}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Genre filter' }}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {/* {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.name}>
                {genre.name}
              </MenuItem>
            ))} */}
          </Select>
          <FormHelperText>Select a genre</FormHelperText>
        </FormControl>
      </Box>
    </Container>
  );
};

export default FilterBar;
