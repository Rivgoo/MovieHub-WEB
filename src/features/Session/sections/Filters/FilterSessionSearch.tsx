import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import FilterSessionSearchStyles from './FilterSessionSearch.styles';
import { useEffect, useState } from 'react';
import {
  FillBorderButton,
  GlowButton,
  PrimaryButton,
} from '../../../../shared/components/Buttons';
import Slider from '@mui/material/Slider';
import { getAllCinemaHalls } from '../../../../core/api/requests/request.cinemahall';
import { useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

type Props = {};

type FilterSessionFieldKeys = {
  MinStartTime: string;
  MaxStartTime: string;
  HasAvailableSeats: string;
  MinTicketPrice: string;
  MaxTicketPrice?: string;
  Format: '2D' | '3D' | '';
  CinemaHallId: string;
  Status: 'Ongoing' | 'Ended' | 'Scheduled' | '';
};

const getDefaultQuery = (): FilterSessionFieldKeys => ({
  MinStartTime: '',
  MaxStartTime: '',
  HasAvailableSeats: '',
  MinTicketPrice: '',
  MaxTicketPrice: '',
  Format: '',
  CinemaHallId: '',
  Status: 'Ongoing',
});

export default function FilterSessionSearch({}: Props) {
  const theme = useTheme();
  const styles = FilterSessionSearchStyles(theme);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState<FilterSessionFieldKeys>(getDefaultQuery);
  const [timeInterval, setTimeInterval] = useState<[number, number]>([0, 4]);
  const [isLoading, setIsLoading] = useState({
    hallFilter: false,
    firstLoadingPage: true,
  });

  const [selectedHall, setSelectedHall] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<string>('');
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('Ongoing');

  const [hallOptions, setHallOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const timeOptions = [
    { value: 0, label: '08:00' },
    { value: 1, label: '12:00' },
    { value: 2, label: '16:00' },
    { value: 3, label: '20:00' },
    { value: 4, label: '23:00' },
  ];
  const priceOptions = ['60', '120', '200', '600'].map((v) => ({
    value: v,
    label: v,
  }));
  const seatsOptions = [
    { value: 'true', label: 'Є' },
    { value: 'false', label: 'Немає' },
  ];

  const statusOptions = [
    { value: 'Ongoing', label: 'Поточний' },
    { value: 'Ended', label: 'Закінчився' },
    { value: 'Scheduled', label: 'Заплановані' },
  ];

  const toLocalYMD = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    (async () => {
      setIsLoading((p) => ({ ...p, hallFilter: true }));
      try {
        const halls = await getAllCinemaHalls();
        setHallOptions(
          halls.map((h) => ({
            value: String(h.id),
            label: h.name,
          }))
        );
      } finally {
        setIsLoading((p) => ({ ...p, hallFilter: false }));
      }
    })();
  }, []);

  useEffect(() => {
    if (!isLoading.firstLoadingPage && !searchParams.toString()) return;

    const params = new URLSearchParams(searchParams.toString());
    const today =
      params.get('MinStartTime')?.split('T')[0] || toLocalYMD(new Date());
    const min = params.get('MinStartTime')?.split('T')[1] || '08:00';
    const max = params.get('MaxStartTime')?.split('T')[1] || '23:00';

    const minIdx = timeOptions.findIndex((o) => o.label === min);
    const maxIdx = timeOptions.findIndex((o) => o.label === max);
    setTimeInterval([minIdx >= 0 ? minIdx : 0, maxIdx >= 0 ? maxIdx : 4]);

    const hallParam = params.get('CinemaHallId') || '';
    setSelectedHall(hallParam);

    const seatParam = params.get('HasAvailableSeats') || '';
    setSelectedSeats(seatParam);

    const statusParam =
      (params.get('Status') as '' | 'Ongoing' | 'Ended' | 'Scheduled') || '';
    setSelectedStatus(statusParam);

    const minPrice = params.get('MinTicketPrice');
    const maxPrice = params.get('MaxTicketPrice');

    if (!minPrice && !maxPrice) {
      setSelectedPrices([]);
    } else if (minPrice && maxPrice && minPrice !== maxPrice) {
      const pricesFromParams = priceOptions
        .filter((p) => +p.value >= +minPrice && +p.value <= +maxPrice)
        .map((p) => p.value);
      setSelectedPrices(pricesFromParams);
    } else {
      const p = minPrice || maxPrice!;
      if (p) {
        setSelectedPrices([p]);
      } else {
        setSelectedPrices([]);
      }
    }

    setFilter((prev) => ({
      ...prev,
      MinStartTime: `${today}T${min}`,
      MaxStartTime: `${today}T${max}`,
      CinemaHallId: hallParam,
      HasAvailableSeats: seatParam,
      MinTicketPrice: minPrice || '',
      MaxTicketPrice: maxPrice || '',
      Format: (params.get('Format') as '' | '2D' | '3D') || '',
      Status: statusParam,
    }));

    setIsLoading((prev) => ({ ...prev, firstLoadingPage: false }));
  }, [searchParams, isLoading.firstLoadingPage]);

  const handleHallChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setSelectedHall(value);
    setFilter((prev) => ({
      ...prev,
      CinemaHallId: value,
    }));
  };

  const handleSeatsChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setSelectedSeats(value);
    setFilter((prev) => ({
      ...prev,
      HasAvailableSeats: value,
    }));
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setSelectedStatus(value);
    setFilter((prev) => ({
      ...prev,
      Status: value as '' | 'Ongoing' | 'Ended' | 'Scheduled',
    }));
  };

  const handleMultiplePriceChange = (
    e: SelectChangeEvent<typeof selectedPrices>
  ) => {
    const value = e.target.value as string[];

    if (value.includes('')) {
      setSelectedPrices([]);
      setFilter((prev) => ({
        ...prev,
        MinTicketPrice: '',
        MaxTicketPrice: '',
      }));
    } else {
      const sorted = [...value].sort((a, b) => +a - +b);
      setSelectedPrices(value);
      if (sorted.length === 1) {
        setFilter((prev) => ({
          ...prev,
          MinTicketPrice: sorted[0],
          MaxTicketPrice: sorted[0],
        }));
      } else if (sorted.length > 1) {
        setFilter((prev) => ({
          ...prev,
          MinTicketPrice: sorted[0],
          MaxTicketPrice: sorted[sorted.length - 1],
        }));
      } else {
        setFilter((prev) => ({
          ...prev,
          MinTicketPrice: '',
          MaxTicketPrice: '',
        }));
      }
    }
  };

  const handleSliderChange = (_: Event, newVal: number | number[]) => {
    const newTimeArray = newVal as [number, number];
    setTimeInterval(newTimeArray);
    const currentMinStartTime =
      filter.MinStartTime || `${toLocalYMD(new Date())}T08:00`;
    const currentMaxStartTime =
      filter.MaxStartTime || `${toLocalYMD(new Date())}T23:00`;

    setFilter((f) => ({
      ...f,
      MinStartTime: `${currentMinStartTime.split('T')[0]}T${timeOptions[newTimeArray[0]].label}`,
      MaxStartTime: `${currentMaxStartTime.split('T')[0]}T${timeOptions[newTimeArray[1]].label}`,
    }));
  };

  const handleSubmit = () => {
    const baseDate =
      filter.MinStartTime.split('T')[0] || toLocalYMD(new Date());
    const qp = new URLSearchParams();

    qp.set('MinStartTime', `${baseDate}T${timeOptions[timeInterval[0]].label}`);
    qp.set('MaxStartTime', `${baseDate}T${timeOptions[timeInterval[1]].label}`);

    if (filter.CinemaHallId) qp.set('CinemaHallId', filter.CinemaHallId);
    if (filter.HasAvailableSeats)
      qp.set('HasAvailableSeats', filter.HasAvailableSeats);
    if (filter.Status) qp.set('Status', filter.Status);
    if (filter.Format) qp.set('Format', filter.Format);

    if (filter.MinTicketPrice) qp.set('MinTicketPrice', filter.MinTicketPrice);
    if (
      filter.MaxTicketPrice &&
      filter.MaxTicketPrice !== filter.MinTicketPrice
    ) {
      qp.set('MaxTicketPrice', filter.MaxTicketPrice);
    } else if (
      filter.MinTicketPrice &&
      filter.MaxTicketPrice === filter.MinTicketPrice
    ) {
      qp.set('MaxTicketPrice', filter.MinTicketPrice);
    }

    setSearchParams(qp, { replace: true });
  };

  const handleReset = () => {
    const todayDate = new Date();
    const today = toLocalYMD(todayDate);
    const defaultState = getDefaultQuery();
    setFilter({
      ...defaultState,
      MinStartTime: `${today}T08:00`,
      MaxStartTime: `${today}T23:00`,
    });
    setTimeInterval([0, 4]);
    setSelectedHall('');
    setSelectedSeats('');
    setSelectedStatus('');
    setSelectedPrices([]);

    const qp = new URLSearchParams();
    qp.set('MinStartTime', `${today}T08:00`);
    qp.set('MaxStartTime', `${today}T23:00`);

    setSearchParams(qp, { replace: true });
  };

  const [expanded, setExpanded] = useState(false);

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <Box
      sx={styles.filterSessionWrapper}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
      <Accordion expanded={expanded}>
        <AccordionSummary
          onClick={(e) => e.stopPropagation()}
          expandIcon={null}
          sx={styles.boxSliderContainerWrapper}>
          <Box sx={styles.selectorWrapper}>
            <Typography sx={styles.selectorLabelText}>
              <br />
            </Typography>
            <FillBorderButton
              size="small"
              onClick={handleToggle}
              sx={{
                maxHeight: '42px',
                border: `1px solid ${theme.palette.primary.dark}`,
              }}>
              Час
            </FillBorderButton>
          </Box>

          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Місця
            </Typography>
            <Select
              name="HasAvailableSeats"
              fullWidth
              value={selectedSeats}
              onChange={handleSeatsChange}
              displayEmpty
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="">Всі</MenuItem>
              {seatsOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Ціна
            </Typography>
            <Select<string[]>
              fullWidth
              multiple
              value={selectedPrices}
              onChange={handleMultiplePriceChange}
              displayEmpty={selectedPrices.length === 0}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Всі</em>;
                }
                return selected.join(', ');
              }}
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="">
                <em>Всі</em>
              </MenuItem>
              {priceOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Зал
            </Typography>
            <Select
              name="CinemaHallId"
              fullWidth
              value={selectedHall}
              onChange={handleHallChange}
              displayEmpty
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="">Всі</MenuItem>
              {hallOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Статус
            </Typography>
            <Select
              name="Status"
              fullWidth
              value={selectedStatus}
              onChange={handleStatusChange}
              displayEmpty
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="">Всі</MenuItem>
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={styles.formControlButtonBox}>
            <Typography sx={styles.selectorLabelText}>
              <br />
            </Typography>
            <Box sx={styles.formControlButton}>
              <GlowButton
                onClick={(e) => {
                  e.preventDefault();
                  handleReset();
                }}>
                <FilterAltOffIcon />
              </GlowButton>
            </Box>
          </Box>

          <Box sx={styles.formControlButtonBox}>
            <Typography sx={styles.selectorLabelText}>
              <br />
            </Typography>
            <Box sx={styles.formControlButton}>
              <PrimaryButton type="submit">
                <SearchIcon />
              </PrimaryButton>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            backgroundColor: theme.palette.secondary.main,
            px: '26px',
          }}>
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
        </AccordionDetails>
      </Accordion>

      {/* <Box sx={styles.boxSliderContainerWrapper}>
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

      <Box sx={styles.selectorWrapper}>
        <Typography variant="caption" sx={styles.selectorLabelText}>
          Місця
        </Typography>
        <Select
          name="HasAvailableSeats"
          fullWidth
          value={selectedSeats}
          onChange={handleSeatsChange}
          displayEmpty
          size="small"
          sx={styles.selectorSelector}>
          <MenuItem value="">Всі</MenuItem>
          {seatsOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={styles.selectorWrapper}>
        <Typography variant="caption" sx={styles.selectorLabelText}>
          Ціна
        </Typography>
        <Select<string[]>
          fullWidth
          multiple
          value={selectedPrices}
          onChange={handleMultiplePriceChange}
          displayEmpty={selectedPrices.length === 0}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Всі</em>;
            }
            return selected.join(', ');
          }}
          size="small"
          sx={styles.selectorSelector}>
          <MenuItem value="">
            <em>Всі</em>
          </MenuItem>
          {priceOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={styles.selectorWrapper}>
        <Typography variant="caption" sx={styles.selectorLabelText}>
          Зал
        </Typography>
        <Select
          name="CinemaHallId"
          fullWidth
          value={selectedHall}
          onChange={handleHallChange}
          displayEmpty
          size="small"
          sx={styles.selectorSelector}>
          <MenuItem value="">Всі</MenuItem>
          {hallOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={styles.selectorWrapper}>
        <Typography variant="caption" sx={styles.selectorLabelText}>
          Статус
        </Typography>
        <Select
          name="Status"
          fullWidth
          value={selectedStatus}
          onChange={handleStatusChange}
          displayEmpty
          size="small"
          sx={styles.selectorSelector}>
          <MenuItem value="">Всі</MenuItem>
          {statusOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={styles.formControlButtonBox}>
        <br />
        <Box sx={styles.formControlButton}>
          <GlowButton
            onClick={(e) => {
              e.preventDefault();
              handleReset();
            }}>
            <FilterAltOffIcon />
          </GlowButton>
        </Box>
      </Box>

      <Box sx={styles.formControlButtonBox}>
        <br />
        <Box sx={styles.formControlButton}>
          <PrimaryButton type="submit">
            <SearchIcon />
          </PrimaryButton>
        </Box>
      </Box> */}
    </Box>
  );
}
