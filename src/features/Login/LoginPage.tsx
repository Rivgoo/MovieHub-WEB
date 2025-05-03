import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuth } from '../../core/auth/useAuth';
import getStyles from './LoginPage.styles.ts';
import { ApiErrorResponse } from '../../core/api/types';
import axios from 'axios';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { PrimaryButton } from '../../shared/components/Buttons.tsx';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { Link, useTheme } from '@mui/material';

// --- MUI Imports for Icons ---
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// --- End MUI Imports ---

import Layout from '../../shared/components/Layout';
import { loginUser } from '../../core/api/loginApi.ts';

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  // Existing State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation State
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Hooks
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Handlers for Password Visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    setApiError(null);
    setEmailError(false);
    setEmailErrorMessage('');
    setPasswordError(false);
    setPasswordErrorMessage('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Уведіть дійсний email.');
      isValid = false;
    }

    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage('Введіть пароль.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Пароль повинен містити принаймні 6 символів.');
      isValid = false;
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

    try {
      const response = await loginUser({ email, password });
      auth.login(response.accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('LoginPage: Login failed', err);
      let errorMessage = 'не вдалося увійти, спробуйте пізніше.';

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        if (axiosError.response?.status === 401) {
          errorMessage = 'Неправильний email або пароль.';
        } else if (axiosError.response?.status === 403) {
          errorMessage =
            'Упс, ви зробили забагато спроб входу або ж акаунт заблоковано.';
        } else if (axiosError.response?.data?.description) {
          errorMessage = axiosError.response.data.description;
        } else if (axiosError.message) {
          errorMessage = 'Невідмовна помилка, спробуйте пізніше.';
        }
      } else if (err instanceof Error) {
        errorMessage = 'Невідмовна помилка, спробуйте пізніше.';
      }
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box sx={styles.wrapper}>
        <Container component={Paper} maxWidth="xs" sx={styles.container}>
          <Typography component="h1" variant="h5" sx={styles.title}>
            ~ Авторизація ~
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={styles.form}>
            {/* Email Field - Updated Label */}
            <FormControl
              fullWidth
              required
              error={emailError}
              sx={styles.formControl}>
              {/* Updated FormLabel to include Icon */}
              <FormLabel htmlFor="email" sx={styles.formLabel}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <EmailOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                  Email
                </Box>
              </FormLabel>
              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                error={emailError}
                helperText={emailErrorMessage}
                variant="outlined"
                sx={styles.textField}
              />
            </FormControl>

            {/* Password Field - Updated Label */}
            <FormControl
              fullWidth
              required
              error={passwordError}
              variant="outlined"
              sx={styles.formControl}>
              {/* Updated FormLabel to include Icon */}
              <FormLabel htmlFor="password" sx={styles.formLabel}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <LockOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                  Пароль
                </Box>
              </FormLabel>
              <TextField
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                error={passwordError}
                helperText={passwordErrorMessage}
                variant="outlined"
                sx={styles.textField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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
            <PrimaryButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={styles.button}>
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Увійти'
              )}
            </PrimaryButton>

            {/* Registration Link */}
            <Typography
              sx={{
                color: theme.palette.text.primary,
                textAlign: 'center',
                mt: 1,
                fontSize: '0.875rem',
              }}>
              Ще не маєте акаунту?{' '}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/registration');
                }}
                variant="body2"
                sx={styles.link}>
                Зареєструйтесь
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default LoginPage;
