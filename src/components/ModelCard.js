import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Chip, 
  Stack, 
  Link as MuiLink,
  Tooltip,
  Avatar,
  Skeleton,
  LinearProgress,
  Modal,
  Fade,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StorageIcon from '@mui/icons-material/Storage';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BalanceIcon from '@mui/icons-material/Balance';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { styled } from '@mui/material/styles';
import ModelImagePlaceholder from './ModelImagePlaceholder';
import { useComparison } from '../contexts/ComparisonContext';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
}));

const StyledCardMediaContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 200,
  width: '100%',
  backgroundColor: '#f5f8fa',
  borderBottom: '1px solid #eaeef3',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledCardMedia = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f8fa',
  color: theme.palette.text.secondary
}));

const StarIconButton = styled(IconButton)(({ theme, favorite }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  color: favorite ? theme.palette.warning.main : 'inherit',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: 20,
  padding: '6px 16px',
}));

const PlatformBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '50%',
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

// Add new styled components for image modal
const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90vw',
  maxHeight: '90vh',
  width: 'auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  padding: 0,
  overflow: 'hidden',
  outline: 'none',
}));

const ModalImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  maxHeight: '80vh'
});

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  color: 'white',
  backgroundColor: 'rgba(0,0,0,0.5)',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  zIndex: 1
}));

const ZoomButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

// Add themed fallbacks for models based on type/category
const modelTypeFallbacks = {
  'text-generation': 'https://huggingface.co/front/thumbnails/text-generation.png',
  'fill-mask': 'https://huggingface.co/front/thumbnails/fill-mask.png',
  'text-classification': 'https://huggingface.co/front/thumbnails/text-classification.png',
  'token-classification': 'https://huggingface.co/front/thumbnails/token-classification.png',
  'question-answering': 'https://huggingface.co/front/thumbnails/question-answering.png',
  'summarization': 'https://huggingface.co/front/thumbnails/summarization.png',
  'translation': 'https://huggingface.co/front/thumbnails/translation.png',
  'text2text-generation': 'https://huggingface.co/front/thumbnails/text2text-generation.png',
  'text-to-image': 'https://huggingface.co/front/thumbnails/diffusers-banner.png',
  'image-to-text': 'https://huggingface.co/front/thumbnails/vision-multimodal.png',
  'image-classification': 'https://huggingface.co/front/thumbnails/image-classification.png',
  'object-detection': 'https://huggingface.co/front/thumbnails/object-detection.png',
  'image-segmentation': 'https://huggingface.co/front/thumbnails/image-segmentation.png',
  'speech-recognition': 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/audio-classification.png',
  'audio-classification': 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/audio-classification.png',
  'automatic-speech-recognition': 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/automatic-speech-recognition.png',
  'feature-extraction': 'https://huggingface.co/front/thumbnails/feature-extraction.png',
  'sentence-similarity': 'https://huggingface.co/front/thumbnails/sentence-similarity.png',
  'zero-shot-classification': 'https://huggingface.co/front/thumbnails/zero-shot-classification.png',
  'conversational': 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/conversational.png',
  'table-question-answering': 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/table-question-answering.png',
  'nlp': 'https://huggingface.co/front/thumbnails/nlp-for-beginners.png',
  'computer-vision': 'https://huggingface.co/front/thumbnails/computer-vision.png',
  'multimodal': 'https://huggingface.co/front/thumbnails/vision-multimodal.png',
  'audio': 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/audio.png',
  'reinforcement-learning': 'https://huggingface.co/front/thumbnails/reinforcement-learning.png',
  'default': 'https://huggingface.co/front/assets/huggingface-logo.svg'
};

