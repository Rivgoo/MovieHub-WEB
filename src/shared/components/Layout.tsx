import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Footer from './Footer';
import Header from './Header/Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;