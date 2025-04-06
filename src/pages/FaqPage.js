import React from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../components/Header';
import Footer from '../components/Footer';

// FAQ data
const faqItems = [
  {
    question: 'What is TrendMind?',
    answer: 'TrendMind is a platform that helps you discover, compare, and understand the latest AI models. We aggregate information from multiple sources to provide comprehensive details about AI models across different categories.'
  },
  {
    question: 'How do I compare models?',
    answer: 'You can compare models by clicking the "Compare" button on any model card. You can select up to 4 models to compare side by side, examining their features, performance metrics, and use cases to determine which best fits your needs.'
  },
  {
    question: 'Are all the models free to use?',
    answer: 'No, models have different licensing terms. Some are open-source and free to use, while others may require commercial licenses. We clearly indicate the license type for each model in its details page.'
  },
  {
    question: 'How often is the model database updated?',
    answer: 'We update our database daily to include the latest models and information. Our system automatically scans popular repositories like Hugging Face, GitHub, and academic publications to identify new models.'
  },
  {
    question: 'Can I contribute information about a model?',
    answer: 'Yes! We welcome community contributions. You can suggest edits to any model page or submit new models for inclusion in our database. Simply click the "Suggest Edit" button on a model page or use the "Submit Model" button in the navigation.'
  },
  {
    question: 'Do you offer API access to the model database?',
    answer: 'Yes, we offer an API for developers who want to integrate our model database into their applications. Check out our API documentation for more details on endpoints and usage.'
  },
  {
    question: 'How do you determine trending models?',
    answer: 'We calculate trending models based on several factors, including recent downloads, GitHub stars, paper citations, social media mentions, and user activity on our platform.'
  },
  {
    question: 'Can I save models for later reference?',
    answer: 'Yes, you can create a free account and "like" models to save them to your profile. This makes it easy to come back to models you\'re interested in.'
  },
  {
    question: 'How accurate are the performance metrics?',
    answer: 'We source performance metrics directly from the model creators, academic papers, and benchmarking sites. While we strive for accuracy, we recommend verifying performance for your specific use case as results can vary based on implementation and data.'
  },
  {
    question: 'Do you offer personalized model recommendations?',
    answer: 'Yes, users with accounts receive personalized model recommendations based on their browsing history, liked models, and specified interests. Our recommendation algorithm improves over time as you interact with the platform.'
  },
];

const FaqPage = () => {
  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: '#18445c',
            textAlign: 'center',
            mb: 2
          }}
        >
          Frequently Asked Questions
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 6,
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto',
            color: '#546e7a'
          }}
        >
          Find answers to the most common questions about TrendMind and AI models.
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box sx={{ mb: 8 }}>
          {faqItems.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 1.5 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{ 
                  backgroundColor: '#f8f9fa',
                  '&:hover': {
                    backgroundColor: '#edf4fb',
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '1.1rem',
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ py: 2, px: 3 }}>
                <Typography variant="body1">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        
        <Box 
          sx={{ 
            backgroundColor: '#e8f4fd',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            mb: 4
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Still have questions?
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Contact our support team and we'll get back to you as soon as possible.
          </Typography>
          <Typography variant="body1">
            Email us at: <strong>support@trendmind.ai</strong>
          </Typography>
        </Box>
      </Container>
      
      <Footer />
    </>
  );
};

export default FaqPage; 