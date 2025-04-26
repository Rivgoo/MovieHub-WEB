import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  InputBase,
  Stack,
  Button,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, NavLink } from 'react-router-dom';
import Logo from '../../../assets/svg/Logo';
import { useAuth } from '../../../core/auth/useAuth';
import { PrimaryButton } from '../Buttons';
import getStyles from './HeaderStyles';

const navItems = [
  { label: 'Головна', path: '/' },
  { label: 'Фільми', path: '/film-search' },
  { label: 'Сеанси', path: '/session-search' },
];

function LogoAndNav() {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleToHomePage = () => navigate('/', { replace: true });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(3) }}>
      <Box sx={styles.logoBox} onClick={handleToHomePage}>
        <Logo />
        <Typography variant="h6" color="white" fontWeight="bold">
          MovieHub
        </Typography>
      </Box>

      <Stack direction="row" spacing={3}>
        {navItems.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive
                ? theme.palette.primary.main
                : theme.palette.primary.light,
              fontWeight: 400,
            })}>
            <Typography variant="body1">{label}</Typography>
          </NavLink>
        ))}
      </Stack>
    </Box>
  );
}

function UserBlockOrAuth() {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = getStyles(theme);
  const { user } = useAuth();

  const handleToAccountPage = () =>
    navigate(user?.role === 'Customer' ? '/account' : '/admin/dashboard', {
      replace: true,
    });
  const handleToLoginPage = () => navigate('/login', { replace: true });
  const handleToRegisterPage = () =>
    navigate('/registration', { replace: true });

  return user ? (
    <PrimaryButton sx={styles.accountButton} onClick={handleToAccountPage}>
      Кабінет
    </PrimaryButton>
  ) : (
    <Box sx={styles.authBox}>
      <Button sx={styles.loginButton} onClick={handleToLoginPage}>
        Увійти
      </Button>
      <PrimaryButton sx={styles.registerButton} onClick={handleToRegisterPage}>
        Зареєструватися
      </PrimaryButton>
    </Box>
  );
}

function FilmSearchInput() {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Box sx={styles.navBar}>
      <Box sx={styles.searchBox}>
        <InputBase placeholder="Шукайте фільм тут" sx={styles.inputBase} />
        <Box sx={styles.searchIconWrapper}>
          <SearchIcon />
        </Box>
      </Box>
      <UserBlockOrAuth />
    </Box>
  );
}

export default function Header() {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <AppBar position="static" sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        <LogoAndNav />
        <FilmSearchInput />
      </Toolbar>
    </AppBar>
  );
}
