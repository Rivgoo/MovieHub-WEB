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

import { GetAllGenresResponse } from '../../../../../core/api/types/types.genre';

type Props = {};

const FilterBar = (props: Props) => {
  return (
    <Container maxWidth="sm">
      <Box>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={{}}
            onChange={() => {}}
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
