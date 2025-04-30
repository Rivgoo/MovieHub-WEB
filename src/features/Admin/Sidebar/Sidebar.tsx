import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Drawer,
  IconButton,
  Divider,
  ListItemButton,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { NavLink, useMatch, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/useAuth';
import './Sidebar.css';
import { PrimaryButton } from '../../../shared/components/Buttons';
import LogoSvg from '../../../assets/svg/Logo';

const adminNavItems = [
  {
    label: 'Фільми',
    path: '/admin/dashboard',
    icon: <MovieIcon />,
    end: true,
  },
  {
    label: 'Сеанси',
    path: '/admin/session-manager',
    icon: <TheatersIcon />,
  },
  {
    label: 'Кінозали',
    path: '/admin/cinema-hall-manager',
    icon: <MeetingRoomIcon />,
  },
  { label: 'Жанри', path: '/admin/genre-manager', icon: <CategoryIcon /> },
  { label: 'Актори', path: '/admin/actor-manager', icon: <PeopleIcon /> },
  {
    label: 'Користувачі',
    path: '/admin/user-manager',
    icon: <PeopleIcon />,
  },
  {
    label: 'Бронювання',
    path: '/admin/booking-manager',
    icon: <ConfirmationNumberIcon />,
  },
];

const Sidebar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();

  const handleToggleDrawer = (): void => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    if (drawerOpen) handleToggleDrawer();
  };

  const handleGoToSite = () => {
    navigate('/');
    if (drawerOpen) handleToggleDrawer();
  };

  const handleNavItemClick = (path: string) => {
    navigate(path);
    if (drawerOpen) handleToggleDrawer();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900 && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [drawerOpen]);

  const AdminNavItem = ({ item }: { item: (typeof adminNavItems)[0] }) => {
    const isActive = useMatch({ path: item.path, end: item.end ?? false });

    return (
      <ListItem
        disablePadding
        onClick={() => handleNavItemClick(item.path)}
        className={`adminMenuItem ${isActive ? 'adminMenuItemActive' : ''}`}
        sx={{
          cursor: 'pointer',
          borderRadius: '0.75rem',
          marginTop: '0.25rem',
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
          },
          ...(isActive && {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '& .MuiListItemIcon-root': {
              color: theme.palette.primary.contrastText,
            },
          }),
        }}>
        <ListItemButton sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{ className: 'listItemText' }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const renderSidebarContent = () => (
    <Box className="sidebarContent">
      <Box
        className="logoBox"
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0px 15px',
          mb: 2,
        }}>

          <NavLink
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
            <LogoSvg />

            <Typography
              variant="h6"
              className="logoText"
              sx={{ fontWeight: 'bold', color: 'white' }}>
              MovieHub
            </Typography>
          </NavLink>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List className="listMenu">
          {adminNavItems.map((item) => (
            <AdminNavItem key={item.path} item={item} />
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2, borderColor: 'gray' }} />

      <Box className="logoutBox" sx={{ px: 2, pb: 2 }}>
        <PrimaryButton
          variant="contained"
          fullWidth
          startIcon={<ExitToAppIcon />}
          onClick={handleGoToSite}
          sx={{ mb: 1.5 }}>
          На сайт
        </PrimaryButton>

        <PrimaryButton
          variant="contained"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}>
          Вийти
        </PrimaryButton>
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton className="burgerButton" onClick={handleToggleDrawer}>
        <Box className={`burgerLines ${drawerOpen ? 'open' : ''}`}>
          <span /> <span />
        </Box>
      </IconButton>

      <Box className="sidebar" sx={{ display: { xs: 'none', md: 'flex' } }}>
        {renderSidebarContent()}
      </Box>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleToggleDrawer}
        sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box
          sx={{ width: '100vw', backgroundColor: '#1a1a1a', height: '100%' }}>
          {renderSidebarContent()}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
