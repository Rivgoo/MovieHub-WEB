// import {
//   Container,
//   FormControl,
//   MenuItem,
//   Select,
//   SelectChangeEvent,
//   useTheme,
// } from '@mui/material';
// import { useEffect, useState } from 'react';

// import { GetAllGenresResponse } from '../../../../../core/api/types/types.genre';
// import { getAllGenres } from '../../../../../core/api/requests/request.genre';
// import getStyles from './FilterBar.styles';

// type Props = {};

// interface FiltersState {
//   genreId: GetAllGenresResponse | undefined;
//   availableRates: number[];
//   availableInCinemaOptions: { id: number; label: string; value: boolean }[];
// }

// const FilterBar = (props: Props) => {
//   const theme = useTheme();
//   const styles = getStyles(theme);

//   const [selectedFilters, setSelectedFiler] = useState<FiltersState>({
//     genreId: undefined,
//     availableRates: [],
//     availableInCinemaOptions: [],
//   });

//   const [filtersData, setFiltersData] = useState<FiltersState>({
//     genreId: undefined,
//     availableRates: [30, 40, 50, 60, 70, 80, 90, 100],
//     availableInCinemaOptions: [
//       { id: 1, label: 'Так', value: true },
//       { id: 2, label: 'Ні', value: false },
//     ],
//   });

//   // const [selectedGenreId, setSelectedGenreId] = useState<string>('');

//   const handleChoseFilterOption = (event: SelectChangeEvent<string>) => {
//     const { name, value } = event.target;
//     setSelectedFiler((prev) => ({ ...prev, [name]: value }));
//   };

//   useEffect(() => {
//     const fetchFilters = async () => {
//       const genresResult: GetAllGenresResponse = await getAllGenres();
//       try {
//         if (Array.isArray(genresResult)) {
//           setFiltersData((prev) => ({
//             ...prev,
//             genres: genresResult,
//           }));
//         } else {
//           setFiltersData((prev) => ({ ...prev, genres: [] }));
//         }
//       } catch (error) {
//         setFiltersData((prev) => ({ ...prev, genres: [] }));
//       }
//     };

//     fetchFilters();
//   }, []);

//   return (
//     <Container sx={styles.wraper}>
//       <FormControl fullWidth sx={styles.form}>
//         {/* Genres */}
//         <Select
//           labelId="genre-select-label"
//           value={selectedFilters}
//           label="Жанр"
//           name="genreId"
//           onChange={handleChoseFilterOption}
//           displayEmpty
//           sx={styles.selector}>
//           <MenuItem value="" sx={styles.selectorItem}>
//             <em>None</em>
//           </MenuItem>
//           {selectedFilters?.genreId?.map((el) => (
//             <MenuItem
//               key={el.id}
//               value={`genres: [${el.name}]`}
//               sx={styles.selectorItem}>
//               {el.name}
//             </MenuItem>
//           ))}
//         </Select>
//         {/* <FormHelperText>Select a genre</FormHelperText> */}
//         {/* Rate */}
//         <Select
//           value={selectedFilters}
//           onChange={handleChoseFilterOption}
//           displayEmpty
//           sx={styles.selector}>
//           <MenuItem value="" sx={styles.selectorItem}>
//             <em>None</em>
//           </MenuItem>
//           {filtersData?.availableRates?.map((el) => (
//             <MenuItem
//               key={el}
//               value={`availableRates: [${el}]`}
//               sx={styles.selectorItem}>
//               {el}
//             </MenuItem>
//           ))}
//         </Select>
//         {/* Avaliable in cinema */}
//         <Select
//           value={selectedFilters}
//           onChange={handleChoseFilterOption}
//           displayEmpty
//           sx={styles.selector}>
//           <MenuItem value="" sx={styles.selectorItem}>
//             <em>None</em>
//           </MenuItem>
//           {filtersData?.availableInCinemaOptions?.map((el) => (
//             <MenuItem
//               key={el.id}
//               value={`availableInCinemaOptions:${el.value}`}
//               sx={styles.selectorItem}>
//               {el.label}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </Container>
//   );
// };

// export default FilterBar;

import {
  Box,
  Container,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { GenreDto } from '../../../../../core/api/types/types.genre';
import { getAllGenres } from '../../../../../core/api/requests/request.genre';
import getStyles from './FilterBar.styles';

interface FiltersState {
  genreId: string;
  availableRate: string;
  availableInCinema: string;
}

const FilterBar = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [filters, setFilters] = useState<FiltersState>({
    genreId: '',
    availableRate: '',
    availableInCinema: '',
  });

  const handleChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        if (Array.isArray(data)) {
          setGenres(data);
        }
      } catch (error) {
        setGenres([]);
      }
    };

    fetchGenres();
  }, []);

  return (
    <Container sx={styles.wraper}>
      <FormControl fullWidth sx={styles.form}>
        <Box>
          {/* Жанр */}
          <Typography>Жанр</Typography>
          <Select
            value={filters.genreId}
            onChange={handleChange}
            name="genreId"
            displayEmpty
            sx={styles.selector}>
            <MenuItem value="">
              <em>Усі жанри</em>
            </MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          {/* Рейтинг */}
          <Typography>Рейтинг</Typography>
          <Select
            value={filters.availableRate}
            onChange={handleChange}
            name="availableRate"
            displayEmpty
            sx={styles.selector}>
            <MenuItem value="">
              <em>Будь-який</em>
            </MenuItem>
            {[30, 40, 50, 60, 70, 80, 90, 100].map((rate) => (
              <MenuItem key={rate} value={rate.toString()}>
                {rate}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box>
          {/* У кінотеатрі */}
          <Typography>У кінотеатрі</Typography>
          <Select
            value={filters.availableInCinema}
            onChange={handleChange}
            name="availableInCinema"
            displayEmpty
            sx={styles.selector}>
            <MenuItem value="">
              <em>Усі</em>
            </MenuItem>
            <MenuItem value="true">Так</MenuItem>
            <MenuItem value="false">Ні</MenuItem>
          </Select>
        </Box>
      </FormControl>
    </Container>
  );
};

export default FilterBar;
