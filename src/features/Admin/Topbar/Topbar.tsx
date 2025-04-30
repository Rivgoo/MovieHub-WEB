import { Box, InputBase, Avatar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './Topbar.css';
import { useState, useEffect } from 'react';

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);  
  const [selectedUser, setSelectedUser] = useState<string>('Profile 1'); 
  const [userRole, setUserRole] = useState<string>('Адміністратор'); 

  const handleMenuToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);  
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);  
    setMenuOpen(false);
  };

  const handleSelectUser = (userName: string, role: string) => {
    setSelectedUser(userName); 
    setUserRole(role); 
    handleCloseMenu();  
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''; 
    };
  }, [menuOpen]);

  return (
    <Box className="topbar">
      {/* Пошук */}
      <Box className="searchBox">
        <SearchIcon className="searchIcon" />
        <InputBase
          placeholder="Пошук"
          className="searchInput"
        />
      </Box>

      {/* Профіль */}
      <Box className="profileBox">
        <Avatar
          src="/avatar.jpg"
          alt="Profile"
          className="profileAvatar"
        />
        <Box>
          <Typography className="profileName">
            {selectedUser}
          </Typography>
          <Typography className="profileRole">
            {userRole}
          </Typography>
        </Box>
        {/* Стрілочка для відкриття меню */}
        <IconButton onClick={handleMenuToggle}>
          <ExpandMoreIcon
            sx={{
              color: 'white',
              transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
              transition: 'transform 0.3s ease', 
            }}
          />
        </IconButton>

        {/* Випадаюче меню */}
        <Menu
  disablePortal
  disableScrollLock
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleCloseMenu}
  sx={{
    '& .MuiMenu-paper': {
      backgroundColor: '#333',
      borderRadius: '8px',
      width: '230px',  
      marginTop: '15px',
      marginLeft: '-20px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
      zIndex: 1300,
      '@media (max-width:900px)': {
        width: '200px',
        marginLeft: '-33px', 
      },
      '@media (max-width:750px)': {
        width: '180px',
        marginLeft: '-33px', 
      },
      '@media (max-width:600px)': {
        width: '180px',
        marginLeft: '-5px', 
      },
    },
  }}
>
          {/* Профілі */}
          <MenuItem onClick={() => handleSelectUser('Profile 1', 'Користувач')} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src="/profile1.jpg" alt="Profile 1" sx={{ marginRight: 2 }} />
            <Box>
              <Typography variant="body1">Profile 1</Typography>
              <Typography variant="body2" color="gray">Користувач</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={() => handleSelectUser('Profile 2', 'Адміністратор')} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src="/profile2.jpg" alt="Profile 2" sx={{ marginRight: 2 }} />
            <Box>
              <Typography variant="body1">Profile 2</Typography>
              <Typography variant="body2" color="gray">Адміністратор</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={() => handleSelectUser('Profile 3', 'Користувач')} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src="/profile3.jpg" alt="Profile 3" sx={{ marginRight: 2 }} />
            <Box>
              <Typography variant="body1">Profile 3</Typography>
              <Typography variant="body2" color="gray">Користувач</Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;

