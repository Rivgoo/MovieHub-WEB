import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Switch,
  FormControlLabel,
  FormHelperText,
  SelectChangeEvent,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { UserDto, RegisterUserRequest, UpdateUserRequest, RoleDto } from '../../../core/api/types/types.user';
import { UserRole } from '../../../core/auth/types';
import { getAllRoles } from '../../../core/api/requests/request.user';
import { StandardInput } from '../../../shared/components/InputComponents';
import { PrimaryButton, BorderButton } from '../../../shared/components/Buttons';

interface UserFormProps {
  initialData?: UserDto | null;
  onSubmit: (data: RegisterUserRequest | UpdateUserRequest, roleName?: string) => Promise<void>;
  isSubmitting: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  isEditMode,
  onCancel,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRoleName, setSelectedRoleName] = useState<string>('');
  const [isBlocked, setIsBlocked] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [rolesList, setRolesList] = useState<RoleDto[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const resetFormFields = (isCreateMode: boolean) => {
      setFirstName(isCreateMode ? '' : initialData?.firstName || '');
      setLastName(isCreateMode ? '' : initialData?.lastName || '');
      setEmail(isCreateMode ? '' : initialData?.email || '');
      setPhoneNumber(isCreateMode ? '' : initialData?.phoneNumber || '');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setIsBlocked(isCreateMode ? false : initialData?.isBlocked || false);
      
      if (isCreateMode) {
        const customerRole = rolesList.find(r => r.name.toLowerCase() === UserRole.Customer.toLowerCase());
        setSelectedRoleName(customerRole?.name || (rolesList.length > 0 ? rolesList[0].name : ''));
      } else {
        setSelectedRoleName('');
      }
      setErrors({});
    };

    if (isEditMode && initialData) {
      resetFormFields(false);
    } else if (!isEditMode) {
      resetFormFields(true);
    }
  }, [isEditMode, initialData, rolesList]);

  useEffect(() => {
    if (!isEditMode) {
      setLoadingRoles(true);
      getAllRoles()
        .then(data => {
          setRolesList(data);
          const customerRole = data.find(r => r.name.toLowerCase() === UserRole.Customer.toLowerCase());
          setSelectedRoleName(customerRole?.name || (data.length > 0 ? data[0].name : ''));
        })
        .catch(err => {
          console.error("Failed to fetch roles:", err);
          setErrors(prev => ({ ...prev, rolesApi: "Не вдалося завантажити ролі" }));
        })
        .finally(() => setLoadingRoles(false));
    }
  }, [isEditMode]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "Ім'я обов'язкове";
    if (!lastName.trim()) newErrors.lastName = "Прізвище обов'язкове";
    if (!email.trim()) {
      newErrors.email = "Email обов'язковий";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Неправильний формат email';
    }

    if (!isEditMode) {
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = "Номер телефону обов'язковий";
      } else if (!/^\+?\d{10,15}$/.test(phoneNumber.replace(/\s+/g, ''))) {
        newErrors.phoneNumber = 'Неправильний формат телефону (приклад: +380XXXXXXXXX)';
      }
      if (!password) {
        newErrors.password = "Пароль обов'язковий";
      } else if (password.length < 6) {
        newErrors.password = 'Пароль має містити щонайменше 6 символів';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Паролі не співпадають';
      }
      if (!selectedRoleName) {
        newErrors.role = "Роль обов'язкова";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode && initialData) {
      const updateData: UpdateUserRequest = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        isBlocked,
      };
      await onSubmit(updateData);
    } else {
      const createData: RegisterUserRequest = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
      };
      await onSubmit(createData, selectedRoleName);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  const commonTextFieldSx = { mb: 2.5 };

  return (
    <Box component="form" onSubmit={handleSubmit} className="user-form" noValidate sx={{ mt: 2 }}>
      <StandardInput
        label="Ім'я"
        fullWidth
        value={firstName}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
        error={!!errors.firstName}
        helperText={errors.firstName}
        disabled={isSubmitting}
        required
        InputLabelProps={{ shrink: !!firstName }}
        sx={commonTextFieldSx}
      />
      <StandardInput
        label="Прізвище"
        fullWidth
        value={lastName}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
        error={!!errors.lastName}
        helperText={errors.lastName}
        disabled={isSubmitting}
        required
        InputLabelProps={{ shrink: !!lastName }}
        sx={commonTextFieldSx}
      />
      <StandardInput
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        disabled={isSubmitting}
        required
        InputLabelProps={{ shrink: !!email }}
        sx={commonTextFieldSx}
      />
      {!isEditMode && (
        <>
          <StandardInput
            label="Номер телефону"
            fullWidth
            value={phoneNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            disabled={isSubmitting}
            required
            InputLabelProps={{ shrink: !!phoneNumber }}
            sx={commonTextFieldSx}
          />
          <StandardInput
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isSubmitting}
            required
            InputLabelProps={{ shrink: true }}
            sx={commonTextFieldSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <StandardInput
            label="Підтвердіть пароль"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={isSubmitting}
            required
            InputLabelProps={{ shrink: true }}
            sx={commonTextFieldSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth error={!!errors.role} required disabled={loadingRoles || isSubmitting} sx={commonTextFieldSx}>
            <InputLabel id="role-select-label" shrink={!!selectedRoleName || loadingRoles || rolesList.length > 0}>Роль</InputLabel>
            <Select
              labelId="role-select-label"
              value={selectedRoleName}
              label="Роль"
              onChange={(e: SelectChangeEvent<string>) => setSelectedRoleName(e.target.value as string)}
              displayEmpty={!selectedRoleName && !loadingRoles && rolesList.length === 0}
            >
              {loadingRoles && <MenuItem value="" disabled><em>Завантаження ролей...</em></MenuItem>}
              {!loadingRoles && rolesList.length === 0 && <MenuItem value="" disabled><em>Ролі не знайдено</em></MenuItem>}
              {rolesList.map((role) => (
                  <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
              ))}
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            {errors.rolesApi && !loadingRoles && <FormHelperText error>{errors.rolesApi}</FormHelperText>}
          </FormControl>
        </>
      )}
      {isEditMode && initialData && (
        <>
          <FormControlLabel
            control={
              <Switch
                checked={isBlocked}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setIsBlocked(e.target.checked)}
                disabled={isSubmitting}
              />
            }
            label="Заблокований"
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
              Поточні ролі: {initialData.roles?.join(', ') || 'N/A'} (Редагування ролей не підтримується наразі)
          </Typography>
        </>
      )}
      <Box className="user-form-buttons">
        <BorderButton onClick={onCancel} variant="outlined" disabled={isSubmitting}>
          Скасувати
        </BorderButton>
        <PrimaryButton type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} color="inherit"/> : (isEditMode ? 'Зберегти' : 'Створити')}
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default UserForm;