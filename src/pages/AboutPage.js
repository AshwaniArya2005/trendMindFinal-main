import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Mock team members data
const teamMembers = [
  {
    name: 'Saksham Neema',
    role: 'Team Member',
    bio: 'Focused on backend development and system architecture for TrendMind.',
    avatar: '/avatar/Saksham .jpg',
  },
  {
    name: 'Ashwani Kumar Arya',
    role: 'Team Member',
    bio: 'Focused on implementing and optimizing the core features of TrendMind.',
    avatar: '/avatar/Ashwani.jpg',
  },
  {
    name: 'Anjali Kushwaha',
    role: 'Team Member',
    bio: 'Working on the user experience and interface design of the platform.',
    avatar: '/avatar/Anjali.jpg',
  },
  {
    name: 'Ashika Maheshwari',
    role: 'Team Member',
    bio: 'Contributing to the development of AI comparison tools and features.',
    avatar: '/avatar/Aashika.jpg',
  },
  {
    name: 'Snehal Baranwal',
    role: 'Team Leader',
    bio: 'Contributing to the development and enhancement of the TrendMind platform.',
    avatar: '/avatar/Snehal.jpg',
  },
];

const AboutPage = () => {
  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: '#18445c',
            textAlign: 'center',
            mb: 2
          }}
        >
          About Us
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 6,
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto',
            color: '#546e7a'
          }}
        >
          Our mission is to make AI models accessible, comparable, and understandable for everyone.
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: '#18445c'
              }}
            >
              Our Story
            </Typography>
            
            <Typography paragraph>
              TrendMind began in 2025 when a group of Computer science students realized how difficult it was to keep track of the rapidly evolving AI model landscape. With new models being released almost daily, we found ourselves spending hours researching, comparing, and evaluating different options.
            </Typography>
            
            <Typography paragraph>
              We built TrendMind to solve this problem – creating a central hub where anyone can discover, compare, and understand the latest AI models. Our platform aggregates information from multiple sources including research papers, model repositories, and developer communities.
            </Typography>
            
            <Typography paragraph>
              Today, TrendMind serves thousands of AI enthusiasts, researchers, and developers who use our platform to stay informed about the latest advancements in artificial intelligence.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/assets/TrendMind.png"
              alt="About TrendMind illustration"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
              }}
            />
          </Grid>
        </Grid>
        
        <Divider sx={{ mb: 6 }} />
        
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: '#18445c',
            textAlign: 'center',
            mb: 5,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '3px',
              bgcolor: '#0277bd',
              borderRadius: '2px'
            }
          }}
        >
          Meet Our Team
        </Typography>
        
        <Grid container justifyContent="center" sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid #18445c',
                borderRadius: 4,
                transition: 'transform 0.3s, box-shadow 0.3s',
                backgroundColor: '#18445c',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <Avatar
                src={teamMembers[4].avatar}
                alt={teamMembers[4].name}
                sx={{ 
                  width: 140, 
                  height: 140,
                  mb: 3,
                  border: '3px solid white',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
                }}
              />
              
              <Typography variant="h5" gutterBottom fontWeight={600} color="white">
                {teamMembers[4].name}
              </Typography>
              
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'white',
                  mb: 2,
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2
                }}
              >
                {teamMembers[4].role}
              </Typography>
              
              <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.9)' }}>
                {teamMembers[4].bio}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Grid container spacing={4} justifyContent="center">
          {teamMembers.slice(0, 4).map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: '1px solid #18445c',
                  borderRadius: 3,
                  backgroundColor: '#18445c',
                  color: 'white',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <Avatar
                  src={member.avatar}
                  alt={member.name}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    mb: 2,
                    border: '2px solid white',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)'
                  }}
                />
                
                <Typography variant="h6" gutterBottom fontWeight={600} color="white">
                  {member.name}
                </Typography>
                
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: 'white',
                    mb: 2,
                    fontWeight: 500,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5
                  }}
                >
                  {member.role}
                </Typography>
                
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.9)' }}>
                  {member.bio}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      <Footer />
    </>
  );
};

export default AboutPage; 