// Function to get themed colored gradient for model types
const getModelGradient = (model) => {
  // Check for common model types
  const name = (model.name || '').toLowerCase();
  const tags = (model.tags || []).map(t => t.toLowerCase());
  const tag = model.pipeline_tag || '';
  
  // Color schemes for different model types
  if (tag.includes('image') || name.includes('image') || tags.some(t => t.includes('image'))) {
    return 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)'; // Orange-red for image models
  } else if (tag.includes('text-generation') || name.includes('llm') || name.includes('gpt') || tags.some(t => t.includes('llm'))) {
    return 'linear-gradient(135deg, #6A5ACD 0%, #4B0082 100%)'; // Purple for language models
  } else if (tag.includes('speech') || name.includes('speech') || name.includes('audio') || tags.some(t => t.includes('audio'))) {
    return 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)'; // Blue-green for audio models
  } else if (tag.includes('classification') || name.includes('classifier') || tags.some(t => t.includes('classification'))) {
    return 'linear-gradient(135deg, #4B79A1 0%, #283E51 100%)'; // Blue-gray for classification
  } else if (tag.includes('translation') || name.includes('translate') || tags.some(t => t.includes('translation'))) {
    return 'linear-gradient(135deg, #FC5C7D 0%, #6A82FB 100%)'; // Pink-purple for translation
  } else if (tag.includes('summarization') || name.includes('summary') || tags.some(t => t.includes('summarization'))) {
    return 'linear-gradient(135deg, #3494E6 0%, #EC6EAD 100%)'; // Blue-pink for summarization
  } else if (tag.includes('question') || name.includes('qa') || tags.some(t => t.includes('question'))) {
    return 'linear-gradient(135deg, #5433FF 0%, #20BDFF 50%, #A5FECB 100%)'; // Blue-green for QA
  } else if (tag.includes('multimodal') || name.includes('clip') || tags.some(t => t.includes('multimodal'))) {
    return 'linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)'; // Dark blue-teal for multimodal
  } else {
    // Default gradient for other model types
    return 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)';
  }
};

