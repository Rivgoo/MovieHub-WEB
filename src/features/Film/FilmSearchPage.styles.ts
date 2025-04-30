import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  wrapper: {
    mt: 4,
    mb: 4,
    display: 'flex',
    justifyContent: 'center',
    background: theme.palette.background.default,
    height: '100%',
  },
  form: {
    // p: 4,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: 600, mb: 2, color: theme.palette.primary.light },
  subText: {
    mb: 2,
    color: theme.palette.text.primary,
    opacity: 0.6,
    textAlign: 'center',
  },
  inputArea: {
    //maxWidth: '300px', //Як на макеті
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.primary.light,
        borderRadius: '20px',
      },
    },
    '& input': {
      color: theme.palette.primary.light,
    },
    '& .MuiInputAdornment-root': {
      color: theme.palette.primary.light,
    },
  },
});
