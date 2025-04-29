import { Theme } from '@mui/material';

export const drawerWidth = 240;

export default (theme: Theme) => ({
  appBar: {
    paddingTop: '0.5rem',
    bgcolor: theme.palette.background.default,
    boxShadow: 'none',
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: {
    width: '100%',
    maxWidth: { lg: 'lg', md: 'md', sm: 'sm' },
    margin: 'auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    minHeight: '64px',
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: theme.spacing(1.5),
  },

  desktopNavContainer: {
    width: '100%',
    pl: '1.5rem',
    justifyContent: 'space-between',
    display: { xs: 'none', md: 'flex' },
    alignItems: 'center'
  },
  navLinksStack: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  authContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
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
      bgcolor: theme.palette.primary.dark,
    },
  },
  accountButton: {
    bgcolor: theme.palette.primary.main,
    textTransform: 'none',
    borderRadius: '1.5rem',
    padding: '0.5rem 1.25rem',
    '&:hover': {
      bgcolor: theme.palette.primary.dark,
    },
  },

  menuButton: {
    padding: 0,
    width: '55px',
    height: '20px',
    color: theme.palette.primary.light,
    display: { xs: 'flex', md: 'none' },
  },
  drawer: {
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: drawerWidth,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.primary.light,
    },
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
  }
});
