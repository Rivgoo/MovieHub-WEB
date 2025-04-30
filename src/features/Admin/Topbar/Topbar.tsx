import { Box, Typography } from '@mui/material';
import './Topbar.css';
import { useState, useEffect } from 'react';
import { getMyUserInfo, UserInfoResponse } from '../../../core/api/userApi';

const Topbar = () => {
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMyUserInfo();
        setUserInfo(data);
      } catch (err) {
        setError('Failed to load user info.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const renderProfileContent = () => {
    if (loading) {
      return (
        <>
          <Typography className="profileName">&nbsp;</Typography>
          <Typography className="profileRole">&nbsp;</Typography>
        </>
      );
    }
    if (error) {
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
