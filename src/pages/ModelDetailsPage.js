import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  Paper,
  Divider,
  Link as MuiLink,
  Tab,
  Tabs,
  Stack,
  Card,
  CardContent,
  IconButton,
  Rating,
  Snackbar,
  Alert
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LinkIcon from '@mui/icons-material/Link';
import ArticleIcon from '@mui/icons-material/Article';
import GitHubIcon from '@mui/icons-material/GitHub';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useComparison } from '../contexts/ComparisonContext';
import ReviewsSection from '../components/ReviewsSection';
import AIModelBlog from '../components/AIModelBlog';
import { getModelById } from '../data/models';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`model-tabpanel-${index}`}
      aria-labelledby={`model-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ModelDetailsPage = () => {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [liked, setLiked] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [modelDetails, setModelDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get comparison context
  const { addModelToComparison, removeModelFromComparison, isModelInComparison } = useComparison();
  
  // Check if model is in comparison
  const inComparison = modelDetails ? isModelInComparison(modelDetails.id) : false;
  
  // Load the model based on ID
  useEffect(() => {
    // Simulate loading from API
    setLoading(true);
    
    // Check if the model data is in sessionStorage (from DiscoverPage)
    let modelData = null;
    try {
      const sessionModel = sessionStorage.getItem(`model_${id}`);
      if (sessionModel) {
        modelData = JSON.parse(sessionModel);
        console.log('Found model in session storage:', modelData);
      }
    } catch (error) {
      console.error('Error reading from session storage:', error);
    }
    
    // If not found in sessionStorage, try to get it from the local models
    if (!modelData) {
      try {
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
          modelData = getModelById(numericId);
        }
      } catch (error) {
        console.error('Error getting model by ID:', error);
      }
    }
    
    if (modelData) {
      // Fill in any missing fields with sensible defaults
      const enhancedModelData = {
        ...modelData,
        type: modelData.type || (modelData.tags && modelData.tags.length > 0 ? modelData.tags[0] : 'AI Model'),
        author: modelData.author || modelData.source || 'Unknown',
        license: modelData.license || 'Not specified',
        lastUpdated: modelData.lastUpdated || 'N/A',
        tags: modelData.tags || [],
        performance: modelData.performance || null,
        longDescription: modelData.longDescription || '',
        usage: modelData.usage || null,
        relatedModels: modelData.relatedModels || null
      };
      
      setModelDetails(enhancedModelData);
      document.title = `${enhancedModelData.name} | TrendMind`;
    } else {
      // Handle case where model is not found
      console.error(`Model with ID ${id} not found`);
    }
    
    setLoading(false);
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleLikeClick = () => {
    setLiked(!liked);
  };

  // Handle compare button click
  const handleCompareClick = () => {
    if (!modelDetails) return;
    
    const modelId = typeof modelDetails.id === 'string' ? modelDetails.id : parseInt(id);
    
    if (inComparison) {
      // Remove from comparison
      const result = removeModelFromComparison(modelId);
      setNotification({
        open: true,
        message: result.message,
        severity: 'info'
      });
    } else {
      // Add to comparison - first create a model object with the details
      const modelToAdd = {
        id: modelId,
        name: modelDetails.name,
        description: modelDetails.description,
        tags: modelDetails.tags,
        imageUrl: modelDetails.imageUrl,
        source: modelDetails.author || modelDetails.source,
        sourceUrl: modelDetails.huggingFaceUrl || modelDetails.githubUrl || modelDetails.sourceUrl,
        downloads: modelDetails.downloadCount || 0,
        likes: modelDetails.likes || 0,
        compareEnabled: true
      };
      
      const result = addModelToComparison(modelToAdd);
      setNotification({
        open: true,
        message: result.message,
        severity: result.success ? 'success' : 'warning'
      });
    }
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Show loading state or error if model not found
  if (loading) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5">Loading model details...</Typography>
        </Container>
        <Footer />
      </>
    );
  }

  if (!modelDetails) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" color="error">Model not found</Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/discover" 
            sx={{ mt: 3 }}
          >
            Discover Models
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Model Header */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                backgroundColor: '#f8f9fa'
              }}
            >
              <Box
                component="img"
                src={modelDetails.imageUrl || '/assets/model-placeholder.png'}
                alt={modelDetails.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  e.target.src = '/assets/model-placeholder.png';
                }}
              />
            </Paper>
            
            {/* Action buttons */}
            <Stack spacing={2}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                startIcon={<DownloadIcon />}
                component={modelDetails.huggingFaceUrl ? "a" : "button"}
                href={modelDetails.huggingFaceUrl || "#"}
                target={modelDetails.huggingFaceUrl ? "_blank" : ""}
                disabled={!modelDetails.huggingFaceUrl}
              >
                Download Model
              </Button>
              
              <Button 
                variant="outlined" 
                color={liked ? "secondary" : "primary"}
                fullWidth
                startIcon={<FavoriteIcon />}
                onClick={handleLikeClick}
              >
                {liked ? 'Liked' : 'Like Model'}
              </Button>
              
              <Button 
                variant={inComparison ? "contained" : "outlined"}
                color={inComparison ? "secondary" : "primary"}
                fullWidth
                startIcon={<CompareArrowsIcon />}
                onClick={handleCompareClick}
              >
                {inComparison ? 'Remove from Comparison' : 'Add to Comparison'}
              </Button>
            </Stack>
            
            {/* Model Quick Info */}
            <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" gutterBottom>
                Model Type
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.type || 'Not specified'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Author
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.author || 'Not specified'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                License
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.license || 'Not specified'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Downloads
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.downloadCount?.toLocaleString() || 'N/A'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Likes
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.likes?.toLocaleString() || 'N/A'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.lastUpdated || 'N/A'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Links
              </Typography>
              <Stack spacing={1} direction="row" sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
                {modelDetails.huggingFaceUrl && (
                  <MuiLink href={modelDetails.huggingFaceUrl} target="_blank" rel="noopener">
                    <Chip icon={<LinkIcon />} label="Hugging Face" clickable size="small" />
                  </MuiLink>
                )}
                {modelDetails.githubUrl && (
                  <MuiLink href={modelDetails.githubUrl} target="_blank" rel="noopener">
                    <Chip icon={<GitHubIcon />} label="GitHub" clickable size="small" />
                  </MuiLink>
                )}
                {modelDetails.paperUrl && (
                  <MuiLink href={modelDetails.paperUrl} target="_blank" rel="noopener">
                    <Chip icon={<ArticleIcon />} label="Paper" clickable size="small" />
                  </MuiLink>
                )}
                {modelDetails.sourceUrl && !(modelDetails.huggingFaceUrl || modelDetails.githubUrl || modelDetails.paperUrl) && (
                  <MuiLink href={modelDetails.sourceUrl} target="_blank" rel="noopener">
                    <Chip icon={<LinkIcon />} label="Source" clickable size="small" />
                  </MuiLink>
                )}
              </Stack>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {/* Model Name and Description */}
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              {modelDetails.name}
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph
              sx={{ mb: 3 }}
            >
              {modelDetails.description}
            </Typography>
            
            {/* Tags */}
            {modelDetails.tags && modelDetails.tags.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {modelDetails.tags
                    .filter((tag, index) => {
                      // Keep important tags - filter for meaningful AI/ML related tags
                      const importantTags = [
                        'transformers', 'pytorch', 'tensorflow', 'nlp', 'computer-vision',
                        'fill-mask', 'text-generation', 'image-classification', 'object-detection',
                        'summarization', 'translation', 'question-answering', 'rlhf', 'fine-tuning'
                      ];
                      
                      // Prioritize important tags, but ensure we don't display more than 8
                      return importantTags.includes(tag.toLowerCase()) || index < 8;
                    })
                    .slice(0, 8) // Limit to max 8 tags
                    .map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        sx={{ 
                          backgroundColor: '#e8f4fd', 
                          color: '#0277bd',
                          m: 0.5,
                          fontWeight: 'medium'
                        }} 
                      />
                    ))}
                </Stack>
              </Box>
            )}
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Tabs for different sections */}
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  aria-label="model details tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Overview" id="model-tab-0" />
                  <Tab label="Usage" id="model-tab-1" />
                  <Tab label="Performance" id="model-tab-2" />
                  <Tab label="Reviews" id="model-tab-3" />
                  <Tab label="Related Models" id="model-tab-4" />
                </Tabs>
              </Box>
              
              <TabPanel value={tabValue} index={0}>
                <AIModelBlog model={modelDetails} />
                {/* Show original overview content if longDescription exists but blog generation fails */}
                {modelDetails.longDescription && !AIModelBlog({ model: modelDetails }) && (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {modelDetails.longDescription}
                  </Typography>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                {modelDetails.usage ? (
                  <Typography 
                    variant="body1" 
                    component="pre" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      backgroundColor: '#f5f5f5',
                      p: 2,
                      borderRadius: 1,
                      overflowX: 'auto'
                    }}
                  >
                    {modelDetails.usage}
                  </Typography>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Usage information is not available for this model.
                    </Typography>
                    {modelDetails.huggingFaceUrl && (
                      <Button 
                        variant="outlined" 
                        color="primary"
                        href={modelDetails.huggingFaceUrl}
                        target="_blank"
                        rel="noopener"
                        sx={{ mt: 2 }}
                      >
                        Check documentation on Hugging Face
                      </Button>
                    )}
                    {modelDetails.githubUrl && !modelDetails.huggingFaceUrl && (
                      <Button 
                        variant="outlined" 
                        color="primary"
                        href={modelDetails.githubUrl}
                        target="_blank"
                        rel="noopener"
                        sx={{ mt: 2 }}
                      >
                        Check documentation on GitHub
                      </Button>
                    )}
                  </Box>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                
                {modelDetails.performance ? (
                  <>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={4}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <Typography variant="h5" color="primary" gutterBottom>
                            {modelDetails.performance.accuracy ? `${modelDetails.performance.accuracy}%` : 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            Accuracy
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <Typography variant="h5" color="primary" gutterBottom>
                            {modelDetails.performance.speed || 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            Inference Speed
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <Typography variant="h5" color="primary" gutterBottom>
                            {modelDetails.performance.memoryUsage || 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            Memory Usage
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    {modelDetails.performance.metrics && modelDetails.performance.metrics.length > 0 && (
                      <>
                        <Typography variant="h6" gutterBottom>
                          Additional Metrics
                        </Typography>
                        <Grid container spacing={2}>
                          {modelDetails.performance.metrics.map((metric, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                              <Paper 
                                elevation={0} 
                                sx={{ 
                                  p: 2, 
                                  textAlign: 'center',
                                  border: '1px solid #e0e0e0'
                                }}
                              >
                                <Typography variant="h6" color="primary" gutterBottom>
                                  {metric.value}
                                </Typography>
                                <Typography variant="body2">
                                  {metric.name}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    )}
                  </>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Performance metrics are not available for this model.
                  </Typography>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                <ReviewsSection modelId={id} modelName={modelDetails.name} />
              </TabPanel>
              
              <TabPanel value={tabValue} index={4}>
                {modelDetails.relatedModels && modelDetails.relatedModels.length > 0 ? (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Similar Models You Might Be Interested In
                    </Typography>
                    <Grid container spacing={3}>
                      {modelDetails.relatedModels.slice(0, 4).map((model, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              height: '100%',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                              }
                            }}
                          >
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {model.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {model.description && model.description.length > 100 
                                  ? `${model.description.substring(0, 100)}...` 
                                  : model.description}
                              </Typography>
                              {model.tags && model.tags.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                  {model.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <Chip 
                                      key={tagIndex} 
                                      label={tag} 
                                      size="small"
                                      sx={{ backgroundColor: '#e8f4fd', color: '#0277bd' }}
                                    />
                                  ))}
                                </Box>
                              )}
                              <Button 
                                variant="text" 
                                color="primary" 
                                component={Link}
                                to={`/model/${model.id}`}
                              >
                                View Model
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {modelDetails.relatedModels.length > 4 && (
                      <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button 
                          variant="outlined" 
                          color="primary"
                          component={Link}
                          to="/discover"
                        >
                          See All Related Models
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      No related models available.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      component={Link}
                      to="/discover"
                      sx={{ mt: 2 }}
                    >
                      Discover More Models
                    </Button>
                  </Box>
                )}
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Footer />
      
      {/* Notification snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModelDetailsPage;
