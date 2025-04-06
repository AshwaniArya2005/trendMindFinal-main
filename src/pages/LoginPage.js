import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { loginWithEmailAndPassword, signInWithGoogle } from '../firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await loginWithEmailAndPassword(
        formData.email, 
        formData.password
      );
      
      // Navigate to home page after successful login
      navigate('/');
    } catch (error) {
      // Handle different Firebase auth errors
      switch(error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        case 'auth/too-many-requests':
          setError('Too many unsuccessful login attempts. Please try again later');
          break;
        default:
          setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Container component="main" maxWidth="sm" sx={{ py: 8, flex: '1 0 auto' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <Typography component="h1" variant="h4" align="center" fontFamily="'Playfair Display', serif" fontWeight={600} gutterBottom>
            Log In to TrendMind
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Welcome back! Log in to continue exploring AI models
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              autoFocus
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />
            
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                mt: 3,
                backgroundColor: theme => theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme => theme.palette.primary.dark,
                },
                mb: 2,
                color: 'white'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
            </Button>
            
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">or</Typography>
            </Divider>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{ 
                py: 1.5, 
                mb: 2,
                borderColor: '#ddd',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#bbb',
                  backgroundColor: 'rgba(0,0,0,0.01)',
                }
              }}
            >
              Continue with Google
            </Button>
            
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/register" variant="body2" sx={{ fontWeight: 500 }}>
                    Register
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default LoginPage; 