import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import getStyles from "./HeaderStyles";
import Logo from "../../../assets/svg/Logo";
import {useAuth} from "../../../core/auth/useAuth";
import {NavLink} from "react-router-dom";

import {BorderButton, PrimaryButton} from "../Buttons";

type Props = {};

export default function Header({}: Props) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <AppBar position="static" sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        <LogoAndNav />
        <SearchAndLocation />
      </Toolbar>
    </AppBar>
  );
}

const navItems = [
  {label: "Головна", path: "/"},
  {label: "Сеанси", path: "/sessions"},
  {label: "Фільми", path: "/movies"},
];

function LogoAndNav({}: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleToHomePage = () => navigate("/", {replace: true});

  return (
    <Box sx={{display: "flex", alignItems: "center", gap: theme.spacing(4)}}>
      <Box sx={styles.logoBox} onClick={handleToHomePage}>
        <Logo />
        <Typography variant="h6" color="white" fontWeight="bold">
          MovieHub
        </Typography>
      </Box>

      <Stack direction="row" spacing={3}>
        {navItems.map(({label, path}) => (
          <NavLink
            key={path}
            to={path}
            style={({isActive}) => ({
              textDecoration: "none",
              color: isActive ? "#FF6715" : "#FFFFFF",
              fontWeight: isActive ? 600 : 400,
              transition: "color 0.3s",
            })}
          >
            <Typography variant="body1">{label}</Typography>
          </NavLink>
        ))}
      </Stack>
    </Box>
  );
}

function SearchAndLocation({}: Props) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Box sx={styles.rightBox}>
      <Box sx={styles.searchBox}>
        <InputBase placeholder="Пошук" sx={styles.inputBase} />
        <Box sx={styles.searchIconWrapper}>
          <SearchIcon />
        </Box>
      </Box>

      <FormControl size="small" sx={styles.citySelectForm}>
        {/* TODO: змінити дефолтне значення*/}
        <Select
          defaultValue="kyiv"
          sx={styles.citySelect}
          MenuProps={{
            PaperProps: {
              sx: styles.cityMenuPaper,
            },
          }}
        >
          {/* TODO: зробити варіанти вибору через .map */}
          <MenuItem value="kyiv">Київ</MenuItem>
          <MenuItem value="lviv">Львів</MenuItem>
          <MenuItem value="lutsk">Луцьк</MenuItem>
          <MenuItem value="odesa">Одеса</MenuItem>
          <MenuItem value="dnipro">Дніпро</MenuItem>
        </Select>
      </FormControl>
      <UserBlockOrAuth />
    </Box>
  );
}

function UserBlockOrAuth({}: Props) {
  const navigate = useNavigate();

  const theme = useTheme();
  const styles = getStyles(theme);

  const {user, logout} = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login", {replace: true});
  };

  // TODO: передати реальне покликання на профіль
  const handleToProfilePage = () => navigate("/profile", {replace: true});

  const handleToLoginPage = () => navigate("/login", {replace: true});

  // TODO: прередати реальне покликання на форму реєстрації
  const handleToRegisterPage = () => navigate("/register", {replace: true});

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {user ? (
        <Box sx={styles.userBox}>
          {/* TODO: розкоментувати та встановити значення якщо буде реалізоване фото профіля */}
          {/* <Avatar src="/user.jpg" alt="User avatar" /> */}
          <Box sx={styles.userNameBox}>
            {/* TODO: Змінити user.id на user.name */}
            <Typography sx={styles.userName} onClick={handleToProfilePage}>
              {user?.id}
            </Typography>
            {/* TODO: Роль показується тільки коли користовач авторизований
								тобто Admin або User, гості побачать просто кнопки.
								Тому можливо варто видалити взагалі показ ролі?*/}
            <Typography sx={styles.userRole}>{user?.role}</Typography>
          </Box>
          <IconButton onClick={handleMenuOpen} sx={styles.dropdownIcon}>
            <KeyboardArrowDownIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: styles.userMenuPaper,
            }}
          >
            <MenuItem onClick={handleToProfilePage}>Профіль</MenuItem>
            <MenuItem onClick={handleLogout}>Вийти</MenuItem>
          </Menu>
        </Box>
      ) : (
        <Box sx={styles.authBox}>
          <BorderButton
            variant="outlined"
            sx={styles.loginButton}
            onClick={handleToLoginPage}
          >
            Увійти
          </BorderButton>
          <PrimaryButton
            variant="contained"
            sx={styles.registerButton}
            onClick={handleToRegisterPage}
          >
            Зареєструватися
          </PrimaryButton>
        </Box>
      )}
    </>
  );
}
