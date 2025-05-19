import { Theme, SxProps } from '@mui/material/styles';

export const getPaginationStyles = (theme: Theme): SxProps<Theme> => ({
  '&& .MuiPaginationItem-root': {
    color: theme.palette.primary.contrastText,
    border: `1px solid #2b2420`,
    borderRadius: '0.4rem',
    transition: 'background-color 0.2s, color 0.2s',
    p: { md: '1rem 0.85rem', sm: '0.5rem 0.35rem', },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.light,
    },
  },
  '&& .Mui-selected': {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  '&& .MuiPaginationItem-ellipsis': {
    color: theme.palette.primary.contrastText,
    border: 'none',
    padding: '0',
    margin: '0',
    backgroundColor: 'transparent',
    '&:hover': {
        backgroundColor: 'transparent',
    }
  },
  '& .MuiPaginationItem-icon': {
    color: theme.palette.primary.contrastText,
  },
  '&.Mui-disabled .MuiPaginationItem-root': {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  '&.Mui-disabled .MuiPaginationItem-icon': {
    color: theme.palette.action.disabled,
  },
});