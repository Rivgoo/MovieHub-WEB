import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '0.85rem',
  textTransform: 'none',
  color: theme.palette.secondary.contrastText,
  transition: 'all 0.3s ease',
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  ':disabled': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.secondary.main,
  }
}));

export const PulseButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '0.85rem',
  textTransform: 'none',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.secondary.contrastText,
  '&:after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '5px',
    height: '5px',
    background: theme.palette.secondary.contrastText,
    opacity: 0,
    borderRadius: '100%',
    transform: 'scale(1)',
    transformOrigin: 'center',
    animation: 'ripple 2s infinite',
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.5,
    },
    '100%': {
      transform: 'scale(50)',
      opacity: 0,
    },
  },
  ':disabled': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.secondary.main,
  }
}));

export const RotateIconButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '& .MuiButton-startIcon': {
    transition: 'transform 0.3s ease',
    color: theme.palette.primary.main,
  },
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  '&:hover .MuiButton-startIcon': {
    transform: 'rotate(360deg)',
  },
}));

export const LiftShadowButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.secondary.contrastText,
  textTransform: 'none',
  borderRadius: '0.85rem',
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)',
  },
  ':disabled': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.secondary.main,
  }
}));

export const FillBorderButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.light,
  textTransform: 'none',
  borderRadius: '0.85rem',
  background: 'transparent',
  transition: 'all 0.3s ease',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: '100%',
    background: theme.palette.primary.main,
    transition: 'width 0.3s ease',
    zIndex: -1,
  },
  '&:hover:before': {
    width: '100%',
  },
  '&:hover': {
    color: theme.palette.secondary.contrastText,
  },
  ':disabled': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.secondary.main,
  }
}));

export const BorderButton = styled(Button)(({ theme }) => ({
  border: `2px solid ${theme.palette.primary.light}`,
  color: theme.palette.secondary.contrastText,
  textTransform: 'none',
  borderRadius: '0.85rem',
  background: 'transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
  }
}));

export const NeonButton = styled(Button)(({ theme }) => ({
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: '0.85rem',
  color: theme.palette.primary.main,
  textTransform: 'none',
  background: 'transparent',
  transition: 'all 0.3s ease',
  boxShadow: `0 0 10px ${theme.palette.primary.main}`,
  '&:hover': {
    boxShadow: `0 0 20px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.main}`,
    background: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

export const GlowButton = styled(Button)(({ theme }) => ({
  background: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  textTransform: 'none',
  borderRadius: '0.85rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: `0 0 15px ${theme.palette.secondary.main}`,
  },
}));
