import { Box } from '@mui/material';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <Box className="dashboardPage">
      {/* Sidebar */}
      <Box className="sidebarContainer">
        <Sidebar />
      </Box>

      {/* Right Side */}
      <Box className="rightSide">
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <Box className="mainContent">
          {}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;