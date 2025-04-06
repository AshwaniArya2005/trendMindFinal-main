import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '@mui/material/styles';

const PreferencesSetupPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Check if user is editing existing preferences or setting up new ones
    const hasCompletedPreferences = localStorage.getItem(`preferences_completed_${currentUser.uid}`);
    setIsEditing(hasCompletedPreferences === 'true');
    
    // If navigating directly to preferences setup page but already has completed setup, don't redirect
    // This allows for editing preferences
    
    // Load existing preferences if any
    loadExistingPreferences();
    
  }, [currentUser, navigate]);
  
  // Load existing preferences from localStorage
  const loadExistingPreferences = () => {
    try {
      const storedPreferences = localStorage.getItem(`user_preferences_${currentUser.uid}`);
      if (storedPreferences) {
        const parsedPreferences = JSON.parse(storedPreferences);
        if (parsedPreferences.preferences && Array.isArray(parsedPreferences.preferences)) {
          setSelectedTags(parsedPreferences.preferences);
        }
      }
    } catch (error) {
      console.error('Error loading existing preferences:', error);
    }
  };

  const availableTags = [
    { id: 'text', name: 'Text Generation', category: 'Natural Language Processing' },
    { id: 'image', name: 'Image Generation', category: 'Computer Vision' },
    { id: 'chatbot', name: 'Chatbots', category: 'Conversational AI' },
    { id: 'translation', name: 'Translation', category: 'Natural Language Processing' },
    { id: 'code', name: 'Code Generation', category: 'Development' },
    { id: 'audio', name: 'Audio Generation', category: 'Audio Processing' },
    { id: 'video', name: 'Video Generation', category: 'Computer Vision' },
    { id: 'summarization', name: 'Summarization', category: 'Natural Language Processing' },
    { id: 'classification', name: 'Classification', category: 'Machine Learning' },
    { id: 'recommendation', name: 'Recommendation', category: 'Machine Learning' },
    { id: 'research', name: 'Research', category: 'Academic' },
    { id: 'healthcare', name: 'Healthcare', category: 'Industry' },
    { id: 'finance', name: 'Finance', category: 'Industry' },
    { id: 'marketing', name: 'Marketing', category: 'Industry' },
    { id: 'education', name: 'Education', category: 'Industry' },
    { id: 'gaming', name: 'Gaming', category: 'Entertainment' }
  ];

  // Group tags by category
  const tagsByCategory = availableTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

  const handleTagSelect = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const savePreferences = async () => {
    if (selectedTags.length < 3) {
      setError('Please select at least 3 interests to continue');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Save user preferences to localStorage
      localStorage.setItem(`user_preferences_${currentUser.uid}`, JSON.stringify({
        preferences: selectedTags,
        updatedAt: new Date().toISOString()
      }));
      
      // Mark preferences as completed
      localStorage.setItem(`preferences_completed_${currentUser.uid}`, 'true');
      
      // Navigate to homepage
      navigate('/');
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const skipPreferences = () => {
    if (isEditing) {
      // If editing, just go back to profile
      navigate('/profile');
    } else {
      // If first time, mark preferences as completed even if skipped
      localStorage.setItem(`preferences_completed_${currentUser.uid}`, 'true');
      navigate('/');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Container component="main" maxWidth="md" sx={{ py: 8, flex: '1 0 auto' }}>
        <Paper elevation={3} sx={{ borderRadius: 2, p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            fontFamily="'Playfair Display', serif"
            fontWeight={600}
            sx={{ mb: 3 }}
          >
            {isEditing ? 'Edit Your Preferences' : 'Welcome to TrendMind!'}
          </Typography>
          
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            {isEditing 
              ? 'Update your AI interests to better personalize your experience' 
              : 'Select your AI interests to personalize your experience'
            }
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Divider sx={{ mb: 4 }} />
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            Choose at least 3 topics that interest you:
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography 
                  variant="h6" 
                  color="primary" 
                  fontWeight={500} 
                  sx={{ mb: 1.5 }}
                >
                  {category}
                </Typography>
                <Grid container spacing={1}>
                  {categoryTags.map(tag => (
                    <Grid item key={tag.id}>
                      <Chip
                        label={tag.name}
                        onClick={() => handleTagSelect(tag.id)}
                        color={selectedTags.includes(tag.id) ? "primary" : "default"}
                        variant={selectedTags.includes(tag.id) ? "filled" : "outlined"}
                        sx={{ 
                          m: 0.5, 
                          fontWeight: 500,
                          '&.MuiChip-colorPrimary': {
                            backgroundColor: selectedTags.includes(tag.id) ? 'primary.main' : 'transparent',
                            color: selectedTags.includes(tag.id) ? 'white' : 'text.primary',
                          },
                          '&:hover': {
                            backgroundColor: selectedTags.includes(tag.id) 
                              ? 'primary.dark' 
                              : 'rgba(0,0,0,0.08)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {selectedTags.length} topics selected {selectedTags.length < 3 && '(minimum 3)'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={skipPreferences}
              >
                {isEditing ? 'Cancel' : 'Skip for Now'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={loading || selectedTags.length < 3}
                onClick={savePreferences}
                sx={{ 
                  py: 1.2, 
                  px: 4,
                  backgroundColor: theme => theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme => theme.palette.primary.dark,
                  },
                  color: 'white'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : (isEditing ? 'Save Changes' : 'Continue')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default PreferencesSetupPage; 