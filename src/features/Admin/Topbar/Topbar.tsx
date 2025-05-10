import { Box, Typography } from '@mui/material';
import './Topbar.css';
import { useState, useEffect } from 'react';

import {
  getMyUserInfo,
  UserInfoResponse,
  getUserInfoFromSession
} from '../../../core/api/userApi';

const Topbar = () => {
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(() => getUserInfoFromSession());
  const [loading, setLoading] = useState<boolean>(!userInfo);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setError(null);
      try {
        const data = await getMyUserInfo();
        setUserInfo(data); 
      } catch (err) {
        console.error("Topbar useEffect: Failed to load user info.", err);
        setError('Failed to load user info.');
        } finally {
        setLoading(false); 
      }
    };

    if (!userInfo)
      fetchUserInfo();
  }, []);

  const renderProfileContent = () => {
    if (loading && !userInfo) {
      return (
        <>
          <Typography className="profileName"> </Typography>
          <Typography className="profileRole"> </Typography>
        </>
      );
    }
    if (error && !userInfo) {
      return (
        <Typography className="profileName" color="error">
          {error}
        </Typography>
      );
    }
    if (userInfo) {
      return (
        <>
          <Typography className="profileName">
            {`${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() ||
              'User'}
          </Typography>
          <Typography className="profileRole">{userInfo.email}</Typography>
        </>
      );
    }
    return (
      <Typography className="profileName">User Info Unavailable</Typography>
    );
  };

  return (
    <Box className="topbar">
      <Box className="profileBox">
        <Box sx={{ textAlign: 'right' }}>{renderProfileContent()}</Box>
      </Box>
    </Box>
  );
};

export default Topbar;