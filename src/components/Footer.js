import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Link, Stack, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#6e96af',
        color: 'white',
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="h4" component={RouterLink} to="/" sx={{ 
              fontFamily: 'Playfair Display, serif', 
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              display: 'block',
              mb: 2
            }}>
              TrendMind
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" aria-label="Facebook" sx={{ color: 'white' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" sx={{ color: 'white' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn" sx={{ color: 'white' }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" sx={{ color: 'white' }}>
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Box sx={{ display: 'flex', gap: 12 }}>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Navigation
              </Typography>
              <Stack spacing={1}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                  Home
                </Link>
                <Link component={RouterLink} to="/discover" color="inherit" underline="hover">
                  Discover
                </Link>
                <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                  About Us
                </Link>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Legal
              </Typography>
              <Stack spacing={1}>
                <Link component={RouterLink} to="/privacy-policy" color="inherit" underline="hover">
                  Privacy&nbsp;Policy
                </Link>
                <Link component={RouterLink} to="/terms-of-service" color="inherit" underline="hover">
                  Terms&nbsp;of&nbsp;Service
                </Link>
                <Link component={RouterLink} to="/cookies" color="inherit" underline="hover">
                  Cookies
                </Link>
              </Stack>
            </Grid>
          </Box>
        </Grid>
        
        <Typography variant="body2" sx={{ mt: 6, textAlign: 'right' }}>
          © {new Date().getFullYear()} TrendMind. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
