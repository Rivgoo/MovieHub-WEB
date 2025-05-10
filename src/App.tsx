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

{
  /* Pages */
}
const LoginPage = React.lazy(() => import('./features/Login/LoginPage'));
const HomePage = React.lazy(() => import('./features/Home/HomePage'));
const AboutPage = React.lazy(() => import('./features/About/AboutPage'));
const ErrorPage = React.lazy(() => import('./features/Error/ErrorPage'));
const PrivacyPage = React.lazy(() => import('./features/Privacy/PrivacyPage'));
const TermsPage = React.lazy(() => import('./features/Terms/TermsPage'));
const FilmPage = React.lazy(() => import('./features/Film/FilmPage/FilmPage'));
const FilmSearchPage = React.lazy(
  () => import('./features/Film/FilmSearchPage/FilmSearchPage')
);
const SessionPage = React.lazy(() => import('./features/Session/SessionPage'));
const SessionSearchPage = React.lazy(
  () => import('./features/Session/SessionSearchPage')
);

// Customer Pages and Layout
const CustomerAccountLayout = React.lazy( () => import('./features/Customer/CustomerAccountLayout'));
const CustomerAccountPage = React.lazy(
  () => import('./features/Customer/AccountPage')
);
const FavoritePage = React.lazy(
  () => import('./features/Customer/FavoritePage')
);
const BookingPage = React.lazy(() => import('./features/Customer/BookingPage'));
const RegistrationPage = React.lazy(
  () => import('./features/Registration/RegistrationPage')
);

{
  /* Admin Pages */
}
const FilmManagerPage = React.lazy(
  () => import('./features/Admin/Film/FilmManagerPage')
);
const SessionManagerPage = React.lazy(
  () => import('./features/Admin/Session/SessionManagerPage')
);
const CinemaHallManagerPage = React.lazy(
  () => import('./features/Admin/CinemaHall/CinemaHallManagerPage')
);
const GenreManagerPage = React.lazy(
  () => import('./features/Admin/Genre/GenreManagerPage')
);
const ActorManagerPage = React.lazy(
  () => import('./features/Admin/Actor/ActorManagerPage')
);
const UserManagerPage = React.lazy(
  () => import('./features/Admin/User/UserManagerPage')
);
const BookingManagerPage = React.lazy(
  () => import('./features/Admin/Booking/BookingManagerPage')
);

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: theme.palette.background.default, // Ensure fallback has theme background
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
              {/* Public Routes */}
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

              {/* User Routes with CustomerAccountLayout */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Customer]}>
                    <CustomerAccountLayout>
                      <CustomerAccountPage />
                    </CustomerAccountLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/favorite"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Customer]}>
                    <CustomerAccountLayout>
                      <FavoritePage />
                    </CustomerAccountLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/booking"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Customer]}>
                    <CustomerAccountLayout>
                      <BookingPage />
                    </CustomerAccountLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <FilmManagerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/film-manager"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <FilmManagerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/session-manager"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <SessionManagerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cinema-hall-manager"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <CinemaHallManagerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/genre-manager"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <GenreManagerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/actor-manager"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <ActorManagerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/user-manager"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <UserManagerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/booking-manager"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <BookingManagerPage />
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