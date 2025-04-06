import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Grid,
  Avatar
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

// Function to generate a blog post based on model details
const generateBlogContent = (model) => {
  // If no model provided, return empty content
  if (!model) return {};

  // Extract model attributes
  const {
    name,
    type = '',
    description = '',
    tags = [],
    author = 'TrendMind Team',
    longDescription = '',
    performance = {},
    lastUpdated = '',
  } = model;

  // Format date
  const blogDate = lastUpdated 
    ? new Date(lastUpdated).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

  // Generate title and paragraphs
  const title = `Exploring ${name}: A Comprehensive Guide`;
  
  // Introduction paragraph
  const intro = `${name} is a ${type.toLowerCase()} AI model developed by ${author}. ${description}`;
  
  // Technical overview
  let technicalOverview = longDescription;
  if (!technicalOverview) {
    technicalOverview = `${name} represents a significant advancement in ${type ? type.toLowerCase() : 'artificial intelligence'} technology. `;
    
    // Add details based on tags
    if (tags.some(tag => tag.toLowerCase().includes('vision') || tag.toLowerCase().includes('image'))) {
      technicalOverview += "This model excels in computer vision tasks, allowing it to process and understand visual data with remarkable accuracy. ";
    }
    
    if (tags.some(tag => tag.toLowerCase().includes('nlp') || tag.toLowerCase().includes('text'))) {
      technicalOverview += "Natural language processing capabilities enable this model to understand and generate human language with nuance and contextual awareness. ";
    }
    
    if (tags.some(tag => tag.toLowerCase().includes('audio'))) {
      technicalOverview += "The model demonstrates impressive audio processing abilities, making it suitable for speech recognition and sound analysis tasks. ";
    }
    
    // Get the most relevant tags, limited to 8
    const relevantTags = tags.slice(0, 8).join(', ').toLowerCase();
    technicalOverview += `Users can expect state-of-the-art performance across a range of ${relevantTags || 'AI'} applications.`;
  }
  
  // Performance insights
  let performanceInsights = "";
  if (performance) {
    if (performance.accuracy) {
      performanceInsights += `With an impressive accuracy rating of ${performance.accuracy}%, ${name} stands among the leading models in its category. `;
    }
    
    if (performance.speed) {
      performanceInsights += `The model offers ${performance.speed.toLowerCase()} inference speeds, `;
    } else {
      performanceInsights += "The model offers optimized performance, ";
    }
    
    if (performance.memoryUsage) {
      performanceInsights += `with ${performance.memoryUsage.toLowerCase()} memory requirements making it ${
        performance.memoryUsage.toLowerCase() === 'low' ? 'accessible even on systems with limited resources' : 
        performance.memoryUsage.toLowerCase() === 'medium' ? 'suitable for most standard computing environments' : 
        'ideal for high-performance computing setups'
      }. `;
    }
    
    // Add metrics if available
    if (performance.metrics && performance.metrics.length > 0) {
      performanceInsights += "Additional performance metrics indicate ";
      performance.metrics.forEach((metric, index) => {
        performanceInsights += `${metric.name}: ${metric.value}${index < performance.metrics.length - 1 ? ', ' : '. '}`;
      });
    }
  }
  
  // If no performance data, provide a generic statement
  if (!performanceInsights) {
    // Get at most 3 primary tags for clarity
    const primaryTags = tags.slice(0, 3).join(', ').toLowerCase();
    performanceInsights = `${name} offers competitive performance in its category, though specific metrics are not available. Users can expect reliable results for typical ${primaryTags || 'AI'} tasks.`;
  }
  
  // Use cases
  let useCases = "This model can be applied across various domains, including: ";
  
  if (tags.some(tag => tag.toLowerCase().includes('vision') || tag.toLowerCase().includes('image'))) {
    useCases += "image recognition, object detection, visual content generation, ";
  }
  
  if (tags.some(tag => tag.toLowerCase().includes('nlp') || tag.toLowerCase().includes('text'))) {
    useCases += "content creation, chatbots, text summarization, language translation, ";
  }
  
  if (tags.some(tag => tag.toLowerCase().includes('audio'))) {
    useCases += "speech recognition, audio transcription, sound classification, ";
  }
  
  useCases += "and other innovative applications. ";
  useCases += `Organizations across industries can leverage ${name} to enhance their AI capabilities and create more intelligent, responsive systems.`;
  
  // Conclusion
  const conclusion = `In conclusion, ${name} represents a powerful tool in the modern AI landscape. Its combination of ${
    performance && performance.accuracy ? 'high accuracy' : 'performance excellence'
  }, ${
    performance && performance.speed ? performance.speed.toLowerCase() + ' processing' : 'efficient operation'
  }, and versatility makes it suitable for a wide range of applications. Whether you're working on ${
    tags.length > 0 ? tags.slice(0, 3).join(', ').toLowerCase() : 'AI projects'
  } or other innovative solutions, this model offers the capabilities needed to drive meaningful results.`;

  // Filter to max 8 most important tags
  const importantTags = tags.slice(0, 8);

  return {
    title,
    author,
    date: blogDate,
    readTime: "5 min read",
    views: Math.floor(Math.random() * 1000) + 100,
    content: [
      { type: 'paragraph', text: intro },
      { type: 'heading', text: 'Technical Overview' },
      { type: 'paragraph', text: technicalOverview },
      { type: 'heading', text: 'Performance Insights' },
      { type: 'paragraph', text: performanceInsights },
      { type: 'heading', text: 'Use Cases and Applications' },
      { type: 'paragraph', text: useCases },
      { type: 'heading', text: 'Conclusion' },
      { type: 'paragraph', text: conclusion }
    ],
    tags: importantTags
  };
};

const AIModelBlog = ({ model }) => {
  const blogContent = generateBlogContent(model);
  
  if (!blogContent.content) {
    return null;
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#1e3a5f', fontWeight: 'bold', mb: 3 }}>
        AI Model Insights
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1e3a5f' }}>
          {blogContent.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: '#1976d2', mr: 1 }}>
              <PersonIcon fontSize="small" />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {blogContent.author}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon fontSize="small" sx={{ color: '#9e9e9e', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {blogContent.date}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon fontSize="small" sx={{ color: '#9e9e9e', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {blogContent.views} views
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            {blogContent.readTime}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {blogContent.tags.map((tag, index) => (
            <Chip 
              key={index} 
              label={tag} 
              size="small"
              sx={{ backgroundColor: '#e8f4fd', color: '#0277bd' }} 
            />
          ))}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box>
          {blogContent.content.map((section, index) => {
            if (section.type === 'heading') {
              return (
                <Typography 
                  key={index} 
                  variant="h5" 
                  component="h2" 
                  gutterBottom 
                  sx={{ fontWeight: 'medium', color: '#1e3a5f', mt: 3, mb: 2 }}
                >
                  {section.text}
                </Typography>
              );
            } else {
              return (
                <Typography 
                  key={index} 
                  variant="body1" 
                  paragraph
                  sx={{ lineHeight: 1.7 }}
                >
                  {section.text}
                </Typography>
              );
            }
          })}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {blogContent.date}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Generated by TrendMind AI
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AIModelBlog; 