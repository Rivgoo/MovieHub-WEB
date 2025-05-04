import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  wraper: {},
  form: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selector: {
    width: '100%',
    maxWidth: '200px',
    border: `1px solid ${theme.palette.primary.dark}`,
    colors: theme.palette.text.primary,
  },
  selectorItem: {
    color: theme.palette.text.secondary,
    backgroundColor: 'transparent',
  },
});
