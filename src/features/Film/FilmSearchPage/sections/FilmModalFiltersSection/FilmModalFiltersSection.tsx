import {
  Box,
  Divider,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import FilmModalFiltersSectionStyles from './FilmModalFiltersSection.styles';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllGenres } from '../../../../../core/api/requests/request.genre';
import {
  GlowButton,
  PrimaryButton,
} from '../../../../../shared/components/Buttons';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

type FilterSessionFieldKeys = {
  [key: string]: string;
};

const getDefaultQuery = (): FilterSessionFieldKeys => ({
  GenreIds: '',
  MaxReleaseYear: '',
  MinRating: '',
  MinDurationMinutes: '',
  MaxDurationMinutes: '',
  HasSessions: '',
  MaxAgeRating: '',
});

const FilmModalFiltersSection = () => {
  const theme = useTheme();
  const styles = FilmModalFiltersSectionStyles(theme);
  const [searchParams, setSearchParams] = useSearchParams();

  const [genreOptions, setGenreOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [filter, setFilter] = useState<FilterSessionFieldKeys>(getDefaultQuery);
  const [open, setOpen] = useState(false);

  const [isFirstLoading, setIsFirstLoading] = useState<boolean>(false);

  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedHasSessions, setSelectedHasSessions] = useState<string>('');
  const [selectedAgeRating, setSelectedAgeRating] = useState<string>('');

  useEffect(() => {
    if (!isFirstLoading) return;
    const params = new URLSearchParams(searchParams.toString());

    const genreParam = params.get('GenreIds');
    const newFilter: FilterSessionFieldKeys = {
      GenreIds: genreParam ?? '',
    };

    const otherKeys = ['MinDurationMinutes', 'MaxDurationMinutes'];
    otherKeys.forEach((key) => {
      const value = params.get(key);
      if (value) {
        newFilter[key] = value;
      }
    });

    setFilter(newFilter);
    setIsFirstLoading(false);
    setSelectedGenre(newFilter.GenreIds);
  }, [searchParams]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await getAllGenres();
        const mapped = genres.map((g) => ({
          value: String(g.id),
          label: g.name,
        }));
        setGenreOptions(mapped);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    fetchGenres();
  }, []);

  const releaseYearOptions = Array.from(new Array(40), (_, i) => {
    const value = (new Date().getFullYear() - i).toString();
    return { value: value, label: value };
  });

  const ratingOptions = Array.from(new Array(10), (_, i) => {
    const apiValue = 10 - i;
    const displayValue = apiValue;
    return { value: apiValue.toString(), label: `${displayValue}/10` };
  }).reverse();

  const durationOptions = [
    { value: 'MaxDurationMinutes', label: '< 2 год' },
    { value: 'MinDurationMinutes', label: '≥ 2 год' },
  ];

  const hasSessionOptions = [
    { value: 'true', label: 'Є' },
    { value: 'false', label: 'Немає' },
  ];

  const ageRatingOptions = [
    { value: '0', label: '0+' },
    { value: '6', label: '6+' },
    { value: '12', label: '12+' },
    { value: '16', label: '16+' },
    { value: '18', label: '18+' },
  ];

  const handleChange =
    (field: keyof FilterSessionFieldKeys, setLocal: (val: string) => void) =>
    (e: SelectChangeEvent<string>) => {
      const { value } = e.target;
      setLocal(value);
      setFilter((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    const qp = new URLSearchParams(searchParams.toString());

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== '') {
        if (key == 'MinDurationMinutes' || key == 'MaxDurationMinutes') {
          qp.set(key, '120');
          return;
        }
        qp.set(key, value);
      } else {
        qp.delete(key);
      }
    });

    setSearchParams(qp, { replace: true });
  };

  const handleReset = () => {
    const qp = new URLSearchParams();

    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    setSelectedDuration('');
    setSelectedHasSessions('');
    setSelectedAgeRating('');
    setFilter(getDefaultQuery);

    setSearchParams(qp, { replace: true });
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
              Жанри
            </Typography>
            <Select
              name="GenreIds"
              fullWidth
              value={selectedGenre}
              onChange={handleChange('GenreIds', setSelectedGenre)}
              displayEmpty
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="">Всі</MenuItem>
              {genreOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Рік, до
            </Typography>
            <Select
              name="MaxReleaseYear"
              fullWidth
              value={selectedYear}
              onChange={handleChange('MaxReleaseYear', setSelectedYear)}
              displayEmpty
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="">Всі</MenuItem>
              {releaseYearOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Рейтинг
            </Typography>
            <Select
              name="MinRating"
              fullWidth
              value={selectedRating}
              onChange={handleChange('MinRating', setSelectedRating)}
              displayEmpty
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="">Всі</MenuItem>
              {ratingOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}+
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Тривалість
            </Typography>
            <Select
              name="MinDurationMinutes"
              fullWidth
              value={selectedDuration}
              onChange={handleChange('MinDurationMinutes', setSelectedDuration)}
              displayEmpty
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="">Всі</MenuItem>
              {durationOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              В кіно
            </Typography>
            <Select
              name="HasSessions"
              fullWidth
              value={selectedHasSessions}
              onChange={handleChange('HasSessions', setSelectedHasSessions)}
              displayEmpty
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="">Всі</MenuItem>
              {hasSessionOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={styles.selectorWrapper}>
            <Typography variant="caption" sx={styles.selectorLabelText}>
              Обмеження віку
            </Typography>
            <Select
              name="MaxAgeRating"
              fullWidth
              value={selectedAgeRating}
              onChange={handleChange('MaxAgeRating', setSelectedAgeRating)}
              displayEmpty
              size="small"
              sx={styles.selectorSelector}>
              <MenuItem value="">Всі</MenuItem>
              {ageRatingOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
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
};

export default FilmModalFiltersSection;
