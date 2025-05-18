import { Box } from '@mui/material';
import './AdminLayoutStyles.css';
import { ReactNode } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import MetaTags from './../../shared/components/MetaTag/MetaTags';

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const adminSiteNameSuffix = " | Admin MovieHub";
  const effectiveTitle = pageTitle ? `${pageTitle}${adminSiteNameSuffix}` : `Адмін Панель${adminSiteNameSuffix}`;
  const defaultAdminDescription = "Адміністративна панель MovieHub для керування контентом, користувачами та сеансами.";

  return (
    <Box className="adminLayout">
      <MetaTags
        title={effectiveTitle}
        description={defaultAdminDescription}
        robots="noindex, nofollow"
      />
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