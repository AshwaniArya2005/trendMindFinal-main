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
  Avatar,
  Divider,
  Tab,
  Tabs,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Switch,
  FormGroup
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';
import ModelCard from '../components/ModelCard';
import { useTheme } from '@mui/material/styles';
import { models } from '../data/models';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [preferencesSkipped, setPreferencesSkipped] = useState(false);
  const [favoriteModels, setFavoriteModels] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [userPreferences, setUserPreferences] = useState([]);
  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailNotifications: true,
    modelCategory: 'all',
  });
  const theme = useTheme();

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

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Legacy code for handling preferences - would need to be updated for a real user preference system
    setLoading(false);
    
    // Load favorite models when on the favorites tab
    if (activeTab === 2) {
      loadFavoriteModels();
    }

    // Load user preferences
    loadUserPreferences();
  }, [currentUser, navigate, activeTab]);

  // Load user preferences from localStorage
  const loadUserPreferences = () => {
    try {
      const storedPreferences = localStorage.getItem(`user_preferences_${currentUser.uid}`);
      if (storedPreferences) {
        const parsedPreferences = JSON.parse(storedPreferences);
        if (parsedPreferences.preferences && Array.isArray(parsedPreferences.preferences)) {
          setUserPreferences(parsedPreferences.preferences);
          setSelectedTags(parsedPreferences.preferences);
        }
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  // Fetch favorite models from local storage
  const loadFavoriteModels = async () => {
    try {
      setLoadingFavorites(true);
      
      // Get favorite model IDs from localStorage
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteModels') || '[]');
      
      if (favoriteIds.length === 0) {
        setFavoriteModels([]);
        return;
      }
      
      // Filter to only include favorited models
      const favorites = models.filter(model => favoriteIds.includes(model.id));
      
      // Ensure each model has compareEnabled property
      const enhancedFavorites = favorites.map(model => ({
        ...model,
        compareEnabled: true
      }));
      
      setFavoriteModels(enhancedFavorites);
    } catch (error) {
      console.error('Error loading favorite models:', error);
      setError('Failed to load your favorite models. Please try again.');
    } finally {
      setLoadingFavorites(false);
    }
  };

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

    setSaving(true);
    setError('');
    setSuccess(false);
    
    try {
      // Save user preferences to localStorage
      localStorage.setItem(`user_preferences_${currentUser.uid}`, JSON.stringify({
        preferences: selectedTags,
        updatedAt: new Date().toISOString()
      }));
      
      setSuccess(true);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // If switching to the favorites tab, load the favorites
    if (newValue === 2) {
      loadFavoriteModels();
    }
  };

  // Add function to remove favorite directly from the profile page
  const handleRemoveFavorite = (modelId) => {
    // Update state
    setFavoriteModels(favoriteModels.filter(model => model.id !== modelId));
    
    // Update localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteModels') || '[]');
    const index = favorites.indexOf(modelId);
    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem('favoriteModels', JSON.stringify(favorites));
    }
  };

  // Group tags by category
  const tagsByCategory = availableTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

  // Navigate to preferences setup page
  const handleEditPreferences = () => {
    navigate('/preferences-setup');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    );
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!currentUser?.displayName) return '?';
    return currentUser.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Tab panel component
  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`profile-tabpanel-${index}`}
        aria-labelledby={`profile-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };
  
  const handlePreferenceChange = (event) => {
    const { name, value, checked } = event.target;
    const newValue = event.target.type === 'checkbox' ? checked : value;
    
    const updatedPreferences = {
      ...preferences,
      [name]: newValue
    };
    
    setPreferences(updatedPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Container component="main" maxWidth="md" sx={{ py: 8, flex: '1 0 auto' }}>
        <Paper elevation={3} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {/* Profile Header */}
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 4, 
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            {currentUser?.photoURL ? (
              <Avatar 
                src={currentUser.photoURL} 
                alt={currentUser.displayName || 'User'}
                sx={{ width: 80, height: 80, mr: { xs: 0, sm: 3 }, mb: { xs: 2, sm: 0 } }}
              />
            ) : (
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'secondary.main',
                  fontSize: '1.5rem',
                  mr: { xs: 0, sm: 3 },
                  mb: { xs: 2, sm: 0 }
                }}
              >
                {getInitials()}
              </Avatar>
            )}
            <Box>
              <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
                {currentUser.displayName || 'User'}
              </Typography>
              <Typography variant="body1">
                {currentUser.email}
              </Typography>
            </Box>
          </Box>
          
          {/* Tabs */}
          <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="profile tabs"
            >
              <Tab 
                icon={<PersonIcon />} 
                label="Profile" 
                id="profile-tab-0"
                aria-controls="profile-tabpanel-0"
              />
              <Tab 
                icon={<TagIcon />} 
                label="Preferences" 
                id="profile-tab-1"
                aria-controls="profile-tabpanel-1"
              />
              <Tab 
                icon={<StarIcon />} 
                label="Favorites" 
                id="profile-tab-2"
                aria-controls="profile-tabpanel-2"
              />
            </Tabs>
          </Box>
          
          {/* Tab Panels */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Details
              </Typography>
              <Typography variant="body1" paragraph>
                Email: {currentUser.email}
              </Typography>
              {currentUser.displayName && (
                <Typography variant="body1" paragraph>
                  Name: {currentUser.displayName}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleSignOut}
                sx={{ mt: 2 }}
              >
                Sign Out
              </Button>
            </Box>
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Your AI Interests
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                These preferences are used to personalize your experience and recommendations.
              </Typography>
              
              {userPreferences.length > 0 ? (
                <>
                  <Box sx={{ mb: 3, mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Selected Topics:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {userPreferences.map(tagId => {
                        const tag = availableTags.find(t => t.id === tagId);
                        return tag ? (
                          <Chip 
                            key={tagId} 
                            label={tag.name} 
                            color="primary"
                            sx={{ 
                              m: 0.5,
                              fontWeight: 500
                            }} 
                          />
                        ) : null;
                      })}
                    </Box>
                  </Box>
                  
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={handleEditPreferences}
                    startIcon={<TagIcon />}
                    sx={{ mt: 2 }}
                  >
                    Edit Preferences
                  </Button>
                </>
              ) : (
                <Box sx={{ mt: 3, textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    You haven't set any preferences yet
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleEditPreferences}
                    sx={{ mt: 2 }}
                  >
                    Set Preferences
                  </Button>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h6" gutterBottom>
              Application Settings
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.darkMode}
                        onChange={handlePreferenceChange}
                        name="darkMode"
                      />
                    }
                    label="Dark Mode"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.emailNotifications}
                        onChange={handlePreferenceChange}
                        name="emailNotifications"
                      />
                    }
                    label="Email Notifications"
                  />
                </FormGroup>
              </FormControl>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel component="legend">Default Model Category</FormLabel>
                <RadioGroup
                  name="modelCategory"
                  value={preferences.modelCategory}
                  onChange={handlePreferenceChange}
                >
                  <FormControlLabel value="all" control={<Radio />} label="All Models" />
                  <FormControlLabel value="text" control={<Radio />} label="Text Models" />
                  <FormControlLabel value="image" control={<Radio />} label="Image Models" />
                  <FormControlLabel value="audio" control={<Radio />} label="Audio Models" />
                </RadioGroup>
              </FormControl>
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                disabled={saving}
                sx={{
                  py: 1.2,
                  backgroundColor: theme => theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme => theme.palette.primary.dark,
                  },
                  color: 'white'
                }}
              >
                {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Preferences'}
              </Button>
            </Box>
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            {loadingFavorites ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : favoriteModels.length > 0 ? (
              <>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <StarIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Your Favorite Models ({favoriteModels.length})
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  {favoriteModels.map(model => (
                    <Grid item xs={12} sm={6} key={model.id}>
                      <ModelCard model={model} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  You don't have any favorite models yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click the star icon on any model card to add it to your favorites
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 3 }}
                  onClick={() => navigate('/discover')}
                >
                  Discover Models
                </Button>
              </Box>
            )}
          </TabPanel>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default ProfilePage; 