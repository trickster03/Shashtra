import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  IconButton,
  Drawer,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import { motion } from 'framer-motion';

// Styled components
const SidebarContainer = styled(Box)(({ theme, isCollapsed }) => ({
  width: isCollapsed ? 80 : 300,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRight: '2px solid rgba(255, 153, 51, 0.15)',
  position: 'fixed',
  top: 0,
  left: 0,
  transition: 'width 0.3s ease',
  overflow: 'hidden',
  zIndex: 1200,
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.1), rgba(19, 136, 8, 0.05))',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 153, 51, 0.2)',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  background: '#FF9933',
  color: 'white',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  width: '90%',
  '&:hover': {
    background: '#e88829',
  },
}));

const Sidebar = ({ 
  open, 
  onClose, 
  onCreateNewSession, 
  onLogout,
  navigate
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarContent = (
    <SidebarContainer isCollapsed={isCollapsed} className="fixed top-0 left-0">
      <HeaderContainer>
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h5" className={`font-bold text-amber-900 ${isCollapsed ? 'hidden' : 'block'}`} align="center">
            <strong>Shastra Chat</strong>
          </Typography>
          <IconButton 
            onClick={() => {
              if (window.innerWidth >= 1024) {
                toggleSidebar();
              } else {
                onClose();
              }
            }}
            className="cursor-pointer"
          >
            <MenuIcon />
          </IconButton>
        </Box>
        {!isCollapsed && (
          <Button
            onClick={onCreateNewSession}
            fullWidth
            variant="contained"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 
              py-3.5 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 
              hover:shadow-orange-500/20 hover:shadow-xl"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            <AddIcon className="mr-2" /> New Conversation
          </Button>
        )}
        {isCollapsed && (
          <IconButton
            onClick={onCreateNewSession}
            className="w-12 h-12 mx-auto bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white hover:shadow-lg"
          >
            <AddIcon />
          </IconButton>
        )}
      </HeaderContainer>

      {/* Empty space in the middle */}
      <Box sx={{ flex: 1 }} />

      {/* Metrics Section */}
      <Box 
        sx={{
          padding: '16px',
          width: '100%',
          borderTop: '1px solid rgba(255, 153, 51, 0.15)',
          background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.05), rgba(255, 255, 255, 0.95))',
        }}
      >
        {!isCollapsed ? (
          <Button
            startIcon={<BarChartIcon sx={{ color: 'white' }} />}
            onClick={() => navigate('/metrics')}
            fullWidth
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 
            py-3.5 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 
            hover:shadow-orange-500/20 hover:shadow-xl"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              marginBottom: 2,
              color: 'white',
              '& .MuiButton-startIcon': {
                color: 'white'
              }
            }}
          >
            Metrics
          </Button>
        ) : (
          <IconButton
            onClick={() => navigate('/metrics')}
            sx={{ 
              width: '48px',
              height: '48px',
              marginBottom: 2,
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block',
              background: 'linear-gradient(135deg, #FF9933, #f97316)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
              }
            }}
          >
            <BarChartIcon />
          </IconButton>
        )}
      </Box>

      {/* Logout section at the bottom */}
      <Box 
        className="mt-auto"
        sx={{
          padding: '16px',
          width: '100%',
          borderTop: '1px solid rgba(255, 153, 51, 0.15)',
          background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.05), rgba(255, 255, 255, 0.95))',
        }}
      >
        {!isCollapsed ? (
          <LogoutButton
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 
            py-3.5 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 
            hover:shadow-orange-500/20 hover:shadow-xl"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Logout
          </LogoutButton>
        ) : (
          <IconButton
            onClick={onLogout}
            sx={{ 
              color: '#FF9933',
              width: '48px',
              height: '48px',
            }}
          >
            <LogoutIcon />
          </IconButton>
        )}
      </Box>
    </SidebarContainer>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box className="hidden lg:block" sx={{ width: isCollapsed ? 80 : 300, flexShrink: 0 }}>
        {sidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        className="lg:hidden"
        PaperProps={{
          sx: {
            width: 300,
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
