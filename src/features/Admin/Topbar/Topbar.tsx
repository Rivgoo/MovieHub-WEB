import { Box, Typography } from '@mui/material';
import './Topbar.css';
import { useState, useEffect } from 'react';

const Topbar = () => {
  const [menuOpen] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <Box className="topbar">
      <Box className="profileBox">
        <Box>
          <Typography className="profileName">UserName</Typography>
          <Typography className="profileRole">Email</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
