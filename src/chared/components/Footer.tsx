import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'secondary.main', 
        color: 'secondary.contrastText', 
        py: { xs: 4, md: 6 },
        mt: 'auto',
        width: '100%',
      }}
    >
      {/* Background */}
      <Box sx={{ maxWidth: '70%', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: { xs: 'center', sm: 'space-evenly' },
            textAlign: { xs: 'center', sm: 'left' }, 
            alignItems: { xs: 'center', sm: 'center' },
          }}
        >
          {/* Column 1 */}
          <Box sx={{
            flex: { xs: '100%', sm: '1 1 33%' },
            maxWidth: { sm: '33%' },
            textAlign: { xs: 'center', sm: 'left' } 
          }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: develop@gmail.com
            </Typography>
            <Typography variant="body2"sx={{ mb: 1 }}>
              Phone number: +380 99 999 99 99
            </Typography>
            <Typography variant="body2">
                Address: Ukraine, Kyiv, 123456
            </Typography>
          </Box>

          {/* Logo */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              color: 'primary.main', 
              display: 'flex',
              alignItems: 'center',
              gap: 1, 
              my: { xs: 2, sm: 0 }, 
            }}
          >
            <img
              src="https://i.postimg.cc/bJFFRDrc/logo.png"
              alt="Logo"
              style={{ width: '40px' }}
            />
            MovieHub
          </Typography>

        {/* Column 2 */}
          <Box sx={{
            flex: { xs: '100%', sm: '1 1 33%' },
            maxWidth: { sm: '33%' },
            textAlign: { xs: 'center', sm: 'right' } 
          }}>
            <Link 
              href="#"
              color="inherit"
              underline="hover"
              display="block"
              sx={{ mb: 1 }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              display="block"
              sx={{ mb: 1 }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              display="block"
              sx={{ mb: 1 }}
            >
              About Us
            </Link>
          </Box>
        </Box>

        {/* Bottom: copyright */}
        <Box
          sx={{
            textAlign: 'center',
            mt: { xs: 3, md: 4 },
            pt: 2,
            borderTop: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
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