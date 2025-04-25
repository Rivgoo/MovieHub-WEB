import {Theme} from "@mui/material";

export default (theme: Theme) => ({
	appBar: {
		bgcolor: "#1c1f2e",
		boxShadow: "none",
	},
	toolbar: {
		justifyContent: "space-between",
		position: "relative",
	},
	logoBox: {
		display: "flex",
		alignItems: "center",
		cursor: "pointer",
		gap: theme.spacing(1.5),
	},
	searchBox: {
		position: "absolute",
		left: "50%",
		transform: "translateX(-50%)",
		display: "flex",
		alignItems: "center",
		bgcolor: "#2a2d3e",
		px: 2,
		borderRadius: "20px",
		width: "300px",
		height: "36px",
	},
	searchIcon: {
		color: theme.palette.text.primary,
		marginRight: theme.spacing(1),
	},
	inputBase: {
		color: theme.palette.common.white,
		width: "100%",
	},
	rightBox: {
		display: "flex",
		alignItems: "center",
		gap: theme.spacing(2),
	},
	citySelectForm: {
		minWidth: 140,
	},
	citySelect: {
		color: theme.palette.common.white,
		borderColor: theme.palette.common.white,
		".MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.common.white,
		},
		"&:hover .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.common.white,
		},
		"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.common.white,
		},
		"& .MuiSelect-icon": {
			color: theme.palette.common.white,
		},
	},
	cityMenuPaper: {
		bgcolor: "#1c1f2e",
		color: theme.palette.common.white,
	},
	userBox: {
		display: "flex",
		alignItems: "center",
		gap: theme.spacing(1.2),
	},
	userNameBox: {
		textAlign: "right",
		maxWidth: 160,
		overflow: "hidden",
	},
	userName: {
		color: theme.palette.common.white,
		fontWeight: 500,
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		cursor: "pointer",
	},
	userRole: {
		color: theme.palette.common.white,
		fontSize: "0.8rem",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
	dropdownIcon: {
		color: theme.palette.common.white,
	},
	userMenuPaper: {
		bgcolor: "#1c1f2e",
		color: theme.palette.common.white,
	},
	authBox: {
		display: "flex",
		alignItems: "center",
		gap: theme.spacing(1),
	},
	loginButton: {
		borderColor: theme.palette.common.white,
		color: theme.palette.common.white,
		textTransform: "none",
		"&:hover": {
			borderColor: theme.palette.primary.dark,
			color: theme.palette.primary.dark,
		},
	},
	registerButton: {
		bgcolor: theme.palette.primary.dark,
		textTransform: "none",
		"&:hover": {
			bgcolor: "#e65c12",
		},
	},
});
