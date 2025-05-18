import { Theme } from '@mui/material';

const HeroSectionStyles = (theme: Theme) => ({
  heroBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // boxSizing: 'border-box',
    position: 'relative',
    width: '100%',
    borderRadius: '15px',
    height: { xs: '150px', md: '250px' },
    paddingTop: 'var(--header-mobile-height)',
    color: 'var(--text-light)',
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
