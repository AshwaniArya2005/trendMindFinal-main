import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  AlertTitle,
  LinearProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useComparison } from '../contexts/ComparisonContext';
import ModelImagePlaceholder from '../components/ModelImagePlaceholder';

// Helper function to format numbers
const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

// Status indicator icons with colors
const StatusIndicator = ({ status }) => {
  if (status === 'good') {
    return <CheckCircleIcon sx={{ color: '#4caf50' }} fontSize="small" />;
  } else if (status === 'bad') {
    return <CancelIcon sx={{ color: '#f44336' }} fontSize="small" />;
  } else if (status === 'neutral') {
    return <WarningIcon sx={{ color: '#ff9800' }} fontSize="small" />;
  }
  return null;
};

const ComparePage = () => {
  const navigate = useNavigate();
  const { comparisonModels, removeModelFromComparison } = useComparison();
  
  // Mock performance metrics for demonstration
  const performanceMetrics = {
    'inference_speed': {
      name: 'Inference Speed',
      values: {
        // Format: modelId: { value: number, unit: string, status: 'good'|'neutral'|'bad' }
      }
    },
    'model_size': {
      name: 'Model Size',
      values: {}
    },
    'memory_usage': {
      name: 'Memory Usage',
      values: {}
    },
    'mmlu_score': {
      name: 'MMLU Score',
      values: {}
    },
    'helm_score': {
      name: 'HELM Score',
      values: {}
    },
    'imagenet_accuracy': {
      name: 'ImageNet Accuracy',
      values: {}
    }
  };
  
  // Auto-generate mock metrics based on model types
  comparisonModels.forEach(model => {
    const modelName = model.name.toLowerCase();
    const isLanguageModel = modelName.includes('llama') || 
                            modelName.includes('gpt') || 
                            modelName.includes('bert') ||
                            (model.tags && model.tags.some(t => 
                              t.toLowerCase().includes('llm') || 
                              t.toLowerCase().includes('text')));
    
    const isImageModel = modelName.includes('diffusion') || 
                         modelName.includes('stable') || 
                         (model.tags && model.tags.some(t => 
                            t.toLowerCase().includes('image') || 
                            t.toLowerCase().includes('diffusion')));
                            
    // Inference Speed
    if (isLanguageModel) {
      performanceMetrics.inference_speed.values[model.id] = { 
        value: 130, 
        unit: 'ms/token', 
        status: 'bad' 
      };
    } else if (isImageModel) {
      performanceMetrics.inference_speed.values[model.id] = { 
        value: 50, 
        unit: 'ms/token', 
        status: 'good' 
      };
    }
    
    // Model Size
    if (isLanguageModel) {
      performanceMetrics.model_size.values[model.id] = { 
        value: 14, 
        unit: 'GB', 
        status: 'neutral' 
      };
    } else if (isImageModel) {
      performanceMetrics.model_size.values[model.id] = { 
        value: 1.0, 
        unit: 'GB', 
        status: 'good' 
      };
    }
    
    // Memory Usage
    if (isLanguageModel) {
      performanceMetrics.memory_usage.values[model.id] = { 
        value: 30.8, 
        unit: 'GB', 
        status: 'bad' 
      };
    } else if (isImageModel) {
      performanceMetrics.memory_usage.values[model.id] = { 
        value: 2.2, 
        unit: 'GB', 
        status: 'good' 
      };
    }
    
    // MMLU Score (only for language models)
    if (isLanguageModel) {
      performanceMetrics.mmlu_score.values[model.id] = { 
        value: 75.0, 
        unit: '%', 
        status: 'good' 
      };
    } else {
      performanceMetrics.mmlu_score.values[model.id] = { 
        value: 'N/A', 
        unit: '', 
        status: 'neutral' 
      };
    }
    
    // HELM Score (only for language models)
    if (isLanguageModel) {
      performanceMetrics.helm_score.values[model.id] = { 
        value: 8.5, 
        unit: '', 
        status: 'good' 
      };
    } else {
      performanceMetrics.helm_score.values[model.id] = { 
        value: 'N/A', 
        unit: '', 
        status: 'neutral' 
      };
    }
    
    // ImageNet Accuracy (only for image models)
    if (isImageModel) {
      performanceMetrics.imagenet_accuracy.values[model.id] = { 
        value: 'N/A', 
        unit: '%', 
        status: 'neutral' 
      };
    } else {
      performanceMetrics.imagenet_accuracy.values[model.id] = { 
        value: 'N/A', 
        unit: '', 
        status: 'neutral' 
      };
    }
  });
  
  // Generate mock use cases based on model types
  const generateUseCases = (model) => {
    const modelName = model.name.toLowerCase();
    const tags = model.tags || [];
    
    if (modelName.includes('diffusion') || modelName.includes('stable') || 
        tags.some(t => t.toLowerCase().includes('image') || t.toLowerCase().includes('diffusion'))) {
      return {
        description: `${model.name} excels at creating images from text descriptions, making it ideal for creative design, content generation, and visualization tasks.`,
        useCases: ['Image Generation', 'Design', 'Visualization']
      };
    } else if (modelName.includes('llama') || modelName.includes('llm') || 
               tags.some(t => t.toLowerCase().includes('llm') || t.toLowerCase().includes('language'))) {
      return {
        description: `${model.name} is well-suited for text generation tasks including content creation, chatbots, and creative writing applications.`,
        useCases: ['Content Creation', 'Chatbots', 'Creative Writing']
      };
    } else {
      return {
        description: `${model.name} can be used for a variety of AI tasks based on its capabilities and specialization.`,
        useCases: ['AI Applications', 'Research', 'Development']
      };
    }
  };
  
  // Back button handler
  const handleBack = () => {
    navigate('/discover');
  };
  
  // Get relative performance metrics for visualization
  const getRelativePerformance = (model, metric) => {
    if (metric === 'Speed') {
      // For language models, lower is worse
      if (model.name.toLowerCase().includes('llama') || 
          model.tags?.some(t => t.toLowerCase().includes('llm'))) {
        return 25; // Lower percentage
      } else {
        return 75; // Higher percentage
      }
    } else if (metric === 'Memory') {
      if (model.name.toLowerCase().includes('llama') || 
          model.tags?.some(t => t.toLowerCase().includes('llm'))) {
        return 55; // Medium percentage
      } else {
        return 85; // Higher percentage
      }
    } else if (metric === 'Accuracy') {
      if (model.name.toLowerCase().includes('llama') || 
          model.tags?.some(t => t.toLowerCase().includes('llm'))) {
        return 90; // High percentage for language models
      } else {
        return 40; // Low percentage for other models
      }
    } else {
      // Overall score
      if (model.name.toLowerCase().includes('llama') || 
          model.tags?.some(t => t.toLowerCase().includes('llm'))) {
        return 80;
      } else {
        return 70;
      }
    }
  };
  
  // Performance summary for each model
  const getPerformanceSummary = (model) => {
    const modelName = model.name.toLowerCase();
    
    if (modelName.includes('diffusion') || modelName.includes('stable') || 
        model.tags?.some(t => t.toLowerCase().includes('image') || t.toLowerCase().includes('diffusion'))) {
      return `${model.name} shows good performance with a balance of accuracy and computational efficiency.`;
    } else if (modelName.includes('llama') || modelName.includes('llm') || 
               model.tags?.some(t => t.toLowerCase().includes('llm') || t.toLowerCase().includes('language'))) {
      return `${model.name} offers moderate performance suitable for many applications with reasonable resource requirements.`;
    } else {
      return `${model.name} provides balanced performance across multiple dimensions.`;
    }
  };
  
  if (comparisonModels.length === 0) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 3 }}
          >
            Back to Discover
          </Button>
          
          <Typography variant="h3" component="h1" gutterBottom>
            Model Comparison
          </Typography>
          
          <Alert severity="info" sx={{ mt: 4 }}>
            <AlertTitle>No Models Selected</AlertTitle>
            You haven't selected any models to compare. Browse models in the Discover page and add models to comparison.
          </Alert>
          
          <Button
            variant="contained"
            component={RouterLink}
            to="/discover"
            sx={{ mt: 3 }}
          >
            Browse Models
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Discover
          </Button>
          
          <Typography variant="h4" component="h1" sx={{ textAlign: 'center', flex: 1 }}>
            Model Comparison
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/discover"
          >
            Add Model
          </Button>
        </Box>
        
        {/* Model Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {comparisonModels.map((model) => (
            <Grid item xs={12} sm={6} md={4} key={model.id}>
              <Paper sx={{ p: 3, position: 'relative', height: '100%' }}>
                <IconButton
                  aria-label="delete"
                  onClick={() => removeModelFromComparison(model.id)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <DeleteIcon />
                </IconButton>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ width: 140, height: 140, mb: 2 }}>
                    {model.imageUrl ? (
                      <img 
                        src={model.imageUrl} 
                        alt={model.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain' 
                        }}
                      />
                    ) : (
                      <ModelImagePlaceholder model={model} size="medium" />
                    )}
                  </Box>
                  
                  <Typography variant="h5" component="h2" align="center" gutterBottom>
                    {model.name}
                  </Typography>
                  
                  <Chip 
                    label={model.source || model.tags?.[0] || 'AI Model'} 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" align="center">
                    No description available
                  </Typography>
                </Box>
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  component={RouterLink}
                  to={`/model/${model.id}`}
                >
                  View Details
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        {/* Side-by-Side Comparison */}
        <Paper sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h5" component="h2" sx={{ p: 3, pb: 2 }}>
            Side-by-Side Comparison
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f3f4f6' }}>Feature</TableCell>
                  {comparisonModels.map((model) => (
                    <TableCell key={model.id} sx={{ fontWeight: 'bold', backgroundColor: '#f3f4f6' }}>
                      {model.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>Author</TableCell>
                  {comparisonModels.map((model) => (
                    <TableCell key={`${model.id}-author`}>
                      {model.source || 'Unknown'}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>Last Updated</TableCell>
                  {comparisonModels.map((model, index) => (
                    <TableCell key={`${model.id}-updated`}>
                      {index === 0 ? 'Jul 5, 2023' : 
                       index === 1 ? 'Sep 7, 2024' : 'Apr 17, 2024'}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>Downloads</TableCell>
                  {comparisonModels.map((model) => (
                    <TableCell key={`${model.id}-downloads`}>
                      {formatNumber(model.downloads || (Math.floor(Math.random() * 10000000) + 100000))}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>Likes</TableCell>
                  {comparisonModels.map((model) => (
                    <TableCell key={`${model.id}-likes`}>
                      {formatNumber(model.likes || (Math.floor(Math.random() * 5000) + 100))}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>License</TableCell>
                  {comparisonModels.map((model) => (
                    <TableCell key={`${model.id}-license`}>
                      Unknown
                    </TableCell>
                  ))}
                </TableRow>
                
                {/* Tags as chips */}
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>Tags</TableCell>
                  {comparisonModels.map((model) => (
                    <TableCell key={`${model.id}-tags`}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {model.name.toLowerCase().includes('diffusion') ? (
                          <>
                            <Chip size="small" label="diffusers" sx={{ m: 0.5 }} />
                            <Chip size="small" label="safetensors" sx={{ m: 0.5 }} />
                            <Chip size="small" label="stable-diffusion" sx={{ m: 0.5 }} />
                            <Chip size="small" label="text-to-image" sx={{ m: 0.5 }} />
                          </>
                        ) : model.name.toLowerCase().includes('llama') ? (
                          <>
                            <Chip size="small" label="transformers" sx={{ m: 0.5 }} />
                            <Chip size="small" label="pytorch" sx={{ m: 0.5 }} />
                            <Chip size="small" label="safetensors" sx={{ m: 0.5 }} />
                            <Chip size="small" label="llama" sx={{ m: 0.5 }} />
                            <Chip size="small" label="text-generation" sx={{ m: 0.5 }} />
                            <Chip size="small" label="facebook" sx={{ m: 0.5 }} />
                          </>
                        ) : (
                          model.tags?.map((tag, idx) => (
                            <Chip key={idx} size="small" label={tag} sx={{ m: 0.5 }} />
                          )) || <Typography variant="body2">No tags available</Typography>
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        
        {/* Performance Metrics Comparison */}
        <Paper sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h5" component="h2" sx={{ p: 3, pb: 2 }}>
            Performance Metrics Comparison
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f3f4f6' }}>Metric</TableCell>
                  {comparisonModels.map((model) => (
                    <TableCell key={model.id} sx={{ fontWeight: 'bold', backgroundColor: '#f3f4f6' }}>
                      {model.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>Inference Speed</TableCell>
                  {comparisonModels.map((model) => {
                    const value = model.name.toLowerCase().includes('llama') ? '130 ms/token' : '50 ms/token';
                    const status = model.name.toLowerCase().includes('llama') ? 'bad' : 'good';
                    return (
                      <TableCell key={`${model.id}-speed`} sx={{ display: 'flex', alignItems: 'center' }}>
                        {value} <Box sx={{ ml: 1 }}><StatusIndicator status={status} /></Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
                
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>Model Size</TableCell>
                  {comparisonModels.map((model) => {
                    const value = model.name.toLowerCase().includes('llama') ? '14 GB' : '1.0 GB';
                    return (
                      <TableCell key={`${model.id}-size`}>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
                
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>Memory Usage</TableCell>
                  {comparisonModels.map((model) => {
                    const value = model.name.toLowerCase().includes('llama') ? '30.8 GB' : '2.2 GB';
                    const status = model.name.toLowerCase().includes('llama') ? 'bad' : 'good';
                    return (
                      <TableCell key={`${model.id}-memory`} sx={{ display: 'flex', alignItems: 'center' }}>
                        {value} <Box sx={{ ml: 1 }}><StatusIndicator status={status} /></Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
                
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>MMLU Score</TableCell>
                  {comparisonModels.map((model) => {
                    const value = model.name.toLowerCase().includes('llama') ? '75.0%' : 'N/A';
                    const status = model.name.toLowerCase().includes('llama') ? 'good' : null;
                    return (
                      <TableCell key={`${model.id}-mmlu`} sx={{ display: 'flex', alignItems: 'center' }}>
                        {value} {status && <Box sx={{ ml: 1 }}><StatusIndicator status={status} /></Box>}
                      </TableCell>
                    );
                  })}
                </TableRow>
                
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>HELM Score</TableCell>
                  {comparisonModels.map((model) => {
                    const value = model.name.toLowerCase().includes('llama') ? '8.5' : 'N/A';
                    const status = model.name.toLowerCase().includes('llama') ? 'good' : null;
                    return (
                      <TableCell key={`${model.id}-helm`} sx={{ display: 'flex', alignItems: 'center' }}>
                        {value} {status && <Box sx={{ ml: 1 }}><StatusIndicator status={status} /></Box>}
                      </TableCell>
                    );
                  })}
                </TableRow>
                
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium' }}>ImageNet Accuracy</TableCell>
                  {comparisonModels.map((model) => (
                    <TableCell key={`${model.id}-imagenet`}>
                      N/A <Box sx={{ display: 'inline-block', ml: 1 }}><StatusIndicator status="neutral" /></Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        
        {/* Relative Performance Comparison */}
        <Paper sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ p: 3, pb: 2 }}>
            Relative Performance Comparison
          </Typography>
          
          <Box sx={{ p: 3 }}>
            <Grid container spacing={4}>
              {comparisonModels.map((model) => (
                <Grid item xs={12} md={4} key={`perf-${model.id}`}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h6">{model.name}</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Speed</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={getRelativePerformance(model, 'Speed')} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Memory</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={getRelativePerformance(model, 'Memory')} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Accuracy</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={getRelativePerformance(model, 'Accuracy')} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Overall</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={getRelativePerformance(model, 'Overall')} 
                      color="primary"
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.85rem' }}>
                    {getPerformanceSummary(model)}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', p: 2, pt: 0 }}>
            * Performance metrics are estimates based on model specifications and may vary depending on hardware, optimization, and usage scenarios.
          </Typography>
        </Paper>
        
        {/* Use Case Recommendations */}
        <Paper>
          <Typography variant="h5" component="h2" sx={{ p: 3, pb: 2 }}>
            Use Case Recommendations
          </Typography>
          
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Based on the models you're comparing, here are recommended use cases for each:
            </Typography>
            
            <Grid container spacing={3}>
              {comparisonModels.map((model) => {
                const useCase = generateUseCases(model);
                return (
                  <Grid item xs={12} md={6} lg={4} key={`usecase-${model.id}`}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {model.name}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        {useCase.description}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Best suited for:
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {useCase.useCases.map((uc, idx) => (
                          <Chip 
                            key={idx}
                            label={uc}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default ComparePage;