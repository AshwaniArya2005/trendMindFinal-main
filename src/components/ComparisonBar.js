import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  Avatar,
  Tooltip,
  Slide,
  Divider,
  Badge
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../contexts/ComparisonContext';
import ModelImagePlaceholder from './ModelImagePlaceholder';

const ComparisonBar = () => {
  const navigate = useNavigate();
  const { 
    comparisonModels, 
    removeModelFromComparison, 
    clearComparison,
    showComparisonBar,
    setShowComparisonBar,
    MAX_COMPARISON_MODELS
  } = useComparison();
  
  // Format download numbers with k/M suffix
  const formatDownloads = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };
  
  // Handle navigating to the comparison page
  const handleCompare = () => {
    navigate('/compare');
  };
  
  // Handle removing a model from comparison
  const handleRemoveModel = (e, modelId) => {
    e.stopPropagation();
    removeModelFromComparison(modelId);
  };
  
  // Handle closing the comparison bar
  const handleClose = () => {
    setShowComparisonBar(false);
  };
  
  // No need to render if no models or bar is hidden
  if (!showComparisonBar || comparisonModels.length === 0) {
    return null;
  }
  
  // Get the empty slots
  const emptySlots = MAX_COMPARISON_MODELS - comparisonModels.length;
  
  return (
    <Slide direction="up" in={showComparisonBar}>
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <CompareArrowsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="medium">
            Model Comparison
          </Typography>
        </Box>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1, 
          gap: 2,
          overflowX: 'auto',
          py: 1,
          px: 2,
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 3 }
        }}>
          {/* Selected Models */}
          {comparisonModels.map((model) => (
            <Paper
              key={model.id}
              variant="outlined"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 1, 
                borderRadius: 2,
                minWidth: 200,
                position: 'relative'
              }}
            >
              <Box sx={{ width: 40, height: 40, mr: 1, borderRadius: 1, overflow: 'hidden' }}>
                {model.imageUrl ? (
                  <Avatar 
                    src={model.imageUrl} 
                    alt={model.name}
                    variant="rounded"
                    sx={{ width: 40, height: 40 }}
                  />
                ) : (
                  <Box sx={{ width: 40, height: 40 }}>
                    <ModelImagePlaceholder model={model} size="small" />
                  </Box>
                )}
              </Box>
              
              <Box sx={{ maxWidth: 120 }}>
                <Typography 
                  variant="body2" 
                  fontWeight="medium" 
                  noWrap 
                  title={model.name}
                >
                  {model.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block' }}
                  noWrap
                >
                  {model.tags?.[0] || 'AI Model'} • {formatDownloads(model.downloads)} ↓
                </Typography>
              </Box>
              
              <IconButton 
                size="small" 
                onClick={(e) => handleRemoveModel(e, model.id)}
                sx={{ ml: 1 }}
                aria-label={`Remove ${model.name} from comparison`}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
          
          {/* Empty Slots */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <Paper
              key={`empty-${index}`}
              variant="outlined"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 1, 
                borderRadius: 2,
                width: 200,
                height: 58,
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                borderStyle: 'dashed'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Add model to compare
              </Typography>
            </Paper>
          ))}
        </Box>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            variant="contained"
            color="primary"
            onClick={handleCompare}
            startIcon={<CompareArrowsIcon />}
            disabled={comparisonModels.length < 2}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Compare Models
          </Button>
          
          <Tooltip title="Clear all models">
            <IconButton 
              onClick={clearComparison}
              size="small"
              color="default"
              sx={{ ml: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Close comparison bar">
            <IconButton 
              onClick={handleClose}
              size="small"
              edge="end"
              sx={{ ml: 1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Slide>
  );
};

export default ComparisonBar; 