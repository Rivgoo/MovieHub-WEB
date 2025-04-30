import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Drawer,
  IconButton,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useEffect } from 'react';
import './Sidebar.css';
import { Divider } from '@mui/material';
import { PrimaryButton } from '../../../shared/components/Buttons';

const Sidebar = () => {
  const [selectedAdminItem, setSelectedAdminItem] = useState<string | null>(
    null
  );

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAdminItemClick = (item: string): void => {
    setSelectedAdminItem(item);
    setDrawerOpen(false);
  };

  const handleToggleDrawer = (): void => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900 && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [drawerOpen]);

  const renderSidebarContent = (isDrawer: boolean) => (
    <Box className="sidebarContent">
      <Box
        className="logoBox"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isDrawer ? 'flex-end' : 'flex-start',
          padding: isDrawer ? '20px' : '5px 20px',
        }}>
        <img src="../logo.svg" alt="Logo" className="logoImage" />
        {!isDrawer && (
          <Typography
            variant="h6"
            className="logoText"
            sx={{ marginLeft: '4px', fontSize: '20px', fontWeight: 'bold' }}>
            MovieHub
          </Typography>
        )}
      </Box>

      <Box className={`adminMenuSection ${drawerOpen ? 'burgeradminMenuItemActive' : ''}`}>
        <List className="listMenu">
          <ListItem
            className={`adminMenuItem ${selectedAdminItem === 'Головна' ? 'adminMenuItemActive' : ''}`}
            onClick={() => handleAdminItemClick('Головна')}>
            <ListItemText
              primary="Головна"
              className="listItemTextBold"
            />
          </ListItem>
          {[
            'Фільми',
            'Сеанси',
            'Кінозали',
            'Жанри',
            'Актори',
            'Користувачі',
            'Бронювання',
          ].map((text) => (
            <ListItem
              key={text}
              className={`adminMenuItem ${selectedAdminItem === text ? 'adminMenuItemActive' : ''}`}
              onClick={() => handleAdminItemClick(text)}>
              <ListItemText primary={text} className="listItemText" />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2, borderColor: 'gray' }} />

      <Box className="logoutBox">
        <PrimaryButton variant="contained" sx={{ width: '75%' }}>
          На сайт
        </PrimaryButton>

        <PrimaryButton
          variant="contained"
          sx={{ marginTop: '0.75rem', width: '75%' }}
          startIcon={<LogoutIcon />}>
          Вийти
        </PrimaryButton>
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        className="burgerButton"
        onClick={handleToggleDrawer}
        sx={{
          position: 'absolute',
          top: 25,
          left: 16,
          zIndex: 1300
        }}>
        <Box className={`burgerLines ${drawerOpen ? 'open' : ''}`}>
          <span />
          <span />
        </Box>
      </IconButton>

      <Box className="sidebar" sx={{ display: { xs: 'none', md: 'flex' } }}>
        {renderSidebarContent(false)}
      </Box>

      <Drawer anchor="left" open={drawerOpen} onClose={handleToggleDrawer}>
        <Box
          sx={{ width: '100vw', backgroundColor: '#1a1a1a', height: '100%' }}>
          {renderSidebarContent(true)}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
