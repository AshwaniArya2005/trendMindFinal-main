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
  Radio
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';
import ModelCard from '../components/ModelCard';
import { getFavorites } from '../services/huggingFaceService';
import { getFavoriteModels } from '../services/modelService';
import { useTheme } from '@mui/material/styles';

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
  }, [currentUser, navigate, activeTab]);

  // Fetch favorite models using the Hugging Face service
  const loadFavoriteModels = async () => {
    try {
      setLoadingFavorites(true);
      const models = await getFavoriteModels(getFavorites(currentUser.uid));
      setFavoriteModels(models);
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

  // Group tags by category
  const tagsByCategory = availableTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

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
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Preferences saved successfully!
              </Alert>
            )}
            
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
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {selectedTags.length} topics selected {selectedTags.length < 3 && '(minimum 3)'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={saving || selectedTags.length < 3}
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
              <Grid container spacing={3}>
                {favoriteModels.map(model => (
                  <Grid item xs={12} sm={6} key={model.id}>
                    <ModelCard model={model} />
                  </Grid>
                ))}
              </Grid>
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