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
import { auth } from '../firebase/config';
import { 
  registerWithEmailAndPassword,
  updateUserProfile,
  signInWithGoogle
} from '../firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
      // Create user with email and password
      const user = await registerWithEmailAndPassword(
        formData.email, 
        formData.password
      );
      
      // Update profile with display name
      await updateUserProfile(user, {
        displayName: formData.fullName
      });
      
      // Navigate to preferences page after successful registration
      navigate('/preferences');
    } catch (error) {
      // Handle different Firebase auth errors
      switch(error.code) {
        case 'auth/email-already-in-use':
          setError('Email already in use. Please use a different email or login.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Choose a stronger password.');
          break;
        default:
          setError('An error occurred during registration. Please try again.');
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
            Create Your Account
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Join TrendMind to discover and explore AI models
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
              label="Full Name"
              name="fullName"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              autoFocus
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: theme => theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme => theme.palette.primary.dark,
                },
                mb: 2,
                color: 'white'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
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
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" variant="body2" sx={{ fontWeight: 500 }}>
                    Log In
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

export default RegisterPage;
