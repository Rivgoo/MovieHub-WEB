import { Theme } from '@mui/material';

const FilterSectionStyles = (theme: Theme) => ({
  selectorWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    minWidth: '105px',
    maxWidth: '160px',
    width: '100%',
  },
  selectorLabelText: {
    fontSize: '0.85rem',
    fontWeight: 500,
    lineHeight: '1.66',
    pl: theme.spacing(1),
  },
  selectorSelector: {
    maxWidth: 'none',
    width: '100%',
    borderRadius: '0.5rem',
    border: `1px solid ${theme.palette.primary.dark}`,
    color: theme.palette.text.primary,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.dark,
    },
    '& .MuiSelect-icon': {
      color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
});

export default FilterSectionStyles;
