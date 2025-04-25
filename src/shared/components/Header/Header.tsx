import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	InputBase,
	Menu,
	MenuItem,
	IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import getStyles from "./HeaderStyles";
import Logo from "../../../assets/svg/Logo";
import {useAuth} from "../../../core/auth/useAuth";
import {BorderButton, PrimaryButton } from "../../../shared/components/Buttons";

type Props = {};

export default function Header({}: Props) {
	const {user, logout} = useAuth();
	const navigate = useNavigate();

	const theme = useTheme();
	const styles = getStyles(theme);

	const handleLogout = () => {
		logout();
		navigate("/login", {replace: true});
	};

	const handleToHomePage = () => navigate("/", {replace: true});

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
		<AppBar position="static" sx={styles.appBar}>
			<Toolbar sx={styles.toolbar}>
				<Box sx={styles.logoBox} onClick={handleToHomePage}>
					<Logo />
					<Typography variant="h6" color="white" fontWeight="bold">
						MovieHub
					</Typography>
				</Box>

				<Box sx={styles.searchBox}>
					<SearchIcon sx={styles.searchIcon} />
					<InputBase placeholder="Пошук" sx={styles.inputBase} />
				</Box>

				<Box sx={styles.rightBox}>
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
								sx={styles.loginButton}
								onClick={handleToLoginPage}
							>
								Увійти
							</BorderButton>
							<PrimaryButton
								sx={styles.registerButton}
								onClick={handleToRegisterPage}
							>
								Зареєструватися
							</PrimaryButton>
						</Box>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
}
