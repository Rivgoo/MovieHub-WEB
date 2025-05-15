import React, { ReactNode } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon'; // Імпортовано
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// Імпортуємо іконки
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Для кнопки "Вийти"

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../core/auth/useAuth';
import { PrimaryButton } from '../../shared/components/Buttons';
import Layout from '../../shared/components/Layout';
import { useTheme } from '@mui/material/styles';

interface CustomerAccountLayoutProps {
  children: ReactNode;
}

const sidebarNavItems = [
  { label: 'Про Вас', path: '/account', icon: <ManageAccountsIcon /> },
  { label: 'Вподобані фільми', path: '/account/favorite', icon: <FavoriteBorderIcon /> },
  { label: 'Ваші бронювання', path: '/account/booking', icon: <BookOnlineIcon /> },
];

const CustomerAccountLayout: React.FC<CustomerAccountLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const theme = useTheme();
  const stickyTopOffset = theme.spacing(13);


  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <Layout>
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          display: 'flex',
          width: '100%',
          gap: { sm: 2, md: 3 }
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '280px',
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            flexShrink: 0,
            p: 2.5,
            height: 'fit-content',
            position: 'sticky',
            top: stickyTopOffset,
            alignSelf: 'flex-start',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', pl: 1, fontWeight: 'bold' }}>
            Мій кабінет
          </Typography>
          <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <List component="nav" sx={{ p: 0, width: '100%' }}>
            {sidebarNavItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: '8px',
                    color: location.pathname === item.path ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    '& .MuiListItemIcon-root': { // Стилі для іконки за замовчуванням та при виборі
                        color: location.pathname === item.path ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    },
                    '& .MuiListItemText-primary': { // Стилі для тексту за замовчуванням та при виборі
                        color: location.pathname === item.path ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    },
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      // Колір тексту та іконки вже встановлено вище через color: та '& .MuiListItemIcon-root'
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                       // Можна додати зміну кольору тексту/іконки при наведенні, якщо потрібно
                       // color: theme.palette.text.primary, // приклад
                       // '& .MuiListItemIcon-root': { color: theme.palette.text.primary }, // приклад
                    },
                    py: 1.25,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {user && (
            <Box sx={{ marginTop: 'auto', pt: 2 }}>
              <PrimaryButton 
                onClick={handleLogout} 
                fullWidth
                startIcon={<ExitToAppIcon />}
              >
                Вийти
              </PrimaryButton>
            </Box>
          )}
        </Paper>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {children}
        </Box>
      </Container>
    </Layout>
  );
};

export default CustomerAccountLayout;