import React, { ReactNode } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../core/auth/useAuth';
import { PrimaryButton } from '../../shared/components/Buttons';
import Layout from '../../shared/components/Layout';
import { useTheme } from '@mui/material/styles';

interface CustomerAccountLayoutProps {
  children: ReactNode;
}

const sidebarNavItems = [
  { label: 'Про Вас', path: '/account' },
  { label: 'Вподобані фільми', path: '/account/favorite' },
  { label: 'Ваші бронювання', path: '/account/booking' },
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
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiListItemText-primary': {
                          color: 'primary.contrastText',
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    py: 1.25,
                     '& .MuiListItemText-primary': {
                          color: location.pathname === item.path ? 'primary.contrastText': 'text.primary',
                      }
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {user && (
            <Box sx={{ marginTop: 'auto', pt: 2 }}>
              <PrimaryButton onClick={handleLogout} fullWidth>
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