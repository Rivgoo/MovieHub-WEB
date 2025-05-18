import { Theme } from '@mui/material';
import heroBg from '../../../../../assets/img/FilmSearch-hero-bg.png';

const HeroSectionStyles = (theme: Theme) => ({
  heroBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    width: '100%',
    borderRadius: '15px',
    height: { xs: '150px', md: '250px' },
    backgroundImage: heroBg ? `url(${heroBg})` : '',
    backgroundSize: 'cover',
    backgroundPosition: 'bottom center',
    backgroundRepeat: 'no-repeat',

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
        rgba(30, 30, 30, 0.9) 0%,
        rgba(30, 30, 30, 0.7) 40%,
        rgba(30, 30, 30, 0.5) 70%,
        rgba(30, 30, 30, 0.3) 100%
      )`,
      zIndex: 1,
    },
    '& > *': {
      position: 'relative',
      zIndex: 2,
    },
  },
  heroTitle: {
    fontWeight: 600,
    textAlign: 'center',
    mb: 1,
    color: theme.palette.primary.light,
  },
  heroSubTitle: {
    color: theme.palette.text.primary,
    opacity: 0.65,
    textAlign: 'center',
  },
});

export default HeroSectionStyles;
