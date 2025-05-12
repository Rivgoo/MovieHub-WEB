import { Theme } from '@mui/material';
import heroBg from '../../../../assets/img/SessionSearch-hero-bg.png';

const getSessionSearchHeroStyles = (theme: Theme) => ({
  heroBox: {
    position: 'relative',
    width: '100%',
    borderRadius: '15px',
    height: { xs: '150px', md: '250px' },
    backgroundImage: heroBg ? `url(${heroBg})` : '',
    backgroundSize: 'cover',
    backgroundPosition: 'bottom center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    paddingTop: 'var(--header-mobile-height)',
    color: 'var(--text-light)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(
        to top,
        rgba(30, 30, 30, 1)   0%,
        rgba(30, 30, 30, 0.8) 25%,
        rgba(30, 30, 30, 0.4) 60%,
        rgba(30, 30, 30, 0.1) 100%
      )`,
      zIndex: 1,
    },
    '& > *': {
      position: 'relative',
      zIndex: 2,
    },
  },
  heroText: {
    color: theme.palette.common.white,
    zIndex: 2,
  },
});

export default getSessionSearchHeroStyles;
