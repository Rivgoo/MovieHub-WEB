import { JSX, useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Stack,
  Button,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';


import { useNavigate, NavLink, useMatch } from 'react-router-dom';
import Logo from '../../../assets/svg/Logo';
import { useAuth } from '../../../core/auth/useAuth';
import { PrimaryButton } from '../Buttons';
import getStyles from './HeaderStyles';
import { UserRole } from '../../../core/auth/types';

const mainNavItems = [
  { label: 'Головна', path: '/', icon: <HomeIcon /> },
  { label: 'Фільми', path: '/film-search', icon: <MovieIcon /> },
  { label: 'Сеанси', path: '/session-search', icon: <TheatersIcon /> },
];

const customerAccountNavItems = [
  { label: 'Загальна інформація', path: '/account', icon: <ManageAccountsIcon /> },
  { label: 'Вподобані фільми', path: '/account/favorite', icon: <FavoriteBorderIcon /> },
  { label: 'Ваші бронювання', path: '/account/booking', icon: <BookOnlineIcon /> },
];


function LogoComponent() {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = getStyles(theme);
  const handleToHomePage = () => navigate('/', { replace: true });

  return (
    <Box sx={styles.logoBox} onClick={handleToHomePage}>
      <Logo />
      <Typography
        variant="h6"
        color="white"
        fontWeight="bold"
        sx={{ display: { sm: 'block' } }}>
        MovieHub
      </Typography>
    </Box>
  );
}

export default function Header() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleNavigationAndCloseDrawer = (path: string) => {
    navigate(path, { replace: true });
    handleDrawerToggle();
  };

  const handleLogoutAndCloseDrawer = () => {
    logout();
    handleNavigationAndCloseDrawer('/');
  };

  const DrawerNavItem = ({ item, isAccountItem = false }: { item: { label: string; path: string; icon: JSX.Element }, isAccountItem?: boolean }) => {
  const isActive = useMatch({ path: item.path, end: item.path === '/' || isAccountItem });

    return (
      <ListItem disablePadding onClick={() => handleNavigationAndCloseDrawer(item.path)}>
        <ListItemButton
          selected={!!isActive}
          sx={{
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.action.selected,
              '& .MuiListItemIcon-root': {
                color: theme.palette.primary.main,
              },
            },
            color: 'text.primary',
             '& .MuiListItemIcon-root': {
                color: 'text.primary',
            },
          }}>
          <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h6"
        sx={{ my: 2, color: theme.palette.primary.main }}>
        MovieHub
      </Typography>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        {mainNavItems.map((item) => (
          <DrawerNavItem key={`main-${item.path}`} item={item} />
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

      {/* Умовне відображення пунктів меню кабінету */}
      {user && user.role === UserRole.Customer && (
        <>
          <Typography variant="overline" display="block" sx={{ color: 'text.secondary', mt: 2, mb:1, px: 2, textAlign: 'left' }}>
            Мій кабінет
          </Typography>
          <List>
            {customerAccountNavItems.map((item) => (
              <DrawerNavItem key={`customer-${item.path}`} item={item} isAccountItem={true} />
            ))}
          </List>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
        </>
      )}

      <List>
        {user ? (
          <>
            {user.role !== UserRole.Customer && (
                <ListItem
                disablePadding
                onClick={() =>
                    handleNavigationAndCloseDrawer(
                    user.role === UserRole.Admin
                        ? '/admin/dashboard'
                        : '/account'
                    )
                }>
                <ListItemButton sx={{color: 'text.primary', '& .MuiListItemIcon-root': {color: 'text.primary'}}}>
                    <ListItemIcon sx={{ color: 'inherit' }}>
                    <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Кабінет" />
                </ListItemButton>
                </ListItem>
            )}
            <ListItem disablePadding onClick={handleLogoutAndCloseDrawer}>
              <ListItemButton sx={{color: 'text.primary', '& .MuiListItemIcon-root': {color: 'text.primary'}}}>
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Вийти" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              disablePadding
              onClick={() => handleNavigationAndCloseDrawer('/login')}>
              <ListItemButton sx={{color: 'text.primary', '& .MuiListItemIcon-root': {color: 'text.primary'}}}>
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Увійти" />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => handleNavigationAndCloseDrawer('/registration')}>
              <ListItemButton sx={{color: 'text.primary', '& .MuiListItemIcon-root': {color: 'text.primary'}}}>
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Зареєструватися" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={styles.menuButton}>
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: { xs: 1, md: 0 },
              display: 'flex',
              justifyContent: { xs: 'flex-end', md: 'flex-start' },
            }}>
            <LogoComponent />
          </Box>
          <Box sx={styles.desktopNavContainer}>
            <Stack direction="row" spacing={3} sx={styles.navLinksStack}>
              {mainNavItems.map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.primary.light,
                    fontWeight: isActive ? 600 : 400
                  })}>
                  <Typography variant="body1">{label}</Typography>
                </NavLink>
              ))}
            </Stack>
            <Box sx={styles.authContainer}>
              {user ? (
                <PrimaryButton
                  sx={styles.accountButton}
                  onClick={() =>
                    navigate(
                      user.role === UserRole.Customer
                        ? '/account'
                        : '/admin/dashboard',
                      { replace: true }
                    )
                  }>
                  Кабінет
                </PrimaryButton>
              ) : (
                <Box sx={styles.authBox}>
                  <Button
                    sx={styles.loginButton}
                    onClick={() => navigate('/login', { replace: true })}>
                    Увійти
                  </Button>
                  <PrimaryButton
                    sx={styles.registerButton}
                    onClick={() =>
                      navigate('/registration', { replace: true })
                    }>
                    Зареєструватися
                  </PrimaryButton>
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={styles.drawer}>
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}