// Generate an AI-themed SVG for fallback
const generateAISVG = (model) => {
  // Determine model type for icon selection
  const modelName = model.name || '';
  const tag = model.pipeline_tag || '';
  
  // Choose an appropriate icon pattern
  let pattern = '';
  
  if (tag.includes('text-generation') || modelName.match(/gpt|llm|llama|bert/i)) {
    // Language model pattern (text bubbles)
    pattern = `
      <circle cx="50" cy="50" r="30" fill="#fff" opacity="0.2" />
      <circle cx="75" cy="30" r="15" fill="#fff" opacity="0.2" />
      <circle cx="80" cy="70" r="20" fill="#fff" opacity="0.2" />
      <circle cx="25" cy="65" r="18" fill="#fff" opacity="0.2" />
    `;
  } else if (tag.includes('image') || modelName.match(/diffusion|gan|vae|stable/i)) {
    // Image model pattern (stylized pixels)
    pattern = `
      <rect x="20" y="20" width="20" height="20" rx="3" fill="#fff" opacity="0.2" />
      <rect x="45" y="20" width="20" height="20" rx="3" fill="#fff" opacity="0.3" />
      <rect x="70" y="20" width="20" height="20" rx="3" fill="#fff" opacity="0.1" />
      <rect x="20" y="45" width="20" height="20" rx="3" fill="#fff" opacity="0.3" />
      <rect x="45" y="45" width="20" height="20" rx="3" fill="#fff" opacity="0.1" />
      <rect x="70" y="45" width="20" height="20" rx="3" fill="#fff" opacity="0.2" />
      <rect x="20" y="70" width="20" height="20" rx="3" fill="#fff" opacity="0.1" />
      <rect x="45" y="70" width="20" height="20" rx="3" fill="#fff" opacity="0.2" />
      <rect x="70" y="70" width="20" height="20" rx="3" fill="#fff" opacity="0.3" />
    `;
  } else if (tag.includes('speech') || modelName.match(/whisper|speech|audio|voice/i)) {
    // Audio model pattern (wave form)
    pattern = `
      <path d="M10,60 Q25,30 40,60 Q55,90 70,60 Q85,30 100,60" stroke="#fff" stroke-width="3" fill="none" opacity="0.3" />
      <path d="M10,70 Q30,50 50,70 Q70,90 90,70" stroke="#fff" stroke-width="2" fill="none" opacity="0.2" />
    `;
  } else if (tag.includes('detect') || modelName.match(/yolo|detect|segment/i)) {
    // Object detection pattern (bounding boxes)
    pattern = `
      <rect x="25" y="25" width="30" height="30" stroke="#fff" stroke-width="2" fill="none" opacity="0.2" />
      <rect x="65" y="40" width="25" height="25" stroke="#fff" stroke-width="2" fill="none" opacity="0.3" />
      <rect x="35" y="60" width="20" height="20" stroke="#fff" stroke-width="2" fill="none" opacity="0.2" />
    `;
  } else {
    // Default AI pattern (connected nodes)
    pattern = `
      <circle cx="30" cy="30" r="5" fill="#fff" opacity="0.3" />
      <circle cx="70" cy="30" r="5" fill="#fff" opacity="0.3" />
      <circle cx="50" cy="50" r="7" fill="#fff" opacity="0.3" />
      <circle cx="30" cy="70" r="5" fill="#fff" opacity="0.3" />
      <circle cx="70" cy="70" r="5" fill="#fff" opacity="0.3" />
      <line x1="30" y1="30" x2="50" y2="50" stroke="#fff" stroke-width="1" opacity="0.3" />
      <line x1="70" y1="30" x2="50" y2="50" stroke="#fff" stroke-width="1" opacity="0.3" />
      <line x1="30" y1="70" x2="50" y2="50" stroke="#fff" stroke-width="1" opacity="0.3" />
      <line x1="70" y1="70" x2="50" y2="50" stroke="#fff" stroke-width="1" opacity="0.3" />
    `;
  }
  
  // Extract colors from gradient
  const gradient = getModelGradient(model);
  const gradParts = gradient.match(/linear-gradient\(.*?, (.*?), (.*?)\)/);
  const color1 = gradParts ? gradParts[1] : '#4B79A1';
  const color2 = gradParts ? gradParts[2] : '#283E51';
  
  // Generate simple SVG with gradient background
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};" />
          <stop offset="100%" style="stop-color:${color2};" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#grad)" />
      ${pattern}
      <text x="50" y="90" font-family="Arial" font-size="10" fill="#fff" text-anchor="middle" opacity="0.5">AI</text>
    </svg>
  `;
  
  // UTF-8 encode for btoa compatibility
  const encodedSvg = unescape(encodeURIComponent(svg));
  
  // Convert SVG to data URL
  return `data:image/svg+xml;base64,${btoa(encodedSvg)}`;
};

const ModelCard = ({ model }) => {
  const isPopular = (model.downloads || 0) > 100000 || (model.likes || 0) > 100;
  
  // State for image handling
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [favorite, setFavorite] = useState(false);
  
  // Get comparison context
  const { addModelToComparison, removeModelFromComparison, isModelInComparison } = useComparison();
  
  // Check if model is in comparison
  const inComparison = isModelInComparison(model.id);
  
  useEffect(() => {
    // Check if model is favorited in localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteModels') || '[]');
    setFavorite(favorites.includes(model.id));
  }, [model.id]);
  
  // Handle favorite toggle
  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Toggle favorite state
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    
    // Update localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteModels') || '[]');
    
    if (newFavoriteState) {
      // Add to favorites if not already present
      if (!favorites.includes(model.id)) {
        favorites.push(model.id);
        setNotification({
          open: true,
          message: 'Added to favorites',
          severity: 'success'
        });
      }
    } else {
      // Remove from favorites
      const index = favorites.indexOf(model.id);
      if (index > -1) {
        favorites.splice(index, 1);
        setNotification({
          open: true,
          message: 'Removed from favorites',
          severity: 'info'
        });
      }
    }
    
    localStorage.setItem('favoriteModels', JSON.stringify(favorites));
  };
  
  // Format numbers with k suffix
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };
  
  // Get a fallback image based on model type
  const getFallbackImage = () => {
    // Try category-specific image
    if (model.pipeline_tag && modelTypeFallbacks[model.pipeline_tag]) {
      return modelTypeFallbacks[model.pipeline_tag];
    }
    
    // Try organization avatar
    if (model.source) {
      return `https://huggingface.co/avatars/${encodeURIComponent(model.source)}`;
    }
    
    // Default fallback
    return modelTypeFallbacks.default;
  };
  
  // Get image URL with better fallback handling
  const getImageUrl = () => {
    if (imgError || !model.imageUrl || model.imageUrl.includes('undefined')) {
      return getFallbackImage();
    }
    return model.imageUrl;
  };
  
  // Add a useEffect to preload and verify the image
  useEffect(() => {
    if (model.imageUrl && !imgError) {
      setImgLoading(true);
      const img = new Image();
      img.src = model.imageUrl;
      img.onload = () => {
        // Image loaded successfully, keep using it
        setImgError(false);
        setImgLoading(false);
      };
      img.onerror = () => {
        // Image failed to load, use fallback
        setImgError(true);
        setImgLoading(false);
      };
    } else {
      setImgLoading(false);
    }
  }, [model.imageUrl]);
  
  // Open/close modal handlers
  const handleOpenModal = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Handle compare button click
  const handleCompareClick = (e) => {
    e.stopPropagation();
    
    if (inComparison) {
      // Remove from comparison
      const result = removeModelFromComparison(model.id);
      setNotification({
        open: true,
        message: result.message,
        severity: 'info'
      });
    } else {
      // Add to comparison
      const result = addModelToComparison(model);
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
  
  // Define zoomFactor state and handlers
  const [zoomFactor, setZoomFactor] = useState(1);
  
  // Function to store model data in session storage before details page navigation
  const handleModelDetails = () => {
    // Store the model data in session storage for details page to access
    try {
      sessionStorage.setItem(`model_${model.id}`, JSON.stringify(model));
    } catch (error) {
      console.error('Error storing model data in session storage:', error);
    }
  };
  
  const handleZoomIn = () => {
    setZoomFactor(prev => Math.min(prev + 0.2, 2));
  };
  
  return (
    <>
      <StyledCard>
        <Box sx={{ position: 'relative' }}>
          {model.loading && (
            <LinearProgress 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 1,
                height: 3
              }} 
            />
          )}
          
          <StyledCardMediaContainer 
            onClick={!model.loading ? handleOpenModal : undefined}
            sx={{ cursor: !model.loading ? 'pointer' : 'default' }}
          >
            {/* Show enhanced placeholder for error cases or while loading */}
            {(imgError || imgLoading) && (
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                <ModelImagePlaceholder 
                  model={model} 
                  loading={imgLoading && !imgError} 
                  size="medium" 
                />
              </Box>
            )}
            
            {/* Actual image - hidden while loading or on error */}
            <StyledCardMedia
              src={getImageUrl()}
              alt={model.name}
              onError={() => setImgError(true)}
              sx={{
                opacity: (model.loading || imgLoading) ? 0.6 : 1,
                transition: 'opacity 0.3s ease',
                filter: (model.loading || imgLoading) ? 'brightness(0.8)' : 'none',
                display: imgError ? 'none' : 'block'
              }}
            />
            
            <StarIconButton
              size="small"
              aria-label="toggle favorite"
              disabled={model.loading}
              onClick={handleFavoriteToggle}
              sx={{ zIndex: 2 }}
              favorite={favorite}
            >
              {favorite ? <StarIcon /> : <StarBorderIcon />}
            </StarIconButton>
            
            <PlatformBadge sx={{ zIndex: 2 }}>
              <Tooltip title="Hugging Face">
                <StorageIcon sx={{ fontSize: 20 }} />
              </Tooltip>
            </PlatformBadge>
            
            {isPopular && !model.loading && (
              <Chip
                label="Popular"
                size="small"
                color="primary"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: 'rgba(24, 68, 92, 0.85)',
                  fontWeight: 'bold',
                  zIndex: 2
                }}
              />
            )}
            
            {/* Zoom button - only show if not loading */}
            {!model.loading && (
              <ZoomButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(e);
                }}
                aria-label="zoom image"
                sx={{ zIndex: 2 }}
              >
                <ZoomInIcon fontSize="small" />
              </ZoomButton>
            )}
          </StyledCardMediaContainer>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" component="h2" gutterBottom noWrap title={model.name}>
            {model.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              lineHeight: 1.4,
              minHeight: '4.2em',
              height: 'auto'
            }}
            title={model.description}
          >
            {model.description || 'No description available'}
          </Typography>
          
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Tooltip title="Downloads">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <DownloadIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(model.downloads)}
                </Typography>
              </Box>
            </Tooltip>
            
            <Tooltip title="Likes">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  ❤️ {formatNumber(model.likes)}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {model.tags && model.tags.slice(0, 3).map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                sx={{ 
                  backgroundColor: '#edf2f7',
                  height: 24,
                  fontSize: '0.7rem'
                }} 
              />
            ))}
            {model.tags && model.tags.length > 3 && (
              <Chip 
                label={`+${model.tags.length - 3}`} 
                size="small" 
                sx={{ 
                  backgroundColor: '#edf2f7',
                  height: 24,
                  fontSize: '0.7rem'
                }} 
              />
            )}
          </Box>
          
          <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {!model.loading && model.demoUrl && (
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<PlayArrowIcon />}
                component="a"
                href={model.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ minWidth: 'auto', fontSize: '0.7rem', p: '3px 8px' }}
              >
                Demo
              </Button>
            )}
            
            {!model.loading && model.apiUrl && (
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<CodeIcon />}
                component="a"
                href={`${model.sourceUrl}#inference-api`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ minWidth: 'auto', fontSize: '0.7rem', p: '3px 8px' }}
              >
                API
              </Button>
            )}
            
            {!model.loading && model.downloadUrl && (
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<DownloadIcon />}
                component="a"
                href={model.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ minWidth: 'auto', fontSize: '0.7rem', p: '3px 8px' }}
              >
                Files
              </Button>
            )}
            
            <Button 
              variant="contained" 
              size="small"
              component={Link}
              to={`/model/${model.id}`}
              color="primary"
              onClick={handleModelDetails}
              sx={{ ml: 'auto', fontSize: '0.7rem', p: '3px 8px' }}
            >
              Details
            </Button>
            
            {/* Add Compare button if enabled */}
            {model.compareEnabled && (
              <Button 
                variant={inComparison ? "contained" : "outlined"}
                size="small"
                color={inComparison ? "secondary" : "primary"}
                startIcon={<CompareArrowsIcon />}
                onClick={handleCompareClick}
                sx={{ fontSize: '0.7rem', p: '3px 8px' }}
              >
                {inComparison ? 'Remove' : 'Compare'}
              </Button>
            )}
          </Box>
        </CardContent>
      </StyledCard>
      
      {/* Modal for displaying full image and details */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>
              <CloseIcon />
            </CloseButton>
            <Box sx={{ 
              position: 'relative', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: 300,
              backgroundColor: '#f0f0f0'
            }}>
              {imgError ? (
                <Box sx={{ width: '100%', height: '100%', minHeight: 300 }}>
                  <ModelImagePlaceholder model={model} size="large" />
                </Box>
              ) : (
                <ModalImage
                  src={getImageUrl()}
                  alt={model.name}
                  onError={() => setImgError(true)}
                  style={{ transform: `scale(${zoomFactor})` }}
                />
              )}
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {model.name}
              </Typography>
              
              {model.fullModelId && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {model.fullModelId}
                </Typography>
              )}
              
              <Typography variant="body1" sx={{ mt: 2, mb: 3, lineHeight: 1.6 }}>
                {model.description}
              </Typography>
              
              {model.tags && model.tags.length > 0 && (
                <Box sx={{ mt: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {model.tags.map((tag, index) => (
                    <Chip 
                      key={index}
                      label={tag}
                      size="small"
                      sx={{ backgroundColor: '#edf2f7' }}
                    />
                  ))}
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                {model.downloads > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DownloadIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {formatNumber(model.downloads)} downloads
                    </Typography>
                  </Box>
                )}
                
                {model.likes > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FavoriteIcon fontSize="small" sx={{ mr: 0.5, color: 'error.light' }} />
                    <Typography variant="body2">
                      {formatNumber(model.likes)} likes
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  startIcon={<LaunchIcon />}
                  component="a"
                  href={model.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  View on Hugging Face
                </Button>
                
                {model.demoUrl && (
                  <Button 
                    variant="outlined" 
                    startIcon={<PlayArrowIcon />}
                    component="a"
                    href={model.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    Try Demo
                  </Button>
                )}
                
                {model.downloadUrl && (
                  <Button 
                    variant="outlined" 
                    startIcon={<DownloadIcon />}
                    component="a"
                    href={model.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    View Files
                  </Button>
                )}
              </Box>
            </Box>
          </ModalContent>
        </Fade>
      </Modal>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModelCard; 