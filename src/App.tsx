import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './core/auth/ProtectedRoute';
import { AuthProvider } from './core/auth/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import LoginPage from './features/Login/LoginPage';
import HomePage from './features/Home/HomePage';
import AboutPage from './features/About/AboutPage';
import ErrorPage from './features/Error/ErrorPage';
import PrivacyPage from './features/Privacy/PrivacyPage';
import FilmPage from './features/Film/FilmPage';
import FilmSearchPage from './features/Film/FilmSearchPage';
import SessionPage from './features/Session/SessionPage';
import SessionSearchPage from './features/Session/SessionSearchPage';
import CustomerAccountPage from './features/Customer/AccountPage';
import AdminDashboardPage from './features/Admin/DashboardPage';
import FavoritePage from './features/Customer/FavoritePage';
import BookingPage from './features/Customer/BookingPage';
import RegistrationPage from './features/Registration/RegistrationPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/film/:id" element={<FilmPage />} />
            <Route path="/film-search" element={<FilmSearchPage />} />
            <Route path="/session/:id" element={<SessionPage />} />
            <Route path="/session-search" element={<SessionSearchPage />} />

            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <CustomerAccountPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/favorite"
              element={
                <ProtectedRoute>
                  <FavoritePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/booking"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<HomePage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
