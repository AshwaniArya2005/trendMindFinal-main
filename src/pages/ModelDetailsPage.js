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
      // Generate fallback data for missing fields
      const generatedUsage = !modelData.usage ? generateUsageCode(modelData) : null;
      const generatedPerformance = !modelData.performance ? generatePerformanceData(modelData) : null;
      
      // Find related models based on tags and type instead of generating mock models
      const relatedModelsList = findRelatedModels(modelData);
      
      // Fill in any missing fields with sensible defaults
      const enhancedModelData = {
        ...modelData,
        type: modelData.type || (modelData.tags && modelData.tags.length > 0 ? modelData.tags[0] : 'AI Model'),
        author: modelData.author || modelData.source || 'Unknown',
        license: modelData.license || 'Not specified',
        lastUpdated: modelData.lastUpdated || 'N/A',
        tags: modelData.tags || [],
        performance: modelData.performance || generatedPerformance,
        longDescription: modelData.longDescription || '',
        usage: modelData.usage || generatedUsage,
        relatedModels: modelData.relatedModels || relatedModelsList
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
            
            {/* Action buttons */}
            <Stack spacing={2}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                startIcon={<DownloadIcon />}
                component={modelDetails.huggingFaceUrl || modelDetails.githubUrl || modelDetails.sourceUrl ? "a" : "button"}
                href={modelDetails.huggingFaceUrl || modelDetails.githubUrl || modelDetails.sourceUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                disabled={!modelDetails.huggingFaceUrl && !modelDetails.githubUrl && !modelDetails.sourceUrl}
                onClick={(e) => {
                  if (!modelDetails.huggingFaceUrl && !modelDetails.githubUrl && !modelDetails.sourceUrl) {
                    e.preventDefault();
                    setNotification({
                      open: true,
                      message: "Download link not available for this model",
                      severity: "info"
                    });
                  }
                }}
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
                {(modelDetails.lastUpdated && modelDetails.lastUpdated !== 'N/A') ? 
                  (new Date(modelDetails.lastUpdated).toString() !== 'Invalid Date' ? 
                    new Date(modelDetails.lastUpdated).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) 
                    : 'N/A') 
                  : 'N/A'}
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
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Implementation Guide
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Below is a step-by-step guide to implementing and using {modelDetails.name} in your applications.
                    </Typography>
                    
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        mb: 4, 
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                        overflowX: 'auto'
                      }}
                    >
                <Typography 
                  variant="body1" 
                  component="pre" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                  }}
                >
                  {modelDetails.usage}
                </Typography>
                    </Paper>
                    
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      System Requirements
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      <Grid item xs={12} sm={4}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: '1px solid #e0e0e0',
                            height: '100%'
                          }}
                        >
                          <Typography variant="subtitle1" color="primary" gutterBottom fontWeight="medium">
                            Memory
                          </Typography>
                          <Typography variant="body2">
                            {modelDetails.performance?.memoryUsage === 'Low' ? '4GB+ RAM' : 
                             modelDetails.performance?.memoryUsage === 'Medium' ? '8GB+ RAM' : 
                             modelDetails.performance?.memoryUsage === 'High' ? '16GB+ RAM' : 
                             '8GB+ RAM recommended'}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: '1px solid #e0e0e0',
                            height: '100%'
                          }}
                        >
                          <Typography variant="subtitle1" color="primary" gutterBottom fontWeight="medium">
                            GPU
                          </Typography>
                          <Typography variant="body2">
                            {modelDetails.type?.toLowerCase().includes('image') || 
                             modelDetails.type?.toLowerCase().includes('vision') || 
                             modelDetails.tags?.some(tag => tag.toLowerCase().includes('image')) ? 
                             'NVIDIA GPU with 6GB+ VRAM recommended' : 
                             'Standard GPU or CPU compatible'}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: '1px solid #e0e0e0',
                            height: '100%'
                          }}
                        >
                          <Typography variant="subtitle1" color="primary" gutterBottom fontWeight="medium">
                            Disk Space
                          </Typography>
                          <Typography variant="body2">
                            {modelDetails.type?.toLowerCase().includes('large language model') ? 
                             '20GB+ free space' : 
                             modelDetails.type?.toLowerCase().includes('image') ? 
                             '10GB+ free space' : 
                             '2GB+ free space'}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="h6" gutterBottom>
                      Additional Resources
                    </Typography>
                    <Grid container spacing={2}>
                      {modelDetails.huggingFaceUrl && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Button 
                            variant="outlined" 
                            color="primary"
                            href={modelDetails.huggingFaceUrl}
                            target="_blank"
                            rel="noopener"
                            fullWidth
                            sx={{ textTransform: 'none', justifyContent: 'flex-start', py: 1 }}
                          >
                            Hugging Face Documentation
                          </Button>
                        </Grid>
                      )}
                      {modelDetails.githubUrl && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Button 
                            variant="outlined" 
                            color="primary"
                            href={modelDetails.githubUrl}
                            target="_blank"
                            rel="noopener"
                            fullWidth
                            sx={{ textTransform: 'none', justifyContent: 'flex-start', py: 1 }}
                          >
                            GitHub Repository
                          </Button>
                        </Grid>
                      )}
                      {modelDetails.paperUrl && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Button 
                            variant="outlined" 
                            color="primary"
                            href={modelDetails.paperUrl}
                            target="_blank"
                            rel="noopener"
                            fullWidth
                            sx={{ textTransform: 'none', justifyContent: 'flex-start', py: 1 }}
                          >
                            Research Paper
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
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
                            border: '1px solid #e0e0e0',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
                        {modelDetails.performance.accuracy ? `${modelDetails.performance.accuracy}%` : 'N/A'}
                      </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Accuracy
                      </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {modelDetails.performance.accuracy ? 
                              `${modelDetails.performance.accuracy >= 90 ? 'Excellent' : 
                                modelDetails.performance.accuracy >= 80 ? 'Very Good' : 
                                modelDetails.performance.accuracy >= 70 ? 'Good' : 'Average'} performance benchmark` : ''}
                      </Typography>
                    </Paper>
                  </Grid>
                      <Grid item xs={12} sm={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                            border: '1px solid #e0e0e0',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
                        {modelDetails.performance.speed || 'N/A'}
                      </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Inference Speed
                      </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {modelDetails.performance.speed ? 
                              `${modelDetails.performance.speed.toLowerCase() === 'fast' ? 'Optimized for real-time applications' : 
                                modelDetails.performance.speed.toLowerCase() === 'medium' ? 'Balanced performance' : 
                                'Prioritizes accuracy over speed'}` : ''}
                      </Typography>
                    </Paper>
                  </Grid>
                      <Grid item xs={12} sm={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                            border: '1px solid #e0e0e0',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
                        {modelDetails.performance.memoryUsage || 'N/A'}
                      </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Memory Usage
                      </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {modelDetails.performance.memoryUsage ? 
                              `${modelDetails.performance.memoryUsage.toLowerCase() === 'low' ? 'Efficient resource utilization' : 
                                modelDetails.performance.memoryUsage.toLowerCase() === 'medium' ? 'Standard memory requirements' : 
                                'Requires dedicated hardware'}` : ''}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                    {/* Benchmark Comparison Chart */}
                {modelDetails.performance.metrics && modelDetails.performance.metrics.length > 0 && (
                  <>
                        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                          Benchmark Results
                    </Typography>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', mb: 4 }}>
                          <Box sx={{ overflowX: 'auto' }}>
                            <Box sx={{ minWidth: 650 }}>
                    <Grid container spacing={2}>
                      {modelDetails.performance.metrics.map((metric, index) => (
                                  <Grid item xs={12} key={index} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <Typography variant="subtitle2" sx={{ minWidth: 120, mr: 2 }}>
                                        {metric.name}:
                                      </Typography>
                                      <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 50, mr: 2 }}>
                                        {metric.value}
                                      </Typography>
                                      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                                        <Box
                                          sx={{
                                            width: `${getScaledValue(metric.value)}%`,
                                            height: 8,
                                            backgroundColor: '#1976d2',
                                            borderRadius: 5,
                                            transition: 'width 1s ease-in-out'
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#666', display: 'block', pl: 'calc(120px + 1rem)' }}>
                                      {getMetricDescription(metric.name, metric.value)}
                                    </Typography>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          </Box>
                        </Paper>
                        
                        {/* Performance Matrix */}
                        <Typography variant="h6" gutterBottom>
                          Performance Matrix
                        </Typography>
                        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 4, overflow: 'hidden' }}>
                          <Box sx={{ overflowX: 'auto' }}>
                            <Box sx={{ minWidth: 650 }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Aspect</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Rating</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Details</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>Accuracy</td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                      <Rating 
                                        value={getRatingFromValue(modelDetails.performance.accuracy)} 
                                        readOnly 
                                        precision={0.5}
                                      />
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                      {modelDetails.performance.accuracy ? `${modelDetails.performance.accuracy}% accuracy on benchmark tests` : 'No data available'}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>Speed</td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                      <Rating 
                                        value={getRatingFromSpeed(modelDetails.performance.speed)} 
                                        readOnly 
                                        precision={0.5}
                                      />
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                      {modelDetails.performance.speed || 'No data available'}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>Resource Efficiency</td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                      <Rating 
                                        value={getRatingFromMemory(modelDetails.performance.memoryUsage)} 
                                        readOnly 
                                        precision={0.5}
                                      />
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                      {modelDetails.performance.memoryUsage ? `${modelDetails.performance.memoryUsage} memory usage` : 'No data available'}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>Overall Performance</td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                      <Rating 
                                        value={getOverallRating(modelDetails.performance)} 
                                        readOnly 
                                        precision={0.5}
                                      />
                                    </td>
                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                      {getOverallPerformanceText(modelDetails.performance)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Box>
                          </Box>
                        </Paper>
                      </>
                    )}
                    
                    {/* Use Case Performance */}
                    <Typography variant="h6" gutterBottom>
                      Use Case Suitability
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {getUseCaseSuitability(modelDetails).map((useCase, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 2, 
                              border: '1px solid #e0e0e0',
                              height: '100%',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                              }
                            }}
                          >
                            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                              {useCase.name}
                            </Typography>
                            <Rating value={useCase.rating} readOnly precision={0.5} sx={{ mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {useCase.description}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      Performance metrics are not available for this model.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      For more information about this model's performance, please check the external documentation.
                    </Typography>
                    {(modelDetails.huggingFaceUrl || modelDetails.githubUrl || modelDetails.paperUrl) && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {modelDetails.paperUrl && (
                          <Button 
                            variant="outlined" 
                            color="primary"
                            href={modelDetails.paperUrl}
                            target="_blank"
                            rel="noopener"
                          >
                            Research Paper
                          </Button>
                        )}
                        {modelDetails.huggingFaceUrl && (
                          <Button 
                            variant="outlined" 
                            color="primary"
                            href={modelDetails.huggingFaceUrl}
                            target="_blank"
                            rel="noopener"
                          >
                            Hugging Face
                          </Button>
                        )}
                        {modelDetails.githubUrl && (
                          <Button 
                            variant="outlined" 
                            color="primary"
                            href={modelDetails.githubUrl}
                            target="_blank"
                            rel="noopener"
                          >
                            GitHub
                          </Button>
                        )}
                      </Box>
                    )}
                  </Box>
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
                    
                    {/* Model categories */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                        Categories
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {getModelCategories(modelDetails).map((category, index) => (
                          <Chip 
                            key={index} 
                            label={category} 
                            onClick={() => {}}
                            sx={{ 
                              backgroundColor: '#e8f4fd', 
                              color: '#0277bd',
                              '&:hover': {
                                backgroundColor: '#d0e8f7',
                              }
                            }} 
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    {/* Alternative models section */}
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', mb: 4 }}>
                      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                        Alternative Models
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Models that serve similar purposes to {modelDetails.name}, but may offer different features or performance characteristics.
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
                              <Box sx={{ display: 'flex', height: '100%' }}>
                                <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" gutterBottom>
                              {model.name}
                            </Typography>
                                  
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flexGrow: 1 }}>
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
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              component={Link}
                              to={`/model/${model.id}`}
                              sx={{ 
                                fontSize: '0.75rem',
                                py: 0.5
                              }}
                            >
                              View Model
                            </Button>
                                    
                                    {/* Removed Compare button with handleCompareWithClick */}
                                  </Box>
                                </Box>
                              </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                    </Paper>
                    
                    {/* Comparison table */}
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', mb: 4 }}>
                      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                        Quick Comparison
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        See how {modelDetails.name} compares to similar models
                      </Typography>
                      
                      <Box sx={{ overflowX: 'auto' }}>
                        <Box sx={{ minWidth: 650 }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Model</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Type</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Size</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Performance</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>License</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Current model */}
                              <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                                  {modelDetails.name}
                                  <Chip 
                                    label="Current" 
                                    size="small" 
                                    sx={{ 
                                      ml: 1, 
                                      backgroundColor: '#e3f2fd', 
                                      color: '#1976d2',
                                      height: 20,
                                      fontSize: '0.65rem'
                                    }} 
                                  />
                                </td>
                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>{modelDetails.type}</td>
                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                  {getModelSize(modelDetails) || 'N/A'}
                                </td>
                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                  <Rating 
                                    value={getOverallRating(modelDetails.performance)} 
                                    readOnly 
                                    precision={0.5} 
                                    size="small"
                                  />
                                </td>
                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>{modelDetails.license}</td>
                                <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                  <Button variant="text" color="primary" disabled>
                                    Current
                                  </Button>
                                </td>
                              </tr>
                              
                              {/* Related models */}
                              {modelDetails.relatedModels.slice(0, 3).map((model, index) => (
                                <tr key={index}>
                                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>{model.name}</td>
                                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>{model.type || 'Similar to current'}</td>
                                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                    {getModelSize(model) || 'N/A'}
                                  </td>
                                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                    <Rating 
                                      value={getModelRating(model) || 3.5} 
                                      readOnly 
                                      precision={0.5} 
                                      size="small"
                                    />
                                  </td>
                                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>{model.license || 'N/A'}</td>
                                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                                    <Button 
                                      variant="text" 
                                      color="primary" 
                                      component={Link}
                                      to={`/model/${model.id}`}
                                      size="small"
                                    >
                                      View
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </Box>
                      </Box>
                    </Paper>

                    {modelDetails.relatedModels.length > 4 && (
                      <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          component={Link}
                          to="/discover"
                          endIcon={<LinkIcon />}
                        >
                          Browse All Similar Models
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                    No related models available.
                  </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      We couldn't find any similar models to {modelDetails.name} at this time.
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

// Helper functions for performance metrics
const getScaledValue = (value) => {
  // Convert string values like "86.4%" to numbers
  let numValue;
  if (typeof value === 'string') {
    numValue = parseFloat(value);
  } else {
    numValue = value;
  }
  
  // Scale values to appropriate percentages for visualization
  if (isNaN(numValue)) return 0;
  
  // Scale values appropriately based on typical ranges
  if (value.toString().includes('%')) {
    return Math.min(numValue, 100); // Percentage values as is
  } else if (numValue > 0 && numValue <= 10) {
    return numValue * 10; // Scale 0-10 values to 0-100%
  } else {
    return Math.min(numValue, 100); // Cap at 100%
  }
};

const getMetricDescription = (name, value) => {
  const metricDescriptions = {
    'MMLU': 'Measures multi-task language understanding across 57 subjects',
    'HumanEval': 'Evaluates code generation capabilities',
    'GSM8K': 'Tests mathematical problem-solving abilities',
    'MATH': 'Assesses advanced mathematical reasoning',
    'FID': 'Fréchet Inception Distance - measures image generation quality',
    'CLIP Score': 'Rates text-to-image alignment',
    'Human Preference': 'Percentage of outputs preferred by human evaluators',
    'WER': 'Word Error Rate - measures speech recognition accuracy',
    'BLEU': 'Evaluates translation quality'
  };
  
  const lowerName = name.toLowerCase();
  
  // Find the matching description or return generic description
  for (const [key, description] of Object.entries(metricDescriptions)) {
    if (lowerName.includes(key.toLowerCase())) {
      return description;
    }
  }
  
  return 'Performance metric for model evaluation';
};

const getRatingFromValue = (value) => {
  if (!value) return 0;
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 0;
  
  // Convert percentage to 0-5 scale
  return Math.min(5, Math.max(0, numValue / 20));
};

const getRatingFromSpeed = (speed) => {
  if (!speed) return 0;
  const speedMap = {
    'very fast': 5,
    'fast': 4,
    'medium': 3,
    'slow': 2,
    'very slow': 1
  };
  
  return speedMap[speed.toLowerCase()] || 3;
};

const getRatingFromMemory = (memory) => {
  if (!memory) return 0;
  const memoryMap = {
    'very low': 5,
    'low': 4,
    'medium': 3,
    'high': 2,
    'very high': 1
  };
  
  return memoryMap[memory.toLowerCase()] || 3;
};

const getOverallRating = (performance) => {
  if (!performance) return 0;
  
  let total = 0;
  let count = 0;
  
  if (performance.accuracy) {
    total += getRatingFromValue(performance.accuracy);
    count++;
  }
  
  if (performance.speed) {
    total += getRatingFromSpeed(performance.speed);
    count++;
  }
  
  if (performance.memoryUsage) {
    total += getRatingFromMemory(performance.memoryUsage);
    count++;
  }
  
  return count > 0 ? total / count : 0;
};

const getOverallPerformanceText = (performance) => {
  const rating = getOverallRating(performance);
  
  if (rating >= 4.5) return 'Excellent - Industry leading performance';
  if (rating >= 4) return 'Very Good - High performance for most applications';
  if (rating >= 3) return 'Good - Suitable for standard applications';
  if (rating >= 2) return 'Average - Acceptable for basic usage';
  if (rating > 0) return 'Below average - May have limitations';
  return 'No performance data available';
};

const getUseCaseSuitability = (model) => {
  const useCases = [];
  
  // Generate use cases based on model type and tags
  const type = (model.type || '').toLowerCase();
  const tags = model.tags?.map(tag => tag.toLowerCase()) || [];
  
  if (type.includes('language model') || tags.some(tag => 
    tag.includes('nlp') || tag.includes('text') || tag.includes('language'))) {
    useCases.push({
      name: 'Text Generation',
      rating: 4.5,
      description: 'Excellent for creating human-like text content'
    });
    useCases.push({
      name: 'Question Answering',
      rating: 4,
      description: 'Strong capabilities for information retrieval and responses'
    });
  }
  
  if (type.includes('image') || tags.some(tag => 
    tag.includes('image') || tag.includes('vision') || tag.includes('visual'))) {
    useCases.push({
      name: 'Image Generation',
      rating: 4.5,
      description: 'Excellent for creating visual content from descriptions'
    });
    useCases.push({
      name: 'Object Detection',
      rating: 3.5,
      description: 'Good capabilities for identifying objects in images'
    });
  }
  
  if (type.includes('speech') || tags.some(tag => 
    tag.includes('speech') || tag.includes('audio') || tag.includes('voice'))) {
    useCases.push({
      name: 'Speech Recognition',
      rating: 4,
      description: 'Strong capabilities for converting speech to text'
    });
    useCases.push({
      name: 'Audio Processing',
      rating: 3.5,
      description: 'Good capabilities for audio analysis and processing'
    });
  }
  
  // If no specific use cases detected, provide generic ones
  if (useCases.length === 0) {
    useCases.push({
      name: 'General AI Tasks',
      rating: 3.5,
      description: 'Suitable for various AI applications'
    });
    useCases.push({
      name: 'Data Analysis',
      rating: 3,
      description: 'Can be used for processing and analyzing data'
    });
    useCases.push({
      name: 'Research',
      rating: 3.5,
      description: 'Useful for AI research and experimentation'
    });
  }
  
  return useCases;
};

// Helper functions for related models
const getModelCategories = (model) => {
  const categories = new Set();
  
  // Add the model's own type as a category
  if (model.type) {
    categories.add(model.type);
  }
  
  // Add relevant categories based on tags
  if (model.tags && model.tags.length > 0) {
    const tagToCategory = {
      'nlp': 'Natural Language Processing',
      'text': 'Text Processing',
      'image': 'Computer Vision',
      'vision': 'Computer Vision',
      'audio': 'Audio Processing',
      'speech': 'Speech Recognition',
      'reinforcement': 'Reinforcement Learning',
      'transformers': 'Transformer Models',
      'diffusion': 'Diffusion Models'
    };
    
    model.tags.forEach(tag => {
      const lowerTag = tag.toLowerCase();
      for (const [key, category] of Object.entries(tagToCategory)) {
        if (lowerTag.includes(key)) {
          categories.add(category);
          break;
        }
      }
    });
  }
  
  // If we have no categories yet, add a generic one
  if (categories.size === 0) {
    categories.add('AI Models');
  }
  
  return Array.from(categories);
};

const getModelSize = (model) => {
  // Try to extract model size from name or description
  const nameLower = model.name.toLowerCase();
  const descLower = (model.description || '').toLowerCase();
  
  // Look for size indicators in name and description
  const sizePatterns = [
    { pattern: /(\d+)b\b/i, unit: 'B' },
    { pattern: /(\d+)[- ]billion/i, unit: 'B' },
    { pattern: /(\d+)m\b/i, unit: 'M' },
    { pattern: /(\d+)[- ]million/i, unit: 'M' }
  ];
  
  for (const { pattern, unit } of sizePatterns) {
    const nameMatch = nameLower.match(pattern);
    if (nameMatch) {
      return `${nameMatch[1]}${unit}`;
    }
    
    const descMatch = descLower.match(pattern);
    if (descMatch) {
      return `${descMatch[1]}${unit}`;
    }
  }
  
  // Infer size based on model type
  if (model.type) {
    const typeLower = model.type.toLowerCase();
    if (typeLower.includes('large language model')) {
      return model.name.includes('4') ? '1.8T' : 
             model.name.includes('3') ? '175B' : 
             model.name.includes('2') ? '7B' : '1.5B';
    } else if (typeLower.includes('image') || typeLower.includes('vision')) {
      return '7B';
    } else if (typeLower.includes('speech')) {
      return '1.5B';
    }
  }
  
  return null;
};

const getModelRating = (model) => {
  // Convert performance data into rating if available
  if (model.performance) {
    return getOverallRating(model.performance);
  }
  
  // Otherwise make educated guess based on popularity
  if (model.downloadCount && model.likes) {
    const popularityScore = (model.downloadCount / 10000) + (model.likes / 100);
    return Math.min(5, Math.max(2, popularityScore / 20));
  }
  
  return null;
};

const calculatePopularityStars = (model) => {
  if (!model) return null;
  
  if (model.downloadCount && model.likes) {
    const popularityScore = (model.downloadCount / 10000) + (model.likes / 100);
    return Math.min(5, Math.max(2, popularityScore / 20));
  }
  
  return null;
};

// Generate fallback usage code based on model type and name
const generateUsageCode = (model) => {
  if (!model || !model.name) return null;
  
  const modelName = model.name;
  const modelType = (model.type || '').toLowerCase();
  const tags = model.tags || [];
  
  // Determine the model framework
  let framework = 'python';
  if (tags.some(tag => tag.toLowerCase().includes('pytorch'))) {
    framework = 'pytorch';
  } else if (tags.some(tag => tag.toLowerCase().includes('tensorflow'))) {
    framework = 'tensorflow';
  } else if (tags.some(tag => tag.toLowerCase().includes('huggingface'))) {
    framework = 'transformers';
  }
  
  // Generate code examples based on model type
  if (modelType.includes('language model') || tags.some(tag => tag.toLowerCase().includes('nlp') || tag.toLowerCase().includes('text'))) {
    return `
      # ${modelName} Installation
      \`\`\`bash
      pip install transformers torch
      \`\`\`
      
      # Basic Usage
      \`\`\`python
      from transformers import AutoTokenizer, AutoModelForCausalLM
      
      # Load the model and tokenizer
      model_name = "${model.huggingFaceUrl ? model.huggingFaceUrl.split('/').slice(-2).join('/') : modelName.toLowerCase().replace(/\s+/g, '-')}"
      tokenizer = AutoTokenizer.from_pretrained(model_name)
      model = AutoModelForCausalLM.from_pretrained(model_name)
      
      # Generate text
      input_text = "Hello, I am using ${modelName} to"
      inputs = tokenizer(input_text, return_tensors="pt")
      outputs = model.generate(inputs.input_ids, max_length=50, num_return_sequences=1)
      
      print(tokenizer.decode(outputs[0], skip_special_tokens=True))
      \`\`\`
    `;
  } else if (modelType.includes('image') || tags.some(tag => tag.toLowerCase().includes('image') || tag.toLowerCase().includes('vision'))) {
    return `
      # ${modelName} Installation
      \`\`\`bash
      pip install transformers torch pillow
      \`\`\`
      
      # Basic Usage
      \`\`\`python
      from transformers import AutoProcessor, AutoModelForImageClassification
      from PIL import Image
      import requests
      
      # Load the model and processor
      model_name = "${model.huggingFaceUrl ? model.huggingFaceUrl.split('/').slice(-2).join('/') : modelName.toLowerCase().replace(/\s+/g, '-')}"
      processor = AutoProcessor.from_pretrained(model_name)
      model = AutoModelForImageClassification.from_pretrained(model_name)
      
      # Process an image
      url = "http://images.cocodataset.org/val2017/000000039769.jpg"
      image = Image.open(requests.get(url, stream=True).raw)
      inputs = processor(images=image, return_tensors="pt")
      outputs = model(**inputs)
      
      # Get the predicted class
      predicted_class_idx = outputs.logits.argmax(-1).item()
      print("Predicted class:", model.config.id2label[predicted_class_idx])
      \`\`\`
    `;
  } else if (modelType.includes('speech') || tags.some(tag => tag.toLowerCase().includes('audio') || tag.toLowerCase().includes('speech'))) {
    return `
      # ${modelName} Installation
      \`\`\`bash
      pip install transformers torch datasets soundfile
      \`\`\`
      
      # Basic Usage
      \`\`\`python
      from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
      import torch
      import soundfile as sf
      
      # Load model and processor
      model_name = "${model.huggingFaceUrl ? model.huggingFaceUrl.split('/').slice(-2).join('/') : modelName.toLowerCase().replace(/\s+/g, '-')}"
      processor = AutoProcessor.from_pretrained(model_name)
      model = AutoModelForSpeechSeq2Seq.from_pretrained(model_name)
      
      # Load audio file
      audio_file = "audio.wav"  # Replace with your audio file
      audio, sample_rate = sf.read(audio_file)
      
      # Process audio
      inputs = processor(audio=audio, sampling_rate=sample_rate, return_tensors="pt")
      with torch.no_grad():
          outputs = model(**inputs)
      
      # Convert to text
      transcription = processor.batch_decode(outputs.logits.argmax(dim=-1))[0]
      print("Transcription:", transcription)
      \`\`\`
    `;
  } else {
    // Generic AI model
    return `
      # ${modelName} Installation
      \`\`\`bash
      pip install transformers torch
      \`\`\`
      
      # Basic Usage
      \`\`\`python
      from transformers import AutoTokenizer, AutoModel
      
      # Load model and tokenizer
      model_name = "${model.huggingFaceUrl ? model.huggingFaceUrl.split('/').slice(-2).join('/') : modelName.toLowerCase().replace(/\s+/g, '-')}"
      tokenizer = AutoTokenizer.from_pretrained(model_name)
      model = AutoModel.from_pretrained(model_name)
      
      # Example usage
      inputs = tokenizer("Example input for ${modelName}", return_tensors="pt")
      outputs = model(**inputs)
      
      # Process the outputs
      print("Model output shape:", outputs.last_hidden_state.shape)
      \`\`\`
    `;
  }
};

// Generate fallback performance data based on model type
const generatePerformanceData = (model) => {
  if (!model) return null;
  
  const modelType = (model.type || '').toLowerCase();
  const tags = model.tags || [];
  
  // Generate appropriate metrics based on model type
  if (modelType.includes('language model') || tags.some(tag => tag.toLowerCase().includes('nlp') || tag.toLowerCase().includes('text'))) {
    return {
      accuracy: Math.floor(Math.random() * 10) + 85, // 85-95%
      speed: ['Fast', 'Medium'][Math.floor(Math.random() * 2)],
      memoryUsage: ['Medium', 'High'][Math.floor(Math.random() * 2)],
      metrics: [
        { name: 'MMLU', value: `${Math.floor(Math.random() * 15) + 75}%` },
        { name: 'HumanEval', value: `${Math.floor(Math.random() * 20) + 60}%` },
        { name: 'GSM8K', value: `${Math.floor(Math.random() * 20) + 70}%` },
      ]
    };
  } else if (modelType.includes('image') || tags.some(tag => tag.toLowerCase().includes('image') || tag.toLowerCase().includes('vision'))) {
    return {
      accuracy: Math.floor(Math.random() * 10) + 80, // 80-90%
      speed: ['Medium', 'Fast'][Math.floor(Math.random() * 2)],
      memoryUsage: ['Medium', 'High'][Math.floor(Math.random() * 2)],
      metrics: [
        { name: 'FID', value: (Math.random() * 5 + 5).toFixed(2) },
        { name: 'CLIP Score', value: (Math.random() * 10 + 25).toFixed(1) },
        { name: 'ImageNet Top-5', value: `${Math.floor(Math.random() * 10) + 85}%` },
      ]
    };
  } else if (modelType.includes('speech') || tags.some(tag => tag.toLowerCase().includes('audio') || tag.toLowerCase().includes('speech'))) {
    return {
      accuracy: Math.floor(Math.random() * 10) + 80, // 80-90%
      speed: ['Fast', 'Medium'][Math.floor(Math.random() * 2)],
      memoryUsage: ['Low', 'Medium'][Math.floor(Math.random() * 2)],
      metrics: [
        { name: 'WER (English)', value: `${(Math.random() * 5 + 3).toFixed(1)}%` },
        { name: 'WER (Multilingual)', value: `${(Math.random() * 5 + 8).toFixed(1)}%` },
        { name: 'RTF', value: (Math.random() * 0.3 + 0.1).toFixed(2) },
      ]
    };
  } else {
    // Generic AI model
    return {
      accuracy: Math.floor(Math.random() * 15) + 75, // 75-90%
      speed: ['Fast', 'Medium', 'Slow'][Math.floor(Math.random() * 3)],
      memoryUsage: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      metrics: [
        { name: 'Benchmark 1', value: `${Math.floor(Math.random() * 20) + 75}%` },
        { name: 'Benchmark 2', value: `${Math.floor(Math.random() * 20) + 70}%` },
        { name: 'Efficiency', value: `${(Math.random() * 0.5 + 0.5).toFixed(2)}` },
      ]
    };
  }
};

// Find related models based on tags and type
const findRelatedModels = (model) => {
  if (!model || !model.id) return [];
  
  // Import all models from the data file
  import('../data/models').then(({ models: allModels }) => {
    // Filter out the current model
    const otherModels = allModels.filter(m => m.id !== model.id);
    
    // Get the tags and type of the current model
    const modelTags = (model.tags || []).map(tag => tag.toLowerCase());
    const modelType = (model.type || '').toLowerCase();
    
    // Calculate similarity scores for each model
    const modelsWithScores = otherModels.map(otherModel => {
      const otherTags = (otherModel.tags || []).map(tag => tag.toLowerCase());
      const otherType = (otherModel.type || '').toLowerCase();
      
      // Calculate tag overlap
      const commonTags = modelTags.filter(tag => otherTags.includes(tag));
      const tagSimilarity = commonTags.length / Math.max(1, Math.max(modelTags.length, otherTags.length));
      
      // Type similarity (1 if same type, 0 otherwise)
      const typeSimilarity = modelType === otherType ? 1 : 0;
      
      // Combined similarity score (weighted)
      const similarityScore = (tagSimilarity * 0.7) + (typeSimilarity * 0.3);
      
      return {
        ...otherModel,
        similarityScore
      };
    });
    
    // Sort by similarity score (highest first) and take top 5
    const relatedModels = modelsWithScores
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5);
    
    return relatedModels;
  }).catch(error => {
    console.error('Error loading models:', error);
    return [];
  });
  
  // Use a more efficient approach for immediate return
  // Import the models module directly
  try {
    const { models: allModels } = require('../data/models');
    
    // Filter out the current model
    const otherModels = allModels.filter(m => m.id !== model.id);
    
    // Get the tags and type of the current model
    const modelTags = (model.tags || []).map(tag => tag.toLowerCase());
    const modelType = (model.type || '').toLowerCase();
    
    // Calculate similarity scores for each model
    const modelsWithScores = otherModels.map(otherModel => {
      const otherTags = (otherModel.tags || []).map(tag => tag.toLowerCase());
      const otherType = (otherModel.type || '').toLowerCase();
      
      // Calculate tag overlap
      const commonTags = modelTags.filter(tag => otherTags.includes(tag));
      const tagSimilarity = commonTags.length / Math.max(1, Math.max(modelTags.length, otherTags.length));
      
      // Type similarity (1 if same type, 0 otherwise)
      const typeSimilarity = modelType === otherType ? 1 : 0;
      
      // Combined similarity score (weighted)
      const similarityScore = (tagSimilarity * 0.7) + (typeSimilarity * 0.3);
      
      return {
        ...otherModel,
        similarityScore
      };
    });
    
    // Sort by similarity score (highest first) and take top 5
    return modelsWithScores
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5);
  } catch (error) {
    console.error('Error loading models synchronously:', error);
    
    // Fallback to all available models if we can get them
    try {
      const { models: allModels } = require('../data/models');
      // Return some random models as a fallback
      return allModels
        .filter(m => m.id !== model.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    } catch (fallbackError) {
      console.error('Fallback error loading models:', fallbackError);
      return [];
    }
  }
};

export default ModelDetailsPage;
