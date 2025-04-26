import {Theme} from "@mui/material";

export default (theme: Theme) => ({
  appBar: {
    bgcolor: "#1e1e1e", // DarkBlue
    boxShadow: "none",
  },
  toolbar: {
    width: "100%",
    maxWidth: "70%",
    paddingLeft: "32px !important",
    paddingRight: "32px !important",
    marginLeft: "auto",
    marginRight: "auto",
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
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "40px",
    width: "40px",
    border: "2px solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "999px",
    backgroundColor: "transparent",
    transition: "all 0.3s ease",
    overflow: "hidden",

    "&:hover, &:focus-within": {
      width: "220px",
      [`& .MuiInputBase-root`]: {
        opacity: 1,
        paddingLeft: "16px",
      },
    },
  },

  searchIconWrapper: {
    position: "absolute",
    right: "8px",
    top: "8px",
    // transform: "translateY(-50%)",
    pointerEvents: "none",
    color: theme.palette.common.white,
    zIndex: 1,
  },

  inputBase: {
    flexGrow: 1,
    width: "100%",
    opacity: 0,
    paddingLeft: 0,
    paddingRight: "40px",
    transition: "all 0.3s ease",
    color: theme.palette.common.white,
    "& input": {
      padding: 0,
    },
  },

  rightBox: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  citySelectForm: {
    minWidth: 50,
  },
  citySelect: {
    color: theme.palette.common.white,
    borderColor: theme.palette.common.white,
    ".MuiOutlinedInput-notchedOutline": {
      border: "none",
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
