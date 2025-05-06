import { Box } from '@mui/material';
import './AdminLayoutStyles.css';
import { ReactNode } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box className="adminLayout">
      <Box className="sidebarContainer">
        <Sidebar />
      </Box>

      <Box className="rightSide">
        <Topbar />
        <Box className="mainContent">{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
