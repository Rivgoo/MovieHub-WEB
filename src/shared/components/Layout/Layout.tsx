import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Footer from '../Footer';
import Header from '../Header/Header';
import MetaTags from '../MetaTag/MetaTags';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const siteDefaultTitle = "MovieHub - Ваш персональний гід у світі кіно";
  const siteDefaultDescription = "Знаходьте фільми, дивіться трейлери, перевіряйте розклад сеансів та бронюйте квитки на MovieHub. Усе про кіно в одному місці!";

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MetaTags
        title={siteDefaultTitle}
        description={siteDefaultDescription}
        robots="index, follow"
        ogType='website'
      />
      <Header />
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;