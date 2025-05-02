import React from "react";
import {Box, Typography, Link} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/svg/Logo';

const Footer: React.FC = () => {
  const navigate = useNavigate();

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
      {/* Background */}

      <Box sx={{
        mx: "auto",
        width: "100%",
        maxWidth: { lg: 'lg', md: 'md', sm: 'sm', xs: 'xs' },
        px: 2,
      }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: { xs: "center", sm: "center" },
            gap: { xs: 3, sm: 2 },
          }}
        >
          {/* Column 1 */}
          <Box
            sx={{
              textAlign: { xs: "center", sm: "left" },
              order: { xs: 2, sm: 1 },
            }}
          >
            <Typography variant="body2" sx={{mb: 1}}>
              Email: develop@gmail.com
            </Typography>
            <Typography variant="body2" sx={{mb: 1}}>
              Phone number: +380 99 999 99 99
            </Typography>
            <Typography variant="body2">
              Address: Ukraine, Kyiv, 123456
            </Typography>
          </Box>

          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              color: "primary.main",
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

          {/* Column 2 */}
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
              Privacy Policy
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
              Terms of Service
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
              About Us
            </Link>
          </Box>
        </Box>

        {/* Bottom: copyright */}
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
            © {new Date().getFullYear()} MovieHub. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
