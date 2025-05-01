import React, { useState, useCallback } from 'react'; // Додано useState, useCallback
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/useAuth';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { PrimaryButton } from '../../shared/components/Buttons.tsx';
import Layout from '../../shared/components/Layout';

// --- Імпортуємо НОВИЙ компонент панелі фільтрів ---
import MovieFilterPanel, { FiltersState } from '../../shared/components/MovieFilterPanel'; // Імпортуємо сам компонент і тип його стану
// ---------------------------------------------------


// Компонент основного контенту сторінки (без змін)
const HomePageContent: React.FC = () => {
  // ... код HomePageContent без змін ...
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/', { replace: true }); };
  const handleLogin = () => { navigate('/login', { replace: true }); };
  return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper', color: 'text.secondary' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>MovieHub</Typography>
              <Typography variant="h6" component="p" sx={{ mb: 3 }}>Welcome!</Typography>
              <Divider sx={{ width: '80%', mb: 3, borderColor: 'rgba(0, 0, 0, 0.12)' }} />
              {user ? ( <Box sx={{ textAlign: 'center', width: '100%' }}> <Typography variant="body1" sx={{ mb: 1 }}>Logged in as:</Typography> <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>ID: {user.id}</Typography> <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3 }}>Role: {user.role}</Typography> <PrimaryButton onClick={handleLogout} sx={{ width: '50%' }}>Logout</PrimaryButton> </Box> ) : ( <Box sx={{ textAlign: 'center', width: '100%' }}> <Typography variant="body1" sx={{ mb: 2 }}>Please login to continue.</Typography> <PrimaryButton onClick={handleLogin} sx={{ width: '50%' }}>Login</PrimaryButton> </Box> )}
          </Paper>
      </Container>
  );
};

// Головний компонент сторінки
const HomePage: React.FC = () => {

  // --- Стан для зберігання поточних значень фільтрів (отриманих з панелі) ---
  const [currentFilters, setCurrentFilters] = useState<FiltersState | null>(null);

  // --- Обробник, який буде передано в MovieFilterPanel ---
  // Використовуємо useCallback для стабільності посилання на функцію
  const handleFiltersUpdate = useCallback((newFilters: FiltersState) => {
      console.log('HomePage received filters:', newFilters);
      setCurrentFilters(newFilters);
      // Тут ви можете викликати функцію для завантаження/фільтрації даних
      // на основі newFilters
      // наприклад: fetchMovies(newFilters);
  }, []); // Порожній масив залежностей, функція не залежить від зовнішніх змінних

  return (
    <Layout>
      {/* === РЕНДЕРИМО КОМПОНЕНТ ПАНЕЛІ ФІЛЬТРІВ === */}
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
          {/* Передаємо обробник оновлення фільтрів */}
          <MovieFilterPanel onFiltersChange={handleFiltersUpdate} />
          {/* Можна передати initialFilters, якщо потрібно */}
          {/* <MovieFilterPanel onFiltersChange={handleFiltersUpdate} initialFilters={{ genre: 'comedy' }} /> */}
      </Container>
      <HomePageContent />
    </Layout>
  );
};

export default HomePage;