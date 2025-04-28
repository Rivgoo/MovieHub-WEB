import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './core/auth/ProtectedRoute';
import { AuthProvider } from './core/auth/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Suspense } from 'react';
import React from 'react';
import { UserRole } from './core/auth/types';

const LoginPage = React.lazy(() => import('./features/Login/LoginPage'));
const HomePage = React.lazy(() => import('./features/Home/HomePage'));
const AboutPage = React.lazy(() => import('./features/About/AboutPage'));
const ErrorPage = React.lazy(() => import('./features/Error/ErrorPage'));
const PrivacyPage = React.lazy(() => import('./features/Privacy/PrivacyPage'));
const TermsPage = React.lazy(() => import('./features/Terms/TermsPage'));
const FilmPage = React.lazy(() => import('./features/Film/FilmPage'));
const FilmSearchPage = React.lazy(
  () => import('./features/Film/FilmSearchPage')
);
const SessionPage = React.lazy(() => import('./features/Session/SessionPage'));
const SessionSearchPage = React.lazy(
  () => import('./features/Session/SessionSearchPage')
);
const CustomerAccountPage = React.lazy(
  () => import('./features/Customer/AccountPage')
);
const AdminDashboardPage = React.lazy(
  () => import('./features/Admin/DashboardPage')
);
const FavoritePage = React.lazy(
  () => import('./features/Customer/FavoritePage')
);
const BookingPage = React.lazy(() => import('./features/Customer/BookingPage'));
const RegistrationPage = React.lazy(
  () => import('./features/Registration/RegistrationPage')
);

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/film/:id" element={<FilmPage />} />
              <Route path="/film-search" element={<FilmSearchPage />} />
              <Route path="/session/:id" element={<SessionPage />} />
              <Route path="/session-search" element={<SessionSearchPage />} />

              <Route
                path="/account"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Customer]}>
                    <CustomerAccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/favorite"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Customer]}>
                    <FavoritePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/booking"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Customer]}>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<HomePage />} />

              <Route path="*" element={<Navigate to="/error" replace />} />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
