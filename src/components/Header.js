import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
  styled,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../firebase/auth';

const NavLink = styled(RouterLink)(({ theme }) => ({
  color: 'white',
  marginLeft: theme.spacing(3),
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  border: '1px solid white',
  color: 'white',
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const RegisterButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleUserMenuClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            TrendMind
          </Typography>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: '45px' }}
              >
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/">
                  Home
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/discover">
                  Discover
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/faq">
                  FAQ
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/about">
                  About Us
                </MenuItem>
                {!isAuthenticated ? (
                  <>
                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/login">
                      Log In
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/register">
                      Register
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/discover">Discover</NavLink>
                <NavLink to="/faq">FAQ</NavLink>
                <NavLink to="/about">About Us</NavLink>
              </Box>
              <Box>
                {!isAuthenticated ? (
                  <>
                    <LoginButton variant="outlined" component={RouterLink} to="/login">
                      Log In
                    </LoginButton>
                    <RegisterButton variant="contained" component={RouterLink} to="/register">
                      Register
                    </RegisterButton>
                  </>
                ) : (
                  <>
                    <IconButton onClick={handleUserMenuOpen} sx={{ color: 'white' }}>
                      <Avatar 
                        src={currentUser?.photoURL || ''} 
                        alt={currentUser?.displayName || 'User'} 
                        sx={{ width: 32, height: 32 }}
                      />
                    </IconButton>
                    <Menu
                      anchorEl={userMenuAnchorEl}
                      open={Boolean(userMenuAnchorEl)}
                      onClose={handleUserMenuClose}
                    >
                      <MenuItem>
                        <Typography variant="body2">
                          {currentUser?.displayName || currentUser?.email}
                        </Typography>
                      </MenuItem>
                      <MenuItem component={RouterLink} to="/profile" onClick={handleUserMenuClose}>
                        Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 