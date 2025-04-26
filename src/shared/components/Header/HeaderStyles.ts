import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  appBar: {
    paddingTop: '0.5rem',
    bgcolor: theme.palette.background.default,
    boxShadow: 'none',
  },
  toolbar: {
    width: '100%',
    maxWidth: { lg: 'lg', md: 'md', sm: 'sm' },
    margin: 'auto',
    justifyContent: 'space-between',
    position: 'relative',
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: theme.spacing(1.5),
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '40px',
    width: '40px',
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    borderRadius: '999px',
    backgroundColor: 'transparent',
    transition: 'all 0.3s ease',
    overflow: 'hidden',

    '&:hover, &:focus-within': {
      width: '220px',
      [`& .MuiInputBase-root`]: {
        opacity: 1,
        paddingLeft: '16px',
      },
    },
  },

  searchIconWrapper: {
    position: 'absolute',
    right: '8px',
    top: '8px',
    pointerEvents: 'none',
    color: theme.palette.common.white,
    zIndex: 1,
  },

  inputBase: {
    flexGrow: 1,
    width: '100%',
    opacity: 0,
    paddingLeft: 0,
    paddingRight: '40px',
    transition: 'all 0.3s ease',
    color: theme.palette.common.white,
    '& input': {
      padding: 0,
    },
  },

  navBar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  authBox: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  loginButton: {
    borderColor: theme.palette.common.white,
    color: theme.palette.common.white,
    textTransform: 'none',
    borderRadius: '1.5rem',
    border: 'none',
    padding: '0.5rem 1rem',
  },
  registerButton: {
    bgcolor: theme.palette.primary.main,
    textTransform: 'none',
    borderRadius: '1.5rem',
    padding: '0.5rem 1.25rem',
    '&:hover': {
      bgcolor: theme.palette.primary.dark
    },
  },
  accountButton: {
    bgcolor: theme.palette.primary.main,
    textTransform: 'none',
    borderRadius: '1.5rem',
    padding: '0.5rem 1.25rem',
    '&:hover': {
      bgcolor: theme.palette.primary.dark
    },
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    cursor: 'pointer',
  },
  userAvaterBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
