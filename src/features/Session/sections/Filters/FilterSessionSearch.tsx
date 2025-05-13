import {
  Box,
  SelectChangeEvent,
  Slider,
  Typography,
  useTheme,
} from '@mui/material';
import FilterSessionSearchStyles from './FilterSessionSearch.styles';
import SelectField from '../../../../shared/components/SelectFilter/SelectField';
import { useState } from 'react';
import { PrimaryButton } from '../../../../shared/components/Buttons';

type Props = {};

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

  const timeOptions = [
    { value: 0, label: '08:00' },
    { value: 1, label: '12:00' },
    { value: 2, label: '16:00' },
    { value: 3, label: '20:00' },
    { value: 4, label: '00:00' },
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

  const [value, setValue] = useState<number[]>([0, 7]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <Box
      sx={styles.filterSessionWrapper}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}>
      {/* <SelectField
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
      /> */}

      <Box sx={styles.boxSliderContainerWrapper}>
        <Typography sx={styles.selectorLabelText}>Час</Typography>
        <Box sx={styles.sliderWrapper}>
          <Slider
            getAriaLabel={() => 'Time range'}
            value={value}
            onChange={handleSliderChange}
            valueLabelDisplay="off"
            sx={styles.sliderSelector}
            step={1}
            min={0}
            max={4}
            marks={timeOptions}
          />
        </Box>
      </Box>
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
      <Box sx={{ height: '100%' }}>
        <Box sx={{ flex: 1 }}></Box>
        <PrimaryButton type="submit">
          <Typography>Шукати</Typography>
        </PrimaryButton>
      </Box>
    </Box>
  );
}
