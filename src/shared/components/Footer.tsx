import React from "react";
import {Box, Typography, Link} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/svg/Logo';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const iconStyles = {
    mr: 0.75,
    fontSize: '1.1rem',
    verticalAlign: 'middle',
    color: "primary.light"
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "secondary.main",
        color: "secondary.contrastText",
        py: {xs: 4, md: 6},
        width: "100%",
      }}
    >
      <Box sx={{
        mx: "auto",
        width: "100%",
        maxWidth: { lg: 'lg', md: 'md', sm: 'sm', xs: 'xs' },
        px: 2,
      }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr auto 1fr', 
            },
            alignItems: 'center', 
            gap: { xs: 3, sm: 2 },
          }}
        >
          <Box
            sx={{
              textAlign: { xs: "center", sm: "left" },
              order: { xs: 2, sm: 1 },
            }}
          >
            <Typography variant="body2" sx={{mb: 1, display: 'flex', alignItems: 'center', justifyContent: {xs: 'center', sm: 'flex-start'} }}>
              <EmailOutlinedIcon sx={iconStyles} />
              Email: develop@gmail.com
            </Typography>
            <Typography variant="body2" sx={{mb: 1, display: 'flex', alignItems: 'center', justifyContent: {xs: 'center', sm: 'flex-start'} }}>
              <PhoneOutlinedIcon sx={iconStyles} />
              Телефон: +380 12 34 56 78
            </Typography>
            <Typography variant="body2" sx={{display: 'flex', alignItems: 'center', justifyContent: {xs: 'center', sm: 'flex-start'} }}>
              <LocationOnOutlinedIcon sx={iconStyles} />
              Адерса: Україна, Рівне, 1234
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              color: "primary.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              order: { xs: 1, sm: 2 },
            }}
          >
            <Logo />
            MovieHub
          </Typography>

          <Box
            sx={{
              order: { xs: 3, sm: 3 },
              display: 'flex',           
              flexDirection: 'column', 
              alignItems: { xs: 'center', sm: 'flex-end' } 
            }}
          >
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/privacy'); 
              }}
              color="inherit"
              underline="hover"
              sx={{
                mb: 1,
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Політика конфіденційності
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/terms'); 
              }}
              color="inherit"
              underline="hover"
              sx={{
                mb: 1,
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Умови використання
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/about'); 
              }}
              color="inherit"
              underline="hover"
              sx={{
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Про нас
            </Link>
          </Box>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            mt: { xs: 4, md: 5 },
            pt: 3,
            borderTop: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} MovieHub. Всі права захищені.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;