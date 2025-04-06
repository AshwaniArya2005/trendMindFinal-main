import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  Paper,
  TextField,
  Button,
  Stack,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Avatar,
  FormHelperText,
  Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SortIcon from '@mui/icons-material/Sort';

const RatingBreakdown = ({ ratings }) => {
  // Calculate total reviews
  const totalReviews = ratings.reduce((sum, rating) => sum + rating.count, 0);
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
      {/* Average rating display */}
      <Box sx={{ mr: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="div" sx={{ fontWeight: 'bold', color: '#1e3a5f', lineHeight: 1.2 }}>
          {totalReviews === 0 ? '0' : (ratings.reduce((sum, rating) => sum + (rating.stars * rating.count), 0) / totalReviews).toFixed(1)}
        </Typography>
        <Rating 
          value={totalReviews === 0 ? 0 : ratings.reduce((sum, rating) => sum + (rating.stars * rating.count), 0) / totalReviews} 
          readOnly 
          precision={0.5}
          sx={{ fontSize: '1.5rem', mb: 0.5 }}
        />
        <Typography variant="body2" color="text.secondary">
          {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </Typography>
      </Box>

      {/* Rating breakdown bars */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Rating Breakdown
        </Typography>
        {ratings.map((rating) => (
          <Box key={rating.stars} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 40 }}>
              {rating.stars}★
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={totalReviews === 0 ? 0 : (rating.count / totalReviews) * 100} 
              sx={{ 
                flexGrow: 1, 
                mx: 1, 
                height: 8, 
                borderRadius: 5,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#1976d2'
                }
              }} 
            />
            <Typography variant="body2" sx={{ minWidth: 30 }}>
              {rating.count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const ReviewForm = ({ onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [useCase, setUseCase] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    // Validate form
    const newErrors = {};
    if (rating === 0) newErrors.rating = 'Please select a rating';
    if (!useCase) newErrors.useCase = 'Please select a use case';
    if (!comment.trim()) newErrors.comment = 'Please share your experience';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the review
    onSubmitReview({
      rating,
      useCase,
      comment,
      date: new Date().toISOString(),
      user: {
        name: 'Anonymous User',
        avatar: null
      }
    });

    // Reset form
    setRating(0);
    setUseCase('');
    setComment('');
    setErrors({});
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#1e3a5f', fontWeight: 'medium', mb: 2 }}>
        Write a Review
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom sx={{ mb: 0.5 }}>
          Overall Rating <Box component="span" sx={{ color: 'error.main' }}>*</Box>
        </Typography>
        <Rating 
          name="review-rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          precision={1}
          size="large"
          sx={{ fontSize: '2rem' }}
        />
        {errors.rating && (
          <FormHelperText error>{errors.rating}</FormHelperText>
        )}
      </Box>
      
      <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.useCase)}>
        <InputLabel id="use-case-label">Use Case <Box component="span" sx={{ color: 'error.main' }}>*</Box></InputLabel>
        <Select
          labelId="use-case-label"
          value={useCase}
          label="Use Case *"
          onChange={(e) => setUseCase(e.target.value)}
        >
          <MenuItem value="Text Generation">Text Generation</MenuItem>
          <MenuItem value="Image Generation">Image Generation</MenuItem>
          <MenuItem value="Audio Processing">Audio Processing</MenuItem>
          <MenuItem value="Question Answering">Question Answering</MenuItem>
          <MenuItem value="Data Analysis">Data Analysis</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        {errors.useCase && (
          <FormHelperText>{errors.useCase}</FormHelperText>
        )}
      </FormControl>
      
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Share your experience with this model..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 2 }}
        error={Boolean(errors.comment)}
        helperText={errors.comment}
      />
      
      <Button 
        variant="contained" 
        endIcon={<SendIcon />}
        onClick={handleSubmit}
        sx={{ 
          backgroundColor: '#1e3a5f', 
          '&:hover': { 
            backgroundColor: '#15293f' 
          } 
        }}
      >
        Submit Review
      </Button>
    </Box>
  );
};

const ReviewsList = ({ reviews, sortOrder = "Most Recent" }) => {
  // Sort reviews based on sortOrder
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOrder === "Most Recent") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOrder === "Highest Rated") {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });

  if (reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No reviews yet. Be the first to review this model!
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {sortedReviews.map((review, index) => (
        <Paper key={index} elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Avatar 
              src={review.user.avatar}
              alt={review.user.name}
              sx={{ mr: 2, width: 40, height: 40 }}
            >
              {review.user.name.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {review.user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={review.rating} readOnly size="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {new Date(review.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>
              <Chip 
                label={review.useCase} 
                size="small" 
                sx={{ 
                  backgroundColor: '#e8f4fd', 
                  color: '#0277bd',
                  mb: 1
                }} 
              />
              <Typography variant="body1">
                {review.comment}
              </Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

const ReviewsSection = ({ modelId, modelName }) => {
  const [sortOrder, setSortOrder] = useState("Most Recent");
  // Mock data for ratings and reviews - in a real app, you would fetch this
  const [ratings, setRatings] = useState([
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 }
  ]);
  const [reviews, setReviews] = useState([]);

  const handleSubmitReview = (newReview) => {
    // Add the review to state
    setReviews([newReview, ...reviews]);
    
    // Update ratings count
    const updatedRatings = [...ratings];
    updatedRatings[5 - newReview.rating].count += 1;
    setRatings(updatedRatings);
  };

  return (
    <Box sx={{ my: 4, py: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 3, color: '#1e3a5f', fontWeight: 'bold' }}>
        Reviews & Feedback
      </Typography>
      
      <RatingBreakdown ratings={ratings} />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="sort-reviews-label">Sort by</InputLabel>
          <Select
            labelId="sort-reviews-label"
            id="sort-reviews"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Sort by"
            startAdornment={<SortIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />}
          >
            <MenuItem value="Most Recent">Most Recent</MenuItem>
            <MenuItem value="Highest Rated">Highest Rated</MenuItem>
            <MenuItem value="Lowest Rated">Lowest Rated</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <ReviewsList reviews={reviews} sortOrder={sortOrder} />
      
      <Divider sx={{ my: 4 }} />
      
      <ReviewForm onSubmitReview={handleSubmitReview} />
    </Box>
  );
};

export default ReviewsSection; 