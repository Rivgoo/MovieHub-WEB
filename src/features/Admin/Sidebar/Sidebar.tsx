import { Box, Button, Typography, List, ListItem, ListItemText, Drawer, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useEffect } from 'react';
import './Sidebar.css';
import { Divider } from '@mui/material';

const Sidebar = () => {
  const [selectedAdminItem, setSelectedAdminItem] = useState<string | null>(null);
  const [selectedSiteItem, setSelectedSiteItem] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAdminItemClick = (item: string): void => {
    setSelectedAdminItem(item);
    setDrawerOpen(false);
  };

  const handleSiteItemClick = (item: string): void => {
    setSelectedSiteItem(item);
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
      <Box className="logoBox" sx={{ display: 'flex', alignItems: 'center', justifyContent: isDrawer ? 'flex-end' : 'flex-start', padding: isDrawer ? '20px' : '5px 20px' }}>
        <img src="../logo.webp" alt="Logo" className="logoImage" />
        {!isDrawer && (
          <Typography variant="h6" className="logoText" sx={{ marginLeft: isDrawer ? '8px' : '12px', fontSize: '25px', fontWeight: 'bold' }}>
            MovieHub
          </Typography>
        )}
      </Box>

      <Box className={`adminMenuSection ${drawerOpen ? 'burgerActive' : ''}`}>
        <List className="listMenu">
          <ListItem className={`adminMenuItem ${selectedAdminItem === 'Панель адміністратора' ? 'active' : ''}`} onClick={() => handleAdminItemClick('Панель адміністратора')}>
            <ListItemText primary="Панель адміністратора" className="listItemTextBold" />
          </ListItem>
          {['Фільми', 'Сеанси', 'Кінозали', 'Жанри', 'Актори', 'Користувачі', 'Бронювання'].map((text) => (
            <ListItem key={text} className={`adminMenuItem ${selectedAdminItem === text ? 'active' : ''}`} onClick={() => handleAdminItemClick(text)}>
              <ListItemText primary={text} className="listItemText" />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2, borderColor: 'gray' }} />

      <Box className="siteMenuSection">
        <Typography variant="caption" className="sectionTitle" sx={{ fontSize: '16px', paddingLeft: drawerOpen ? '10%' : '0' }}>
          Сайт
        </Typography>
        <List className={`siteMenu ${drawerOpen ? 'siteMenuActive' : ''}`}>
          {isDrawer ? (
            <ListItem className={`siteMenuItem ${selectedSiteItem === 'Перейти на сайт' ? 'active' : ''}`} onClick={() => handleSiteItemClick('Перейти на сайт')}>
              <ListItemText primary="MovieHub.com" className="listItemText" />
            </ListItem>
          ) : (
            ['Головна', 'Бронювання', 'Розклад сеансів', 'Фільми', 'Обране', 'Профіль'].map((text) => (
              <ListItem key={text} className={`siteMenuItem ${selectedSiteItem === text ? 'active' : ''}`} onClick={() => handleSiteItemClick(text)}>
                <ListItemText primary={text} className="listItemText" />
              </ListItem>
            ))
          )}
        </List>
      </Box>

      <Box className="logoutBox">
        <Button
          variant="contained"
          sx={{ backgroundColor: 'var(--primary-dark)', width: drawerOpen ? '180px' : '75%', '&:hover': { backgroundColor: 'var(--primary-main)' } }}
          startIcon={<LogoutIcon />}
          className="logoutButton"
        >
          Вийти
        </Button>
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
          zIndex: 1300,
          '@media (max-width: 750px)': { top: 19 },
        }}
      >
        <Box className={`burgerLines ${drawerOpen ? 'open' : ''}`}>
          <span />
          <span />
        </Box>
      </IconButton>

      <Box className="sidebar" sx={{ display: { xs: 'none', md: 'flex' } }}>
        {renderSidebarContent(false)}
      </Box>

      <Drawer anchor="left" open={drawerOpen} onClose={handleToggleDrawer}>
        <Box sx={{ width: '100vw', backgroundColor: '#1a1a1a', height: '100%' }}>
          {renderSidebarContent(true)}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
