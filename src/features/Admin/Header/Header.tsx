import {
  Box,
  Button,
  IconButton,
  InputBase,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReplayIcon from '@mui/icons-material/Replay';
import './Header.css';
import { useState } from 'react';

type HeaderProps = {
  onSearch?: (value: string) => void;
  onReset?: () => void;
  onAdd?: () => void;
  onApplyFilters?: (filters: Record<string, string>) => void;
  filters?: string[]; 
};

const Header = ({
  onSearch,
  onReset,
  onAdd,
  onApplyFilters,
  filters = [],
}: HeaderProps) => {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [searchValue, setSearchValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string>('');
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');

  const handleOpenDialog = (filter: string) => {
    setCurrentFilter(filter);
    setMinValue('');
    setMaxValue('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleApply = () => {
    console.log('handleApply -> передаємо фільтри:', filterValues);
    onApplyFilters?.({ ...filterValues });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleSaveFilterValues = () => {
    setFilterValues((prev) => ({
      ...prev,
      [`Min${currentFilter}`]: minValue,
      [`Max${currentFilter}`]: maxValue,
    }));
    setOpenDialog(false);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    setSearchValue('');
    onReset?.();
  };

  return (
    <Box className="film-advanced-header-wrapper">
      <Box className="film-advanced-header-top">
        <Typography className="film-advanced-header-title">Фільми</Typography>
        <Button
          variant="contained"
          className="film-advanced-header-add-button"
          onClick={onAdd}
        >
          Додати новий фільм
        </Button>
      </Box>

      <Box className="film-search-bar">
        <SearchIcon sx={{ color: '#9ca3af' }} />
        <InputBase
          placeholder="Пошук"
          className="film-search-input"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </Box>

      <Box className="film-filters-bar">
        <div className="film-filters-bar-header">
          <IconButton className="film-filter-icon">
            <FilterListIcon />
          </IconButton>
          <Typography className="film-filter-label">Фільтрувати за</Typography>
        </div>

        {filters.map((filter, index) => {
          const min = filterValues[`Min${filter}`];
          const max = filterValues[`Max${filter}`];

          const rangeDisplay =
            min || max
              ? filter === 'Тривалість'
                ? `(${min ? `${min} хв` : '—'} - ${max ? `${max} хв` : '—'})`
                : `(${min ? min : '—'} - ${max ? max : '—'})`
              : '';

          return (
            <Button
              key={index}
              onClick={() => handleOpenDialog(filter)}
              className="film-filter-select"
              sx={{ paddingLeft: 1, color: 'white', borderBottom: '1px solid gray' }}
            >
              {filter} {rangeDisplay}
            </Button>
          );
        })}
      </Box>

      <Box className="film-filter-buttons-row">
        <Button
          variant="contained"
          className="film-apply-button"
          onClick={handleApply}
        >
          Застосувати
        </Button>

        <Box className="film-reset-box" onClick={handleResetFilters}>
          <ReplayIcon sx={{ color: '#f97316', fontSize: 20 }} />
          <Typography className="film-reset-text">Скасувати</Typography>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Введіть мінімальне та максимальне значення фільтра
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            mt: 1,
          }}
        >
          <TextField
            label={`Мін. ${currentFilter}`}
            type="number"
            fullWidth
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            InputLabelProps={{ sx: { color: 'white' } }}
            InputProps={{
              sx: {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
              },
            }}
          />
          <TextField
            label={`Макс. ${currentFilter}`}
            type="number"
            fullWidth
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            InputLabelProps={{
              sx: { color: 'white' },
            }}
            InputProps={{
              sx: {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Скасувати
          </Button>
          <Button onClick={handleSaveFilterValues} color="primary">
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Header;
