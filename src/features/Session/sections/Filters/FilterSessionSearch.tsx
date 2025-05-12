import { Box, SelectChangeEvent, useTheme } from '@mui/material';
import FilterSessionSearchStyles from './FilterSessionSearch.styles';
import SelectField from '../../../../shared/components/SelectFilter/SelectField';
import { useState } from 'react';
// import { getAllGenres } from '../../../../core/api/genreApi';

type Props = {};

// type FilterSessionFieldKeys = {
//   MinStartTime: string;
//   MaxStartTime: string;
//   HasAvailableSeats: boolean;
//   MinTicketPrice: number;
//   MaxTicketPrice: number;
//   CinemaHallId: number;
//   Status: 'Ongoing' | 'Ended' | 'Scheduled';
// };

type FilterSessionFieldKeys = {
  MinStartTime: string;
  MaxStartTime: string;
  HasAvailableSeats: string;
  MinTicketPrice: string;
  MaxTicketPrice: string;
  CinemaHallId: string;
  Status: 'Ongoing' | 'Ended' | 'Scheduled' | '';
};

export default function FilterSessionSearch({}: Props) {
  const theme = useTheme();
  const styles = FilterSessionSearchStyles(theme);

  const defaultQuery = {
    MinStartTime: '',
    MaxStartTime: '',
    HasAvailableSeats: true,
    MinTicketPrice: 60,
    MaxTicketPrice: 600,
    CinemaHallId: 1,
    Status: '',
  };

  const [filter, setFilter] = useState<FilterSessionFieldKeys>({
    MinStartTime: '',
    MaxStartTime: '',
    HasAvailableSeats: '',
    MinTicketPrice: '',
    MaxTicketPrice: '',
    CinemaHallId: '',
    Status: '',
  });

  // const fetchGenres = async () => {
  //   const response = await getAllGenres();
  //   return response.map((el) => {
  //     return { value: el.id, label: el.name };
  //   });
  // };

  // const genreOptions = fetchGenres();

  // useEffect(() => {
  //   const fetchGenres = async () => {
  //     const response = await getAllGenres();
  //     return response.map((el) => {
  //       return { value: el.id, label: el.name };
  //     });
  //   };
  //   fetchGenres();
  // }, []);

  const timeOptions = [
    { value: '08:00', label: '8:00' },
    { value: '10:00', label: '10:00' },
    { value: '12:00', label: '12:00' },
    { value: '14:00', label: '14:00' },
    { value: '16:00', label: '16:00' },
    { value: '18:00', label: '18:00' },
    { value: '20:00', label: '20:00' },
    { value: '22:00', label: '22:00' },
  ];

  const priceOptions = [
    { value: '60', label: '60 грн' },
    { value: '120', label: '120 грн' },
    { value: '200', label: '200 грн' },
    { value: '600', label: '600 грн' },
  ];

  const hallOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5 (VIP)' },
  ];

  const seatOption = [
    { value: 'true', label: 'Є' },
    { value: 'false', label: 'Немає' },
  ];

  // const formatOptions = [
  //   { value: '1', label: '2D' },
  //   { value: '2', label: '3D' },
  // ];

  const statusOptions = [
    { value: 'Ongoing', label: 'Поточний' },
    { value: 'Ended', label: 'Закінчився' },
    { value: 'Scheduled', label: 'Відкладений' },
  ];

  const handleChange = (e: SelectChangeEvent<string>) => {
    // onFilterChange(e.target.name as FilterSessionFieldKeys, e.target.value);
    console.log(e.target.value);
  };

  return (
    <Box
      sx={styles.filterSessionWrapper}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}>
      <SelectField
        label="Час, з"
        name="timeAfter"
        value={filter.MinStartTime || 'any'}
        onChange={handleChange}
        options={timeOptions}
      />
      <SelectField
        label="Час, по"
        name="timeBefore"
        value={filter.MaxStartTime || 'any'}
        onChange={handleChange}
        options={timeOptions}
      />
      <SelectField
        label="Місця"
        name="seats"
        value={`${filter.HasAvailableSeats}` || 'any'}
        onChange={handleChange}
        options={seatOption}
      />

      <SelectField
        label="Ціна"
        name="price"
        value={`${filter.MinTicketPrice}` || 'any'}
        onChange={handleChange}
        options={priceOptions}
      />
      <SelectField
        label="Зал"
        name="hall"
        value={`${filter.CinemaHallId}` || 'any'}
        onChange={handleChange}
        options={hallOptions}
      />
      {/* <SelectField
        label="Формат"
        name="Формат"
        value={`${filter.time}` || 'any'}
        onChange={handleChange}
        options={formatOptions}
      /> */}
      <SelectField
        label="Статус"
        name="status"
        value={`${filter.Status}` || 'any'}
        onChange={handleChange}
        options={statusOptions}
      />
    </Box>
  );
}
