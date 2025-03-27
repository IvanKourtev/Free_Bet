import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  EmojiEvents,
  Gavel,
  Person,
  Login,
  Logout,
  Leaderboard,
  Info,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginDialog } from './LoginDialog';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setLogoutDialogOpen(false);
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'bg' ? 'en' : 'bg';
    i18n.changeLanguage(newLang);
  };

  const menuItems = [
    { text: t('common.home'), icon: <Home />, path: '/' },
    { text: t('common.leaderboard'), icon: <Leaderboard />, path: '/leaderboard' },
    { text: t('common.rules'), icon: <Info />, path: '/rules' },
    ...(isAuthenticated ? [{ text: t('common.profile'), icon: <Person />, path: '/profile' }] : []),
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              m: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem 
          button 
          onClick={() => setLogoutDialogOpen(true)}
          sx={{
            borderRadius: 2,
            m: 1,
            '&:hover': {
              backgroundColor: '#f44336',
              color: 'white',
              '& .MuiListItemIcon-root': {
                color: 'white',
              },
            },
          }}
        >
          <ListItemIcon>
            <Logout sx={{ color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText primary={t('common.logout')} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="default" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Free Bet
          </Typography>
          <Button
            onClick={toggleLanguage}
            sx={{ 
              minWidth: 'auto', 
              mr: 2,
              fontSize: '1.5rem',
              p: 1,
              lineHeight: 1,
              '&:hover': {
                bgcolor: 'transparent',
              },
            }}
          >
            {i18n.language === 'bg' ? '🇧🇬' : '🇬🇧'}
          </Button>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() => handleNavigation(item.path)}
                startIcon={item.icon}
                sx={{
                  borderRadius: 2,
                  ...(location.pathname === item.path && {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }),
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          {isAuthenticated ? (
            <Button
              variant="contained"
              onClick={() => setLogoutDialogOpen(true)}
              startIcon={<Logout />}
              sx={{ 
                ml: 2,
                borderRadius: 2,
                bgcolor: '#f44336',
                color: 'white',
                '&:hover': {
                  bgcolor: '#d32f2f',
                },
              }}
            >
              {t('common.logout')}
            </Button>
          ) : (
            <Button
              color="primary"
              variant="contained"
              onClick={() => setLoginOpen(true)}
              startIcon={<Login />}
              sx={{ 
                ml: 2,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Вход
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: 250 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 250px)` },
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />

      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>{t('common.logout')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('auth.confirmLogout')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            {t('common.logout')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout; 