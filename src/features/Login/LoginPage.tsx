import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuth } from '../../core/auth/useAuth';
import getStyles from './LoginPage.styles.ts';
import { loginUser } from './api';
import { ApiErrorResponse } from '../../core/api/types';
import axios from 'axios';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { PrimaryButton } from '../../shared/components/Buttons.tsx';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Footer from '../../shared/components/Footer';
import Header from '../../shared/components/Header/Header';
import { useTheme } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <>
      <Header />
      <LoginForm />
      <Footer />
    </>
  );
};

const LoginForm: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await loginUser({ email, password });

      auth.login(response.accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('LoginPage: Login failed', err);
      let errorMessage = 'Login failed. Please try again.';

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        if (axiosError.response?.data?.description) {
          errorMessage = axiosError.response.data.description;
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (axiosError.response?.status === 403) {
          errorMessage =
            'Access forbidden. Account locked or email not confirmed?';
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={styles.wrapper}>
      <Container component={Paper} maxWidth="xs" sx={styles.container}>
        <Typography component="h1" variant="h5" sx={styles.title}>
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={styles.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            error={!!error}
            sx={styles.textField}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            error={!!error}
            sx={styles.textField}
          />

          {error && (
            <Alert severity="error" sx={styles.errorBox}>
              {error}
            </Alert>
          )}

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
              'Login'
            )}
          </PrimaryButton>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
