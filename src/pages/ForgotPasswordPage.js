import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { resetPassword } from '../firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      // Handle different Firebase auth errors
      switch(error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
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
            Reset Password
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset link has been sent to your email
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
              value={email}
              onChange={handleChange}
              autoFocus
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
            
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Remember your password?{' '}
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

export default ForgotPasswordPage; 