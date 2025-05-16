import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  Typography,
  Paper,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { uk } from 'date-fns/locale/uk';
import { useTheme } from '@mui/material/styles';

import {
  SessionDto,
  CreateSessionRequest,
  UpdateSessionRequest,
} from '../../../core/api/types/types.session';
import { ContentDto } from '../../../core/api/types/types.content';
import { CinemaHallDto } from '../../../core/api/types/types.cinemahall';
import {
  searchContent,
  getContentById,
} from '../../../core/api/requests/request.content';
import {
  createSession,
  updateSession,
} from '../../../core/api/requests/request.session';
import { StandardInput } from '../../../shared/components/InputComponents';
import {
  PrimaryButton,
  BorderButton,
} from '../../../shared/components/Buttons';
import { getApiErrorMessage } from '../../../core/api/getApiErrorMessage';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulSave: () => void;
  sessionToEdit: SessionDto | null;
  cinemaHalls: CinemaHallDto[];
}

const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  onSuccessfulSave,
  sessionToEdit,
  cinemaHalls,
}) => {
  const theme = useTheme();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentDto | null>(
    null
  );
  const [cinemaHallId, setCinemaHallId] = useState<string>('');
  const [ticketPrice, setTicketPrice] = useState<string>('');

  const [contentOptions, setContentOptions] = useState<ContentDto[]>([]);
  const [contentInputValue, setContentInputValue] = useState('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!sessionToEdit;
  const dialogTitleText = isEditMode
    ? 'Редагувати Сеанс'
    : 'Додати Новий Сеанс';

  const fetchInitialContentForEdit = useCallback(async (contentId: number) => {
    setIsLoadingContent(true);
    try {
      const contentData = await getContentById(contentId);
      setSelectedContent(contentData);
      setContentInputValue(contentData.title || '');
      setContentOptions((prev) => {
        const exists = prev.some((c) => c.id === contentData.id);
        return exists ? prev : [contentData, ...prev.slice(0, 9)];
      });
    } catch (error) {
      console.error('Error fetching initial content for edit:', error);
      setErrors((prev) => ({
        ...prev,
        contentId: 'Не вдалося завантажити фільм',
      }));
    } finally {
      setIsLoadingContent(false);
    }
  }, []);

  const fetchDefaultContentOptions = useCallback(
    async (searchTerm: string = '') => {
      setIsLoadingContent(true);
      try {
        let query =
          'orderField=CreatedAt&orderType=OrderByDescending&pageSize=10';
        if (searchTerm) {
          query = `SearchTerms=${encodeURIComponent(searchTerm)}&pageSize=10`;
        }
        const response = await searchContent(query);
        setContentOptions(response.items || []);
      } catch (error) {
        console.error('Error fetching content options:', error);
        setContentOptions([]);
      } finally {
        setIsLoadingContent(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpen) {
      setStartTime(null);
      setSelectedContent(null);
      setCinemaHallId('');
      setTicketPrice('');
      setContentOptions([]);
      setContentInputValue('');
      setIsLoadingContent(false);
      setIsSubmitting(false);
      setErrors({});
      return;
    }

    if (sessionToEdit) {
      const startTimeFromServer = sessionToEdit.startTime;
      const hasTimeZoneInfo = /Z|[+-]\d{2}:\d{2}$/.test(startTimeFromServer);
      const stringToParse = hasTimeZoneInfo
        ? startTimeFromServer
        : `${startTimeFromServer}Z`;
      setStartTime(new Date(stringToParse));
      if (sessionToEdit.contentId) {
        fetchInitialContentForEdit(sessionToEdit.contentId);
      } else {
        setSelectedContent(null);
        setContentInputValue('');
        setIsLoadingContent(false);
      }
      setCinemaHallId(String(sessionToEdit.cinemaHallId));
      setTicketPrice(String(sessionToEdit.ticketPrice));
    } else {
      setStartTime(new Date(Date.now() + 60 * 60 * 1000));
      setSelectedContent(null);
      setCinemaHallId(cinemaHalls.length > 0 ? String(cinemaHalls[0].id) : '');
      setTicketPrice('');
      setContentInputValue('');
      fetchDefaultContentOptions();
    }
  }, [
    sessionToEdit,
    isOpen,
    cinemaHalls,
    fetchInitialContentForEdit,
    fetchDefaultContentOptions,
  ]);

  const debouncedFetchContent = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm) {
        fetchDefaultContentOptions(searchTerm);
      } else {
        setContentOptions([]);
      }
    }, 500),
    [fetchDefaultContentOptions]
  );

  useEffect(() => {
    if (isOpen && contentInputValue) {
      debouncedFetchContent(contentInputValue);
    } else if (
      isOpen &&
      !contentInputValue &&
      !sessionToEdit &&
      !selectedContent
    ) {
      fetchDefaultContentOptions();
    }
  }, [
    contentInputValue,
    isOpen,
    debouncedFetchContent,
    sessionToEdit,
    selectedContent,
    fetchDefaultContentOptions,
  ]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!startTime) newErrors.startTime = "Час початку обов'язковий";
    else if (startTime.getTime() <= Date.now() && !isEditMode) {
      newErrors.startTime = 'Час початку не може бути у минулому';
    }
    if (!selectedContent) newErrors.contentId = "Фільм обов'язковий";
    if (!cinemaHallId) newErrors.cinemaHallId = "Кінозал обов'язковий";
    if (
      !ticketPrice.trim() ||
      isNaN(parseFloat(ticketPrice)) ||
      parseFloat(ticketPrice) < 0
    ) {
      newErrors.ticketPrice = "Ціна квитка має бути невід'ємним числом";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    if (!startTime || !selectedContent) {
      setErrors((prev) => ({
        ...prev,
        form: "Будь ласка, заповніть всі обов'язкові поля.",
      }));
      setIsSubmitting(false);
      return;
    }

    const sessionPayload = {
      startTime: startTime.toISOString(),
      contentId: selectedContent.id,
      cinemaHallId: parseInt(cinemaHallId),
      ticketPrice: parseFloat(ticketPrice),
    };

    try {
      if (isEditMode && sessionToEdit) {
        await updateSession(
          sessionToEdit.id,
          sessionPayload as UpdateSessionRequest
        );
      } else {
        await createSession(sessionPayload as CreateSessionRequest);
      }
      onSuccessfulSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving session:', err);
      setErrors((prev) => ({
        ...prev,
        api: getApiErrorMessage(err, 'Помилка збереження сеансу'),
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  function debounce<F extends (...args: any[]) => any>(
    func: F,
    waitFor: number
  ) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const debounced = (...args: Parameters<F>) => {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => func(...args), waitFor);
    };
    return debounced as (...args: Parameters<F>) => ReturnType<F>;
  }

  const commonTextFieldSx = {
    mb: 2.5,
    '& .MuiInputLabel-root': { color: 'primary.light' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&:hover fieldset': { borderColor: 'primary.light' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
      color: 'primary.light',
    },
    '& .MuiSvgIcon-root': { color: 'primary.light' },
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { bgcolor: 'var(--admin-dark)', color: 'primary.contrastText' },
      }}>
      <DialogTitle
        sx={{
          color: 'primary.light',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
        {dialogTitleText}
      </DialogTitle>
      <DialogContent sx={{ pt: '20px !important' }}>
        {errors.api && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            }}>
            {errors.api}
          </Alert>
        )}
        {errors.form && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {errors.form}
          </Alert>
        )}

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
          <DateTimePicker
            label="Час початку"
            value={startTime}
            onChange={(newValue: Date | null) => setStartTime(newValue)}
            ampm={false}
            sx={commonTextFieldSx}
            enableAccessibleFieldDOMStructure={false}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
                error: !!errors.startTime,
                helperText: errors.startTime,
                InputLabelProps: { shrink: true },
              },
            }}
          />
        </LocalizationProvider>

        <Autocomplete
          fullWidth
          options={contentOptions}
          value={selectedContent}
          inputValue={contentInputValue}
          onInputChange={(_event, newInputValue: string) => {
            setContentInputValue(newInputValue);
            if (!newInputValue && selectedContent) {
              setSelectedContent(null);
            }
          }}
          onChange={(_event, newValue: ContentDto | null) => {
            setSelectedContent(newValue);
            setContentInputValue(newValue ? newValue.title || '' : '');
          }}
          getOptionLabel={(option: ContentDto) => option.title || ''}
          isOptionEqualToValue={(option: ContentDto, value: ContentDto) =>
            option.id === value.id
          }
          loading={isLoadingContent}
          loadingText="Завантаження фільмів..."
          noOptionsText={
            contentInputValue ? 'Фільми не знайдено' : 'Почніть вводити назву'
          }
          filterOptions={(x) => x}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Фільм"
              variant="outlined"
              error={!!errors.contentId}
              helperText={errors.contentId}
              sx={commonTextFieldSx}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingContent ? (
                      <CircularProgress
                        color="inherit"
                        size={20}
                        sx={{ color: 'primary.light' }}
                      />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option: ContentDto) => (
            <Box component="li" {...props} key={option.id}>
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {option.title} ({option.releaseYear})
              </Typography>
            </Box>
          )}
          PaperComponent={({ children }) => (
            <Paper sx={{ bgcolor: 'var(--admin-list-item-color)' }}>
              {children}
            </Paper>
          )}
        />

        <FormControl
          fullWidth
          sx={commonTextFieldSx}
          error={!!errors.cinemaHallId}
          size="medium">
          <InputLabel
            id="cinemaHall-label"
            shrink
            sx={{
              color: 'primary.light',
              '&.Mui-focused': { color: 'primary.main' },
            }}>
            Кінозал
          </InputLabel>
          <Select
            labelId="cinemaHall-label"
            value={cinemaHallId}
            label="Кінозал"
            onChange={(e: SelectChangeEvent<string>) =>
              setCinemaHallId(e.target.value)
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: 'var(--admin-list-item-color)',
                  color: 'primary.light',
                  borderRadius: '8px',
                },
              },
            }}>
            {cinemaHalls.map((hall) => (
              <MenuItem
                key={hall.id}
                value={String(hall.id)}
                sx={{ color: 'text.primary' }}>
                {hall.name}
              </MenuItem>
            ))}
          </Select>
          {errors.cinemaHallId && (
            <Typography
              color="error"
              variant="caption"
              sx={{ ml: 1.5, mt: 0.5 }}>
              {errors.cinemaHallId}
            </Typography>
          )}
        </FormControl>

        <StandardInput
          fullWidth
          label="Ціна квитка (грн)"
          type="number"
          value={ticketPrice}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTicketPrice(e.target.value)
          }
          error={!!errors.ticketPrice}
          helperText={errors.ticketPrice}
          InputProps={{ inputProps: { min: 0, step: '0.01' } }}
          sx={commonTextFieldSx}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions
        sx={{ p: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <BorderButton onClick={onClose} disabled={isSubmitting}>
          Скасувати
        </BorderButton>
        <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditMode ? (
            'Зберегти зміни'
          ) : (
            'Додати сеанс'
          )}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default SessionModal;