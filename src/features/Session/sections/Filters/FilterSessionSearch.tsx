import { Box, SelectChangeEvent, Typography, useTheme } from '@mui/material';
import FilterSessionSearchStyles from './FilterSessionSearch.styles';
import SelectField from '../../../../shared/components/SelectFilter/SelectField';
import { useEffect, useState } from 'react';
import {
  GlowButton,
  PrimaryButton,
} from '../../../../shared/components/Buttons';
import Slider from '@mui/material/Slider';
import { getAllCinemaHalls } from '../../../../core/api/requests/request.cinemahall';
import { useNavigate, useSearchParams } from 'react-router-dom';

type Props = {};

type FilterSessionFieldKeys = {
  MinStartTime: string;
  MaxStartTime: string;
  HasAvailableSeats: string;
  MinTicketPrice: string;
  Format: '2D' | '3D' | '';
  CinemaHallId: string;
  Status: 'Ongoing' | 'Ended' | 'Scheduled' | '';
};

const getDefaultQuery = (): FilterSessionFieldKeys => ({
  MinStartTime: '',
  MaxStartTime: '',
  HasAvailableSeats: '',
  MinTicketPrice: '',
  Format: '',
  CinemaHallId: '',
  Status: '',
});

export default function FilterSessionSearch({}: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = FilterSessionSearchStyles(theme);

  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<FilterSessionFieldKeys>(getDefaultQuery);
  const [timeInterval, setTimeInterval] = useState<number[]>([0, 4]);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    hallFilter: false,
    firstLoadingPage: true,
  });

  const timeOptions = [
    { value: 0, label: '08:00' },
    { value: 1, label: '12:00' },
    { value: 2, label: '16:00' },
    { value: 3, label: '20:00' },
    { value: 4, label: '00:00' },
  ];

  //
  const priceOptions = [
    { value: '60', label: '60 грн' },
    { value: '120', label: '120 грн' },
    { value: '200', label: '200 грн' },
    { value: '600', label: '600 грн' },
  ];

  //
  const seatOption = [
    { value: 'true', label: 'Є' },
    { value: 'false', label: 'Немає' },
  ];

  const [hallOptions, setHallOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const formatOptions = [
    { value: '2D', label: '2D' },
    { value: '3D', label: '3D' },
  ];
  //
  const statusOptions = [
    { value: 'Ongoing', label: 'Поточний' },
    { value: 'Ended', label: 'Закінчився' },
    { value: 'Scheduled', label: 'Заплановані' },
  ];

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      MinStartTime: timeInterval[0].toString(),
      MaxStartTime: timeInterval[1].toString(),
    }));

    const fetchFiltersOptions = async () => {
      try {
        setIsLoading((prev) => ({
          ...prev,
          hallFilter: true,
        }));
        const response = await getAllCinemaHalls();
        console.log(response);
        const arr = response.map((el) => {
          return { value: el.id.toString(), label: el.id.toString() };
        });
        setHallOptions(arr);
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.warn('Користувач неавторизований');
        }
      } finally {
        setIsLoading((prev) => ({
          ...prev,
          hallFilter: false,
        }));
      }
    };
    const fetchFilters = async () => {
      try {
        if (!isLoading.firstLoadingPage) return;

        const updatedFilter = { ...filter };

        Object.entries(filter).forEach(([key]) => {
          const value = searchParams.get(key) || '';
          updatedFilter[key as keyof FilterSessionFieldKeys] = value as any;
        });

        setFilter(updatedFilter);
        setIsLoading((prev) => ({
          ...prev,
          firstLoadingPage: false,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchFiltersOptions();
    fetchFilters();
  }, []);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (event: Event, newValue: number[]) => {
    setTimeInterval(newValue as number[]);
    setFilter((prev) => ({
      ...prev,
      MinStartTime: newValue[0].toString(),
      MaxStartTime: newValue[1].toString(),
    }));
  };

  const handleSubmit = async () => {
    const queryParams = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== '' && key !== 'Format') {
        queryParams.append(key, value);
      }
    });
    navigate({
      pathname: '/session-search',
      search: `?${queryParams.toString()}`,
    });
  };

  const handelResetFilters = () => {
    setFilter(getDefaultQuery());
    navigate({
      pathname: '/session-search',
      search: ``,
    });
  };

  return (
    <Box
      sx={styles.filterSessionWrapper}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
      <Box sx={styles.boxSliderContainerWrapper}>
        <Typography sx={styles.selectorLabelText}>Час</Typography>
        <Box sx={styles.sliderWrapper}>
          <Slider
            getAriaLabel={() => 'Time range'}
            value={timeInterval}
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
        name="HasAvailableSeats"
        value={filter.HasAvailableSeats}
        onChange={handleChange}
        options={seatOption}
      />

      <SelectField
        label="Ціна"
        name="MinTicketPrice"
        value={filter.MinTicketPrice}
        onChange={handleChange}
        options={priceOptions}
      />
      <SelectField
        label="Зал"
        name="CinemaHallId"
        value={filter.CinemaHallId}
        onChange={handleChange}
        options={
          isLoading.hallFilter ? [{ value: '1', label: '1' }] : hallOptions
        }
      />
      <SelectField
        label="Формат"
        name="Format"
        value={filter.Format}
        onChange={handleChange}
        options={formatOptions}
      />
      <SelectField
        label="Статус"
        name="Status"
        value={filter.Status}
        onChange={handleChange}
        options={statusOptions}
      />
      <Box sx={styles.modalControlButtonBox}>
        <br />
        <Box sx={styles.filterControlButton}>
          <GlowButton
            onClick={(e) => {
              e.preventDefault();
              handelResetFilters();
            }}>
            <Typography>Скинути</Typography>
          </GlowButton>
        </Box>
      </Box>
      <Box sx={styles.modalControlButtonBox}>
        <br />
        <Box sx={styles.filterControlButton}>
          <PrimaryButton type="submit">
            <Typography>Шукати</Typography>
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
