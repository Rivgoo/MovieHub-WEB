import Box from '@mui/material/Box';

export default function Logo() {
  const logoSrc = '/logo.svg';
  return (
    <Box
      component="img"
      src={logoSrc}
      alt="Logo"
      sx={{ height: '40px', width: 'auto', display: 'block' }}
    />
  );
}
