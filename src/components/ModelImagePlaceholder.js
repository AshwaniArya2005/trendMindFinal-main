import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

/**
 * Enhanced placeholder component for model images
 * Shows a visually appealing, category-specific placeholder when model images
 * aren't available or are loading
 */
const ModelImagePlaceholder = ({ model, loading, size = 'medium' }) => {
  // Get a placeholder icon based on model category
  const getIcon = () => {
    if (!model) return '🤖';
    
    const name = (model.name || '').toLowerCase();
    const tags = (model.tags || []).map(t => t.toLowerCase());
    
    if (tags.some(t => t.includes('llm') || t.includes('language') || t.includes('text-generation')) ||
        name.includes('gpt') || name.includes('llm') || name.includes('language') || 
        name.includes('bert') || name.includes('t5') || name.includes('transformer')) {
      return '📝';
    }
    
    if (tags.some(t => t.includes('image') || t.includes('vision') || t.includes('diffusion')) ||
        name.includes('diffusion') || name.includes('gan') || name.includes('vision') || 
        name.includes('image') || name.includes('dalle') || name.includes('stable')) {
      return '🖼️';
    }
    
    if (tags.some(t => t.includes('audio') || t.includes('speech') || t.includes('voice')) ||
        name.includes('audio') || name.includes('speech') || name.includes('voice') || 
        name.includes('whisper') || name.includes('wav') || name.includes('sound')) {
      return '🔊';
    }
    
    if (tags.some(t => t.includes('video') || t.includes('motion')) ||
        name.includes('video') || name.includes('clip') || name.includes('motion')) {
      return '🎬';
    }
    
    if (tags.some(t => t.includes('question') || t.includes('answer') || t.includes('qa')) ||
        name.includes('qa') || name.includes('question')) {
      return '❓';
    }
    
    if (tags.some(t => t.includes('multimodal') || t.includes('multi-modal')) ||
        name.includes('multimodal') || name.includes('multi-modal') || name.includes('clip')) {
      return '🧩';
    }
    
    if (tags.some(t => t.includes('embedding') || t.includes('similarity')) ||
        name.includes('embedding') || name.includes('similarity') || name.includes('encoder')) {
      return '🔍';
    }
    
    return '🤖';
  };
  
  // Get gradient background based on model type
  const getBackground = () => {
    if (!model) return 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    
    const name = (model.name || '').toLowerCase();
    const tags = (model.tags || []).map(t => t.toLowerCase());
    
    // Text/LLM models - purplish gradient
    if (tags.some(t => t.includes('llm') || t.includes('language') || t.includes('text')) ||
        name.includes('gpt') || name.includes('llm') || name.includes('bert')) {
      return 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)';
    }
    
    // Image models - reddish gradient
    if (tags.some(t => t.includes('image') || t.includes('vision') || t.includes('diffusion')) ||
        name.includes('diffusion') || name.includes('gan') || name.includes('image')) {
      return 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)';
    }
    
    // Audio models - bluish gradient
    if (tags.some(t => t.includes('audio') || t.includes('speech')) ||
        name.includes('audio') || name.includes('speech') || name.includes('whisper')) {
      return 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
    }
    
    // Video models - orangish gradient
    if (tags.some(t => t.includes('video')) || name.includes('video')) {
      return 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
    }
    
    // QA models - greenish gradient
    if (tags.some(t => t.includes('question') || t.includes('qa')) || name.includes('qa')) {
      return 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)';
    }
    
    // Multimodal - colorful gradient
    if (tags.some(t => t.includes('multimodal')) || name.includes('multimodal') || name.includes('clip') || name.includes('claude')) {
      return 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)';
    }
    
    // Default gradient
    return 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
  };

  // Determine size properties based on the size prop
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 120,
          iconSize: '1.8rem',
          textSize: '0.75rem'
        };
      case 'large':
        return {
          height: 300,
          iconSize: '3.5rem',
          textSize: '1rem'
        };
      case 'medium':
      default:
        return {
          height: 200,
          iconSize: '2.5rem',
          textSize: '0.875rem'
        };
    }
  };

  const sizeStyles = getSizeStyles();
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      width: '100%',
      height: sizeStyles.height,
      background: getBackground(),
      borderRadius: 2,
      color: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.1,
        backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 12%), 
                          radial-gradient(circle at 70% 65%, rgba(255,255,255,0.3) 0%, transparent 12%)`,
      }} />
      
      <Box sx={{ 
        fontSize: sizeStyles.iconSize, 
        mb: 2,
        filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.07))'
      }}>
        {getIcon()}
      </Box>
      
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 'medium',
          fontSize: sizeStyles.textSize,
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {model?.name || (loading ? 'Loading model...' : 'AI Model')}
      </Typography>
      
      {loading && (
        <CircularProgress 
          size={24} 
          sx={{ 
            mt: 2,
            color: 'rgba(255,255,255,0.8)'
          }} 
        />
      )}
    </Box>
  );
};

export default ModelImagePlaceholder; 