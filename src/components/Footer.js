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
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
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
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Grid>
          
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
              <Link component={RouterLink} to="/about-us" color="inherit" underline="hover">
                About Us
              </Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Categories
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/category/nlp" color="inherit" underline="hover">
                NLP
              </Link>
              <Link component={RouterLink} to="/category/computer-vision" color="inherit" underline="hover">
                Computer Vision
              </Link>
              <Link component={RouterLink} to="/category/generative" color="inherit" underline="hover">
                Generative AI
              </Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Topics
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/topic/image-generation" color="inherit" underline="hover">
                Image Generation
              </Link>
              <Link component={RouterLink} to="/topic/text-analysis" color="inherit" underline="hover">
                Text Analysis
              </Link>
              <Link component={RouterLink} to="/topic/speech-recognition" color="inherit" underline="hover">
                Speech Recognition
              </Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Legal
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/privacy-policy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
              <Link component={RouterLink} to="/terms-of-service" color="inherit" underline="hover">
                Terms of Service
              </Link>
              <Link component={RouterLink} to="/cookies" color="inherit" underline="hover">
                Cookies
              </Link>
            </Stack>
          </Grid>
        </Grid>
        
        <Typography variant="body2" sx={{ mt: 6, textAlign: 'center' }}>
          © {new Date().getFullYear()} TrendMind. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 