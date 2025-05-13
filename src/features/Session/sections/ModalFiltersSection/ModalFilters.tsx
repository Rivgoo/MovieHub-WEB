import { useMemo, useState } from 'react';
import {
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  ToggleButton,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import getModalFiltersStyles from './ModalFilters.styles';
import {
  GlowButton,
  PrimaryButton,
} from '../../../../shared/components/Buttons';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

type Props = {};

type FilterModalFieldKeys = {
  MinStartTime: string;
  MaxStartTime: string;
  HasAvailableSeats: string;
  MinTicketPrice: string;
  MaxTicketPrice: string;
  CinemaHallId: string;
  Status: 'Ongoing' | 'Ended' | 'Scheduled' | '';
};

export default function ModalFilters({}: Props) {
  const theme = useTheme();
  const styles = getModalFiltersStyles(theme);

  const [filter, setFilter] = useState<FilterModalFieldKeys>({
    MinStartTime: '',
    MaxStartTime: '',
    HasAvailableSeats: '',
    MinTicketPrice: '',
    MaxTicketPrice: '',
    CinemaHallId: '',
    Status: '',
  });

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('any');
  const [selected, setSelected] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    console.log('sub');
    handleClose();
  };

  const handleChange = (e: SelectChangeEvent<string>) => {
    setSelectedValue(e.target.value);
  };

  const handleToggle = (value: string) => {
    if (value === 'all') {
      setSelectAll(true);
      setSelected([]);
    } else {
      setSelectAll(false);
      setSelected((prevSelected) => {
        const isSelected = prevSelected.includes(value);
        return isSelected
          ? prevSelected.filter((v) => v !== value)
          : [...prevSelected, value];
      });
    }
  };

  const activeMap = useMemo(() => {
    if (selectAll) return { all: true };
    return selected.reduce(
      (acc, val) => {
        acc[val] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
  }, [selected, selectAll]);

  const isActive = (value: string) => activeMap[value] === true;

  // const timeOptions = [
  //   { value: '08:00', label: '8:00' },
  //   { value: '10:00', label: '10:00' },
  //   { value: '12:00', label: '12:00' },
  //   { value: '14:00', label: '14:00' },
  //   { value: '16:00', label: '16:00' },
  //   { value: '18:00', label: '18:00' },
  //   { value: '20:00', label: '20:00' },
  //   { value: '22:00', label: '22:00' },
  // ];

  const timeOptions = [
    { value: 0, label: '08:00' },
    { value: 1, label: '12:00' },
    { value: 2, label: '16:00' },
    { value: 3, label: '20:00' },
    { value: 4, label: '00:00' },
  ];

  const hallOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5 (VIP)' },
  ];

  const formatOptions = [
    { value: '1', label: '2D' },
    { value: '2', label: '3D' },
  ];

  const priceOptions = [
    { value: '60', label: '60' },
    { value: '120', label: '120' },
    { value: '200', label: '200' },
    { value: '600', label: '600' },
  ];

  const statusOptions = [
    { value: 'Ongoing', label: 'Поточний' },
    { value: 'Ended', label: 'Закінчився' },
    { value: 'Scheduled', label: 'Відкладений' },
  ];

  const [value, setValue] = useState<number[]>([0, 7]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <Box>
      <PrimaryButton onClick={handleOpen} sx={styles.openModalButton}>
        <FilterAltIcon sx={styles.openModalButtonIcon} />
      </PrimaryButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-filter"
        aria-describedby="modal-filter-adaptive"
        sx={styles.modalContainer}>
        <Box
          sx={styles.modalFormBox}
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
          {/* Дата */}
          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Дата
            </Typography>
            <Select
              fullWidth
              name="format"
              value={selectedValue}
              onChange={handleChange}
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="any">Всі</MenuItem>
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Час: з / по */}
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

          {/* Формат / Зал */}
          <Box sx={styles.boxRowContainerWrapper}>
            <Box sx={styles.selectorWrapper}>
              <Typography variant="caption" sx={styles.selectorLabelText}>
                Формат
              </Typography>
              <Box sx={styles.buttonGroup}>
                {['all', ...formatOptions.map((f) => f.value)].map((value) => (
                  <ToggleButton
                    key={value}
                    value={value}
                    onClick={() => handleToggle(value)}
                    sx={styles.toggleButton(isActive(value))}>
                    {value === 'all'
                      ? 'Всі'
                      : formatOptions.find((f) => f.value === value)?.label}
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
                value={selectedValue}
                onChange={handleChange}
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

          {/* Ціна */}
          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Ціна
            </Typography>
            <Box sx={styles.buttonGroup}>
              {['all', ...priceOptions.map((p) => p.value)].map((value) => (
                <ToggleButton
                  key={value}
                  value={value}
                  onClick={() => handleToggle(value)}
                  sx={styles.toggleButton(isActive(value))}>
                  {value === 'all'
                    ? 'Всі'
                    : priceOptions.find((p) => p.value === value)?.label}
                </ToggleButton>
              ))}
            </Box>
          </Box>
          <Divider sx={styles.divider} />

          <Box sx={styles.modalControlButtonBox}>
            <GlowButton sx={styles.modalControlButton}>
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
