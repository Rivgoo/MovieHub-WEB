import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../core/auth/useAuth';
import getStyles from './RegistrationPage.styles';
import { registerUser, getRegistrationErrorMessage } from '../../core/api/registrationApi';
import { loginUser } from '../Login/api';
import { RegisterUserRequest } from '../../core/api/types/types.user';
import { ApiErrorResponse } from '../../core/api/types';
import { AxiosError } from 'axios';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { PrimaryButton } from '../../shared/components/Buttons';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { Link, useTheme } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

import Layout from '../../shared/components/Layout';

const RegistrationPage: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // --- State ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // --- Validation State ---
  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');

  // --- Handlers ---
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
   const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const clearValidationErrors = () => {
    setFirstNameError(false); setFirstNameErrorMessage('');
    setLastNameError(false); setLastNameErrorMessage('');
    setEmailError(false); setEmailErrorMessage('');
    setPhoneError(false); setPhoneErrorMessage('');
    setPasswordError(false); setPasswordErrorMessage('');
    setConfirmPasswordError(false); setConfirmPasswordErrorMessage('');
    setApiError(null);
  }

  const validateInputs = (): boolean => {
    clearValidationErrors();
    let isValid = true;

    if (!firstName.trim()) {
      setFirstNameError(true); setFirstNameErrorMessage("Введіть ім'я."); isValid = false;
    }
    if (!lastName.trim()) {
      setLastNameError(true); setLastNameErrorMessage("Введіть прізвище."); isValid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true); setEmailErrorMessage('Уведіть дійсний email.'); isValid = false;
    }
    if (!phoneNumber.trim()) {
       setPhoneError(true); setPhoneErrorMessage('Введіть номер телефону.'); isValid = false;
    } else if (!/^\+?\d{10,15}$/.test(phoneNumber.replace(/\s+/g, ''))) {
       setPhoneError(true); setPhoneErrorMessage('Невірний формат телефону.'); isValid = false;
    }
    const passwordValidationErrors: string[] = [];
    if (!password) {
      passwordValidationErrors.push('Введіть пароль.');
      isValid = false;
    } else {
      if (password.length < 6) {
        passwordValidationErrors.push("мінімум 6 символів");
        isValid = false;
      }
      if (!/[A-Z]/.test(password)) {
        passwordValidationErrors.push("принаймні одну велику літеру");
        isValid = false;
      }
      if (!/\d/.test(password)) {
        passwordValidationErrors.push("принаймні одну цифру");
        isValid = false;
      }
    }

    if (passwordValidationErrors.length > 0) {
      setPasswordError(true);
      if (passwordValidationErrors.length === 1 && passwordValidationErrors[0] === 'Введіть пароль.') {
         setPasswordErrorMessage(passwordValidationErrors[0]);
      } else {
         setPasswordErrorMessage(`Пароль повинен містити: ${passwordValidationErrors.join(', ')}.`);
      }
    }

    if (!confirmPassword) {
       setConfirmPasswordError(true); setConfirmPasswordErrorMessage('Підтвердіть пароль.'); isValid = false;
    } else if (password && password !== confirmPassword) {
      setConfirmPasswordError(true); setConfirmPasswordErrorMessage('Паролі не співпадають.'); isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    if (!validateInputs()) {
      return;
    }

    setIsSubmitting(true);

    const registrationData: RegisterUserRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      password: password,
    };

    try {
      await registerUser(registrationData);

      try {
        const loginResponse = await loginUser({ email: registrationData.email, password: registrationData.password });
        auth.login(loginResponse.accessToken);
        navigate(from, { replace: true });
      } catch (loginErr) {
          console.error('RegistrationPage: Auto-login failed after registration', loginErr);
          setApiError('Реєстрація успішна, але не вдалося автоматично увійти. Спробуйте увійти вручну.');
          setTimeout(() => navigate('/login'), 4000);
      }

    } catch (regErr) {
      console.error('RegistrationPage: Registration failed', regErr);
      let specificErrorMessage: string | null = null;

      if (regErr instanceof AxiosError) {
        const axiosError = regErr as AxiosError<ApiErrorResponse>;
        const errorCode = axiosError.response?.data?.code;
        const errorDesc = axiosError.response?.data?.description; 

        if (errorCode === 'User.InvalidPassword') {
          const violations: string[] = [];
          if (password.length < 6) {
            violations.push("мінімум 6 символів");
          }
          if (!/[A-Z]/.test(password)) {
            violations.push("принаймні одну велику літеру");
          }
          if (!/\d/.test(password)) {
            violations.push("принаймні одну цифру");
          }

          if (violations.length > 0) {
            specificErrorMessage = `Пароль не відповідає вимогам: ${violations.join(', ')}.`;
          } else {
            specificErrorMessage = errorDesc || 'Недійсний пароль (не вдалося визначити причину).';
          }
        }
      }

      setApiError(specificErrorMessage || getRegistrationErrorMessage(regErr));

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box sx={styles.wrapper}>
        <Container component={Paper} maxWidth="xs" sx={styles.container}>
          <Typography component="h1" variant="h5" sx={styles.title}>
            ~ Реєстрація ~
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.form}>
            {/* First Name */}
            <FormControl fullWidth required error={firstNameError} sx={styles.formControl}>
              <FormLabel htmlFor="firstName" sx={styles.formLabel}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <PersonOutlineIcon sx={{ fontSize: '1.1rem' }} /> Ім'я
                </Box>
              </FormLabel>
              <TextField
                id="firstName" name="firstName" autoComplete="given-name" autoFocus
                value={firstName} onChange={(e) => setFirstName(e.target.value)}
                disabled={isSubmitting} error={firstNameError} helperText={firstNameErrorMessage}
                variant="outlined" sx={styles.textField} placeholder="Ваше ім'я"
              />
            </FormControl>

            {/* Last Name */}
            <FormControl fullWidth required error={lastNameError} sx={styles.formControl}>
              <FormLabel htmlFor="lastName" sx={styles.formLabel}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <PersonOutlineIcon sx={{ fontSize: '1.1rem' }} /> Прізвище
                </Box>
              </FormLabel>
              <TextField
                id="lastName" name="lastName" autoComplete="family-name"
                value={lastName} onChange={(e) => setLastName(e.target.value)}
                disabled={isSubmitting} error={lastNameError} helperText={lastNameErrorMessage}
                variant="outlined" sx={styles.textField} placeholder="Ваше прізвище"
              />
            </FormControl>

            {/* Email */}
            <FormControl fullWidth required error={emailError} sx={styles.formControl}>
              <FormLabel htmlFor="email" sx={styles.formLabel}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <EmailOutlinedIcon sx={{ fontSize: '1.1rem' }} /> Email
                </Box>
              </FormLabel>
              <TextField
                id="email" type="email" name="email" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting} error={emailError} helperText={emailErrorMessage}
                variant="outlined" sx={styles.textField} placeholder="your@email.com"
              />
            </FormControl>

            {/* Phone Number */}
             <FormControl fullWidth required error={phoneError} sx={styles.formControl}>
              <FormLabel htmlFor="phoneNumber" sx={styles.formLabel}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <PhoneOutlinedIcon sx={{ fontSize: '1.1rem' }} /> Телефон
                </Box>
              </FormLabel>
              <TextField
                id="phoneNumber" type="tel" name="phoneNumber" autoComplete="tel"
                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isSubmitting} error={phoneError} helperText={phoneErrorMessage}
                variant="outlined" sx={styles.textField} placeholder="+380 XX XXX XX XX"
              />
            </FormControl>

            {/* Password */}
            <FormControl fullWidth required error={passwordError} variant="outlined" sx={styles.formControl}>
              <FormLabel htmlFor="password" sx={styles.formLabel}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <LockOutlinedIcon sx={{ fontSize: '1.1rem' }} /> Пароль
                </Box>
              </FormLabel>
              <TextField
                id="password" name="password" type={showPassword ? 'text' : 'password'}
                autoComplete="new-password" placeholder="Мінімум 6 символів"
                value={password} onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting} error={passwordError} helperText={passwordErrorMessage}
                variant="outlined" sx={styles.textField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Confirm Password */}
            <FormControl fullWidth required error={confirmPasswordError} variant="outlined" sx={styles.formControl}>
              <FormLabel htmlFor="confirmPassword" sx={styles.formLabel}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <LockOutlinedIcon sx={{ fontSize: '1.1rem' }} /> Підтвердіть пароль
                </Box>
              </FormLabel>
              <TextField
                id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password" placeholder="Введіть пароль ще раз"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting} error={confirmPasswordError} helperText={confirmPasswordErrorMessage}
                variant="outlined" sx={styles.textField}
                 InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle confirm password visibility" onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownConfirmPassword} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* API Error Alert */}
            {apiError && (
              <Alert severity="error" sx={styles.apiErrorAlert} icon={false}>
                {apiError}
              </Alert>
            )}

            {/* Submit Button */}
            <PrimaryButton type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting} sx={styles.button}>
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Зареєструватися'}
            </PrimaryButton>

            {/* Login Link */}
             <Typography sx={{ color: theme.palette.text.primary, textAlign: 'center', mt: 1, fontSize: '0.875rem', }}>
              Вже маєте акаунт?{' '}
              <Link href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} variant="body2" sx={styles.link}>
                Увійдіть
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default RegistrationPage;
