import { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Slider,
  ToggleButton,
  Typography,
  useTheme,
} from '@mui/material';
import getModalFiltersStyles from './ModalFilters.styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  GlowButton,
  PrimaryButton,
} from '../../../../shared/components/Buttons';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getAllCinemaHalls } from '../../../../core/api/requests/request.cinemahall';

type FilterSessionFieldKeys = {
  MinStartTime: string;
  MaxStartTime: string;
  HasAvailableSeats: string;
  MinTicketPrice: string;
  Format: '2D' | '3D' | '';
  CinemaHallId: string;
  Status: 'Ongoing' | 'Ended' | 'Scheduled' | '';
};

type DateOption = {
  value: string;
  label: string;
  weekday: string;
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

export default function ModalFilters() {
  const theme = useTheme();
  const styles = getModalFiltersStyles(theme);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [filter, setFilter] = useState<FilterSessionFieldKeys>(getDefaultQuery);
  const [timeInterval, setTimeInterval] = useState<[number, number]>([0, 4]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    hallFilter: false,
    firstLoadingPage: true,
  });
  const [dates, setDates] = useState<DateOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedHall, setSelectedHall] = useState<string>('any');
  const [selectedSeats, setSelectedSeats] = useState<string>('all');
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [priceSelectAll, setPriceSelectAll] = useState(true);
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
    if (!isLoading.firstLoadingPage) return;

    const genDates = Array.from({ length: 10 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);

      const value = d.toISOString().split('T')[0];
      const weekday = new Intl.DateTimeFormat('uk-UA', {
        weekday: 'long',
      }).format(d);
      const label = new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
      }).format(d);
      const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      return { value, label: cap(label), weekday: cap(weekday) };
    });
    setDates(genDates);

    const params = new URLSearchParams(searchParams.toString());
    let minRaw = params.get('MinStartTime');
    let maxRaw = params.get('MaxStartTime');
    const today = genDates[0].value;

    if (!minRaw || !maxRaw) {
      minRaw = `${today}T08:00`;
      maxRaw = `${today}T23:00`;
      navigate(
        {
          pathname: '/session-search',
          search: `?MinStartTime=${minRaw}&MaxStartTime=${maxRaw}`,
        },
        { replace: true }
      );
    }

    const [minDate, minTime] = minRaw.split('T');
    const [maxDate, maxTime] = maxRaw.split('T');
    setSelectedDate(minDate);
    const minIdx = timeOptions.findIndex((o) => o.label === minTime);
    const maxIdx = timeOptions.findIndex((o) => o.label === maxTime);
    const safeMin = minIdx >= 0 ? minIdx : 0;
    const safeMax = maxIdx >= 0 ? maxIdx : 4;
    setTimeInterval([safeMin, safeMax]);

    setFilter({
      MinStartTime: String(safeMin),
      MaxStartTime: String(safeMax),
      HasAvailableSeats: params.get('HasAvailableSeats') ?? '',
      MinTicketPrice: params.get('MinTicketPrice') ?? '',
      Format: (params.get('Format') as '' | '2D' | '3D') ?? '',
      CinemaHallId: params.get('CinemaHallId') ?? '',
      Status:
        (params.get('Status') as '' | 'Ongoing' | 'Ended' | 'Scheduled') ?? '',
    });

    setSelectedHall(params.get('CinemaHallId') ?? 'any');
    const seatParam = params.get('HasAvailableSeats');
    setSelectedSeats(
      seatParam === 'true' || seatParam === 'false' ? seatParam : 'all'
    );
    const minPrice = params.get('MinTicketPrice');
    const maxPrice = params.get('MaxTicketPrice');
    if (!minPrice && !maxPrice) {
      setSelectedPrices([]);
      setPriceSelectAll(true);
    } else if (minPrice && maxPrice && minPrice !== maxPrice) {
      setSelectedPrices([minPrice, maxPrice]);
      setPriceSelectAll(false);
    } else {
      const p = minPrice || maxPrice!;
      setSelectedPrices([p]);
      setPriceSelectAll(false);
    }

    setIsLoading((p) => ({ ...p, firstLoadingPage: false }));
  }, [searchParams, isLoading.firstLoadingPage]);

  const handleDateChange = (e: SelectChangeEvent<string>) => {
    setSelectedDate(e.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleHallChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setSelectedHall(value);
    setFilter((prev) => ({
      ...prev,
      CinemaHallId: value === 'any' ? '' : value,
    }));
  };

  const handleSeatsToggle = (value: string) => {
    setSelectedSeats(value);
    setFilter((prev) => ({
      ...prev,
      HasAvailableSeats: value === 'all' ? '' : value,
    }));
  };

  const handlePriceToggle = (value: string) => {
    if (value === 'all') {
      setPriceSelectAll(true);
      setSelectedPrices([]);
    } else {
      setPriceSelectAll(false);
      setSelectedPrices((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    }
  };

  const isFormatActive = (value: string) => selectedSeats === value;
  const isPriceActive = (value: string) =>
    priceSelectAll ? value === 'all' : selectedPrices.includes(value);

  const handleSliderChange = (_: Event, newVal: number[]) => {
    setTimeInterval(newVal as [number, number]);
    setFilter((f) => ({
      ...f,
      MinStartTime: String(newVal[0]),
      MaxStartTime: String(newVal[1]),
    }));
  };

  const handleSubmit = () => {
    const baseDate = selectedDate || new Date().toISOString().split('T')[0];
    const [minIdx, maxIdx] = timeInterval;
    const qp = new URLSearchParams();

    qp.set('MinStartTime', `${baseDate}T${timeOptions[minIdx].label}`);
    qp.set('MaxStartTime', `${baseDate}T${timeOptions[maxIdx].label}`);

    Object.entries(filter).forEach(([k, v]) => {
      if (v !== '' && k !== 'MinStartTime' && k !== 'MaxStartTime') {
        qp.set(k, v);
      }
    });

    if (!priceSelectAll) {
      const ps = selectedPrices.map(Number).sort((a, b) => a - b);
      if (ps.length === 1) {
        qp.set('MinTicketPrice', String(ps[0]));
        qp.set('MaxTicketPrice', String(ps[0]));
      } else if (ps.length > 1) {
        qp.set('MinTicketPrice', String(ps[0]));
        qp.set('MaxTicketPrice', String(ps[ps.length - 1]));
      }
    }

    navigate({
      pathname: '/session-search',
      search: `?${qp.toString()}`,
    });
    handleClose();
  };

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    setFilter(getDefaultQuery());
    setTimeInterval([0, 4]);
    setSelectedDate(today);
    setSelectedHall('any');
    setSelectedSeats('all');
    setSelectedPrices([]);
    setPriceSelectAll(true);

    const qp = new URLSearchParams();
    qp.set('MinStartTime', `${today}T08:00`);
    qp.set('MaxStartTime', `${today}T23:00`);

    navigate({
      pathname: '/session-search',
      search: `?${qp.toString()}`,
    });
    handleClose();
  };

  return (
    <Box>
      <PrimaryButton onClick={handleOpen} sx={styles.openModalButton}>
        <FilterAltIcon sx={styles.openModalButtonIcon} />
      </PrimaryButton>

      <Modal open={open} onClose={handleClose} sx={styles.modalContainer}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          sx={styles.modalFormBox}>
          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Дата
            </Typography>
            <Select
              fullWidth
              value={selectedDate}
              onChange={handleDateChange}
              size="small"
              sx={styles.selectorSelector}>
              {dates.map((date) => (
                <MenuItem key={date.value} value={date.value}>
                  {date.weekday}, {date.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

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

          <Box sx={styles.boxRowContainerWrapper}>
            <Box sx={styles.selectorWrapper}>
              <Typography variant="caption" sx={styles.selectorLabelText}>
                Місця
              </Typography>
              <Box sx={styles.buttonGroup}>
                {['all', ...seatsOptions.map((f) => f.value)].map((value) => (
                  <ToggleButton
                    key={value}
                    value={value}
                    onClick={() => handleSeatsToggle(value)}
                    sx={styles.toggleButton(isFormatActive(value))}>
                    {value === 'all'
                      ? 'Всі'
                      : seatsOptions.find((f) => f.value === value)?.label}
                  </ToggleButton>
                ))}
              </Box>
            </Box>

            <Box sx={styles.selectorWrapper}>
              <Typography variant="caption" sx={styles.selectorLabelText}>
                Зал
              </Typography>
              <Select
                fullWidth
                value={selectedHall}
                onChange={handleHallChange}
                size="small"
                sx={styles.selectorSelector}>
                <MenuItem value="any">Всі</MenuItem>
                {hallOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Ціна, грн
            </Typography>
            <Box sx={styles.buttonGroup}>
              {['all', ...priceOptions.map((p) => p.value)].map((value) => (
                <ToggleButton
                  key={value}
                  value={value}
                  onClick={() => handlePriceToggle(value)}
                  sx={styles.toggleButton(isPriceActive(value))}>
                  {value === 'all'
                    ? 'Всі'
                    : priceOptions.find((p) => p.value === value)?.label}
                </ToggleButton>
              ))}
            </Box>
          </Box>

          <Divider sx={styles.divider} />

          <Box sx={styles.modalControlButtonBox}>
            <GlowButton onClick={handleReset} sx={styles.modalControlButton}>
              <Typography>Скинути</Typography>
            </GlowButton>
            <PrimaryButton type="submit" sx={{ width: '100%' }}>
              <Typography>Шукати</Typography>
            </PrimaryButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
