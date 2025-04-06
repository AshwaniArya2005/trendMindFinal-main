import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  LinearProgress,
  Alert,
  Button,
  Snackbar,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ModelCard from '../components/ModelCard';

// Mock data for models
const mockModels = [
  {
    id: 1,
    name: 'GPT-4',
    description: 'OpenAI\'s most advanced model with improved reasoning, broader knowledge, and creative capabilities. Handles complex tasks with high accuracy.',
    tags: ['LLM', 'Text Generation', 'Multimodal'],
    imageUrl: 'https://raw.githubusercontent.com/openai/openai-python/main/logo.png',
    compareEnabled: true,
    source: 'OpenAI',
    sourceUrl: 'https://openai.com/gpt-4'
  },
  {
    id: 2,
    name: 'LLAMA-3',
    description: 'Meta\'s open foundation LLM series, with exceptional instruction-following abilities and multilingual support. Available in 8B and 70B parameter sizes.',
    tags: ['LLM', 'Open-Source', 'Transformer'],
    imageUrl: 'https://huggingface.co/front/assets/meta-llama2.png',
    compareEnabled: true,
    source: 'Meta',
    sourceUrl: 'https://github.com/meta-llama/llama'
  },
  {
    id: 3,
    name: 'Stable Diffusion XL',
    description: 'State-of-the-art text-to-image generation model by Stability AI, capable of creating high-quality and diverse images from text descriptions.',
    tags: ['Image Generation', 'Diffusion Model', 'Text-to-Image'],
    imageUrl: 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/stable_diffusion/stable-banner.png',
    compareEnabled: true,
    source: 'Stability AI',
    sourceUrl: 'https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0'
  },
  {
    id: 4,
    name: 'Whisper',
    description: 'OpenAI\'s robust speech recognition model that can transcribe and translate audio in multiple languages with remarkable accuracy.',
    tags: ['Speech Recognition', 'Audio', 'Multilingual'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1024px-OpenAI_Logo.svg.png',
    compareEnabled: true,
    source: 'OpenAI',
    sourceUrl: 'https://huggingface.co/openai/whisper-large-v3'
  },
  {
    id: 5,
    name: 'CLIP',
    description: 'Contrastive Language-Image Pre-training model by OpenAI that connects text and images, enabling powerful image understanding and retrieval.',
    tags: ['Multimodal', 'Vision-Language', 'Contrastive Learning'],
    imageUrl: 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/clip/thumbnail.png',
    compareEnabled: true,
    source: 'OpenAI',
    sourceUrl: 'https://github.com/openai/CLIP'
  },
  {
    id: 6,
    name: 'Mistral 7B',
    description: 'High-performance open-source LLM that matches or exceeds larger models while being more efficient. Optimized for real-world applications.',
    tags: ['LLM', 'Transformer', 'Open-Source'],
    imageUrl: 'https://mistral.ai/images/logo.svg',
    compareEnabled: true,
    source: 'Mistral AI',
    sourceUrl: 'https://huggingface.co/mistralai/Mistral-7B-v0.1'
  },
  {
    id: 7,
    name: 'DINO v2',
    description: 'Self-supervised vision model from Meta Research that learns powerful visual features without labels, achieving SOTA performance on multiple vision tasks.',
    tags: ['Computer Vision', 'Self-Supervised', 'Features'],
    imageUrl: 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/transformers/model_doc/dinov2_architecture.png',
    compareEnabled: true,
    source: 'Meta Research',
    sourceUrl: 'https://github.com/facebookresearch/dinov2'
  },
  {
    id: 8,
    name: 'BERT',
    description: 'Bidirectional Encoder Representations from Transformers by Google, a groundbreaking NLP model that revolutionized contextual word representations.',
    tags: ['NLP', 'Transformer', 'Text Embedding'],
    imageUrl: 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/bert/bert.jpg',
    compareEnabled: true,
    source: 'Google Research',
    sourceUrl: 'https://github.com/google-research/bert'
  },
  {
    id: 9,
    name: 'Gemma',
    description: 'Google\'s family of lightweight open models built from the same research and technology used to create Gemini models, optimized for responsible AI deployment.',
    tags: ['LLM', 'Open-Source', 'Responsible AI'],
    imageUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemma-marquee.max-1000x1000.jpg',
    compareEnabled: true,
    source: 'Google',
    sourceUrl: 'https://huggingface.co/google/gemma-7b'
  },
  {
    id: 10,
    name: 'SAM (Segment Anything)',
    description: 'Meta\'s foundation model for image segmentation that can identify and segment any object in an image with minimal guidance.',
    tags: ['Computer Vision', 'Segmentation', 'Foundation Model'],
    imageUrl: 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/sam/thumbnail.png',
    compareEnabled: true,
    source: 'Meta Research',
    sourceUrl: 'https://github.com/facebookresearch/segment-anything'
  },
  {
    id: 11,
    name: 'DALL-E 3',
    description: 'OpenAI\'s advanced text-to-image generation model with exceptional ability to render detailed descriptions, understand spatial relationships, and follow instructions.',
    tags: ['Image Generation', 'Text-to-Image', 'Generative AI'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1024px-OpenAI_Logo.svg.png',
    compareEnabled: true,
    source: 'OpenAI',
    sourceUrl: 'https://openai.com/dall-e-3'
  },
  {
    id: 12,
    name: 'Falcon',
    description: 'TII\'s powerful and efficient LLM trained on 1 trillion tokens of RefinedWeb enhanced dataset, offering open and commercial options for various use cases.',
    tags: ['LLM', 'Transformer', 'Causal Language Model'],
    imageUrl: 'https://huggingface.co/spaces/tiiuae/falcon-180b-demo/resolve/main/images/falcon_card.png',
    compareEnabled: true,
    source: 'Technology Innovation Institute',
    sourceUrl: 'https://huggingface.co/tiiuae/falcon-180B'
  }
];

// Add themed fallback images for different model types
const fallbackImages = {
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
  'default': 'https://huggingface.co/front/assets/huggingface-logo.svg'
};

// Add direct thumbnails fallback option
const getDirectThumbnail = (modelId) => {
  // For some popular repositories, HF has direct thumbnails
  return `https://huggingface.co/datasets/huggingface/assets/resolve/main/repository-thumbnails/${encodeURIComponent(modelId)}.png`;
};

// Function to generate a concise one-line description
const generateShortDescription = (model, cardData) => {
  // If we have a description from cardData, use that first
  if (cardData?.cardData?.text) {
    // Extract first paragraph or up to 3 sentences
    const sentences = cardData.cardData.text.split(/(?<=[.!?])\s+/);
    if (sentences.length > 0) {
      // Get up to 3 sentences for a more complete description
      const description = sentences.slice(0, 3).join(' ');
      if (description.length > 30) {
        return description;
      }
    }
  }
  
  // If we have pipeline_tag, use that to generate a descriptive paragraph
  if (cardData?.pipeline_tag) {
    const modelName = model.modelId.split('/').pop();
    const creator = model.modelId.split('/')[0];
    
    // Map pipeline tags to comprehensive descriptions
    const tagDescriptions = {
      'text-generation': `${creator}'s language model designed for generating human-like text, supporting chat interactions, creative writing, and content generation. It can produce coherent and contextually appropriate responses for various applications.`,
      'fill-mask': `This fill-mask model specializes in predicting missing words within text, helping to complete sentences naturally. It understands context and can suggest appropriate words to fill in blanks in a wide range of texts.`,
      'text-classification': `A sophisticated text classification model for analyzing sentiment, categorizing content, and identifying text types. It can process and classify text into predefined categories with high accuracy.`,
      'token-classification': `Advanced token classification model for named entity recognition and part-of-speech tagging. It can identify specific elements in text such as people, organizations, locations, dates, and grammatical components.`,
      'question-answering': `This question answering model provides accurate and relevant answers to natural language queries. It comprehends questions and extracts precise answers from provided context, making it valuable for information retrieval systems.`,
      'summarization': `A powerful text summarization model that condenses long documents while preserving key information and main points. It can generate concise summaries of articles, reports, and other lengthy texts.`,
      'translation': `Versatile translation model supporting multiple languages for accurate text conversion. It produces natural-sounding translations while maintaining the original meaning and nuances of the source text.`,
      'text2text-generation': `This text-to-text generation model excels at paraphrasing and text transformation tasks. It can rewrite content in different styles, formats, or complexity levels while preserving the essential meaning.`,
      'text-to-image': `Creative text-to-image generation model that transforms textual descriptions into visual imagery. It can generate detailed images based on text prompts with impressive fidelity to the described concepts.`,
      'image-to-text': `Perceptive image-to-text model that generates detailed descriptions of visual content. It can analyze images and produce relevant, accurate textual descriptions of their contents and meaning.`,
      'image-classification': `Precise image classification model for categorizing visual content into predefined classes. It can identify what appears in images across a wide variety of categories and subject matter.`,
      'object-detection': `Sophisticated object detection model that identifies and locates multiple objects in images. It can recognize different objects and provide their spatial coordinates within the image.`,
      'image-segmentation': `Advanced image segmentation model for pixel-level classification of image content. It can precisely delineate different objects or regions within an image at the pixel level.`,
      'speech-recognition': `High-fidelity speech recognition model that accurately converts spoken language into written text. It can transcribe speech from various speakers and in different acoustic environments.`,
      'audio-classification': `Discriminative audio classification model for identifying sounds, music, and speech categories. It can categorize audio content across a wide range of sound types and sources.`,
      'automatic-speech-recognition': `This automatic speech recognition model excels at transcribing spoken content into text with high accuracy. It works well with diverse accents, languages, and acoustic conditions.`,
      'feature-extraction': `Powerful feature extraction model for creating vector embeddings from input data. It transforms raw data into meaningful vector representations that capture semantic information.`,
      'sentence-similarity': `This sentence similarity model measures semantic relatedness between texts with high precision. It can determine how similar sentences are in meaning, regardless of their specific wording.`,
      'zero-shot-classification': `Flexible zero-shot classification model that can classify content without specific training examples. It can identify categories in new data even when it hasn't seen examples of those categories during training.`,
      'conversational': `Sophisticated conversational AI model designed for natural dialogue and chat applications. It can maintain coherent conversations, remember context, and generate appropriate responses to user inputs.`
    };
    
    if (tagDescriptions[cardData.pipeline_tag]) {
      return tagDescriptions[cardData.pipeline_tag];
    }
  }
  
  // If we have tags, use them to create a more detailed description
  if (model.tags && model.tags.length > 0) {
    const creator = model.modelId.includes('/') ? model.modelId.split('/')[0] : 'This open-source';
    const modelName = model.modelId.split('/').pop();
    const tagList = model.tags.slice(0, 4).join(', ');
    
    return `${creator}'s model specializes in ${tagList} tasks. It provides state-of-the-art performance and can be integrated into various applications requiring these capabilities. This model is optimized for production use and supports efficient inference.`;
  }
  
  // Fallback description
  return model.description || `This AI model supports various machine learning tasks and can be deployed for multiple use cases. It represents an implementation of modern deep learning techniques for practical applications.`;
};

const DiscoverPage = () => {
  // State for models and loading
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');
  
  // State for filters
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [filteredModels, setFilteredModels] = useState([]);

  // Function to fetch models
  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from Hugging Face with timeout
      let controller;
      let hfData;
      
      try {
        controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch('https://huggingface.co/api/models?sort=downloads&direction=-1&limit=40', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to fetch models from Hugging Face');
        }
        
        hfData = await response.json();
      } catch (fetchError) {
        console.warn(`API fetch failed: ${fetchError.message}`);
        throw new Error(`API fetch failed: ${fetchError.message}`);
      }
      
      let enhancedModels = Array(hfData.length).fill({});
      
      // Process models in parallel with a limit of 5 concurrent requests
      await Promise.all(
        Array.from({ length: Math.ceil(hfData.length / 5) }, async (_, chunkIndex) => {
          const start = chunkIndex * 5;
          const end = Math.min(start + 5, hfData.length);
          
          await Promise.all(
            Array.from({ length: end - start }, async (_, index) => {
              const i = start + index;
              try {
                const model = hfData[i];
                // Default image to HF logo
                let modelImage = 'https://huggingface.co/front/assets/huggingface-logo.svg';
                let cardData = null;
                
                // First try to get an organization avatar as a potential fallback
                let orgAvatar = null;
                if (model.modelId.includes('/')) {
                  const orgName = model.modelId.split('/')[0];
                  try {
                    // Try to get org avatar directly
                    const avatarUrl = `https://huggingface.co/avatars/${orgName}`;
                    const avatarResponse = await fetch(avatarUrl, { method: 'HEAD' });
                    if (avatarResponse.ok) {
                      orgAvatar = avatarUrl;
                    }
                  } catch (error) {
                    console.warn(`Failed to fetch avatar for ${orgName}`);
                  }
                }
                
                // Fetch model card data
                try {
                  const cardResponse = await fetch(`https://huggingface.co/api/models/${model.modelId}`);
                  if (cardResponse.ok) {
                    cardData = await cardResponse.json();
                    
                    // Try to get thumbnail from card data
                    if (cardData?.cardData?.thumbnail) {
                      try {
                        const thumbnailResponse = await fetch(cardData.cardData.thumbnail, { method: 'HEAD' });
                        if (thumbnailResponse.ok) {
                          modelImage = cardData.cardData.thumbnail;
                        }
                      } catch (error) {
                        console.warn(`Thumbnail not accessible for ${model.modelId}`);
                      }
                    }
                    
                    // If no thumbnail, try to get an image from the model files
                    if (modelImage === 'https://huggingface.co/front/assets/huggingface-logo.svg' && 
                        cardData?.siblings && cardData.siblings.length > 0) {
                      const imageFiles = cardData.siblings.filter(file => 
                        file.rfilename.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                      );
                      
                      if (imageFiles.length > 0) {
                        // Sort to find the best image
                        const sortedImages = imageFiles.sort((a, b) => {
                          // Prioritize standard naming patterns
                          const patterns = ['thumbnail', 'banner', 'header', 'preview', 'model', 'example'];
                          const aName = a.rfilename.toLowerCase();
                          const bName = b.rfilename.toLowerCase();
                          const aScore = patterns.findIndex(pattern => aName.includes(pattern));
                          const bScore = patterns.findIndex(pattern => bName.includes(pattern));
                          
                          if (aScore !== -1 && bScore !== -1) return aScore - bScore;
                          if (aScore !== -1) return -1;
                          if (bScore !== -1) return 1;
                          
                          return (b.size || 0) - (a.size || 0);
                        });
                        
                        // Get the image URL and verify it exists
                        const imageUrl = `https://huggingface.co/${model.modelId}/resolve/main/${sortedImages[0].rfilename}`;
                        try {
                          const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
                          if (imageResponse.ok) {
                            modelImage = imageUrl;
                          }
                        } catch (error) {
                          console.warn(`Image file not accessible for ${model.modelId}`);
                        }
                      }
                    }
                  }
                } catch (error) {
                  console.warn(`Failed to fetch model data for ${model.modelId}`);
                }
                
                // If we still don't have a good image, use a themed fallback based on model type
                if (modelImage === 'https://huggingface.co/front/assets/huggingface-logo.svg') {
                  if (cardData?.pipeline_tag && fallbackImages[cardData.pipeline_tag]) {
                    modelImage = fallbackImages[cardData.pipeline_tag];
                  } else if (orgAvatar) {
                    modelImage = orgAvatar;
                  } else {
                    // Try to determine from model name or tags
                    const modelTags = model.tags || [];
                    const modelName = model.modelId.toLowerCase();
                    
                    for (const [type, image] of Object.entries(fallbackImages)) {
                      if (type !== 'default' && (
                        modelTags.some(tag => tag.toLowerCase().includes(type.replace('-', ''))) ||
                        modelName.includes(type.replace('-', ''))
                      )) {
                        modelImage = image;
                        break;
                      }
                    }
                    
                    // Final fallback
                    if (modelImage === 'https://huggingface.co/front/assets/huggingface-logo.svg') {
                      modelImage = fallbackImages.default;
                    }
                  }
                }
                
                // Try a direct repository thumbnail as another option
                try {
                  const directThumbnail = getDirectThumbnail(model.modelId);
                  const directResponse = await fetch(directThumbnail, { method: 'HEAD' });
                  if (directResponse.ok) {
                    modelImage = directThumbnail;
                  } else {
                    throw new Error('Direct thumbnail not available');
                  }
                } catch (error) {
                  // Continue with other fallbacks
                  if (orgAvatar) {
                    modelImage = orgAvatar;
                  }
                }
                
                // Update the model with enhanced information
                enhancedModels[i] = {
                  id: `hf-${i}`,
                  name: model.modelId.split('/').pop(),
                  fullModelId: model.modelId,
                  description: generateShortDescription(model, cardData),
                  tags: model.tags || [],
                  pipeline_tag: cardData?.pipeline_tag || '',
                  imageUrl: modelImage,
                  compareEnabled: true,
                  source: model.modelId.includes('/') ? model.modelId.split('/')[0] : 'Unknown',
                  sourceUrl: `https://huggingface.co/${model.modelId}`,
                  demoUrl: `https://huggingface.co/${model.modelId}?inference=1`,
                  downloadUrl: cardData?.pipeline_tag ? `https://huggingface.co/api/models/${model.modelId}` : null,
                  apiUrl: cardData?.pipeline_tag ? `https://huggingface.co/api/models/${model.modelId}` : null,
                  downloads: model.downloads || 0,
                  likes: model.likes || 0,
                  orgAvatar: orgAvatar
                };
              } catch (error) {
                console.error(`Error fetching data for model at index ${i}:`, error);
                enhancedModels[i] = {
                  id: `hf-${i}`,
                  name: hfData[i]?.modelId?.split('/').pop() || `Model ${i}`,
                  fullModelId: hfData[i]?.modelId || '',
                  description: hfData[i]?.tags?.length > 0 
                    ? `Model for ${hfData[i].tags.slice(0, 3).join(', ')} tasks`
                    : `AI model with advanced capabilities`,
                  tags: hfData[i]?.tags || [],
                  imageUrl: fallbackImages.default,
                  compareEnabled: false,
                  source: hfData[i]?.modelId?.split('/')[0] || 'Unknown',
                  sourceUrl: hfData[i]?.modelId ? `https://huggingface.co/${hfData[i].modelId}` : '#',
                  loading: false,
                  error: true
                };
              }
            })
          );
        })
      );
      
      // Filter out any empty models and select the top 30 with the best images
      enhancedModels = enhancedModels
        .filter(model => model && model.id)
        .filter(model => !model.error)
        .slice(0, 30);
      
      setModels(enhancedModels);
      setFilteredModels(enhancedModels);
    } catch (error) {
      console.error('Error fetching models:', error);
      // Use the mockModels array as a fallback when the API fails
      console.log('Using mock models as fallback due to API error');
      setError('Unable to fetch models from API. Using local sample models instead.');
      
      // Add downloadUrl to mock models if not already present
      const enhancedMockModels = mockModels.map(model => ({
        ...model,
        downloadUrl: model.downloadUrl || model.sourceUrl,
        compareEnabled: true
      }));
      
      setModels(enhancedMockModels);
      setFilteredModels(enhancedMockModels);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch models on initial load
  useEffect(() => {
    fetchModels();
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    setNotification('Refreshing models...');
    try {
      fetchModels()
        .catch(error => {
          console.error("Error during refresh:", error);
          setNotification('Failed to refresh models. Using local data instead.');
        });
    } catch (error) {
      console.error("Error during refresh:", error);
      setNotification('Failed to refresh models. Using local data instead.');
    }
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification('');
  };

  // Filter models when filter criteria change
  useEffect(() => {
    let result = [...models];
    
    // Apply category filter
    if (category) {
      const categoryMap = {
        'llm': ['llm', 'language model', 'language-model', 'transformer', 'nlp', 'gpt', 'bert', 'text generation', 'text-generation'],
        'computer-vision': ['vision', 'image', 'detection', 'segmentation', 'object', 'recognition', 'classification'],
        'image-generation': ['diffusion', 'gan', 'text-to-image', 'image generation', 'stable', 'dalle', 'midjourney'],
        'speech-recognition': ['speech', 'audio', 'voice', 'whisper', 'transcription', 'asr'],
        'multimodal': ['multimodal', 'multi-modal', 'vision-language', 'text-and-vision', 'clip'],
        'text-embedding': ['embedding', 'encoder', 'bert', 'sentence', 'vector', 'semantic']
      };
      
      const keywords = categoryMap[category] || [];
      result = result.filter(model => {
        const modelText = [
          model.name.toLowerCase(),
          model.description.toLowerCase(),
          ...(model.tags || []).map(tag => tag.toLowerCase())
        ].join(' ');
        
        return keywords.some(keyword => modelText.includes(keyword.toLowerCase()));
      });
    }
    
    // Apply source filter
    if (filterBy) {
      switch(filterBy) {
        case 'open-source':
          result = result.filter(model => {
            // Check if model name or source indicates it's open source
            const modelInfo = `${model.name} ${model.source} ${model.description}`.toLowerCase();
            return !(
              modelInfo.includes('gpt') || 
              modelInfo.includes('openai') || 
              modelInfo.includes('anthropic') || 
              modelInfo.includes('claude')
            );
          });
          break;
          
        case 'openai':
        case 'meta':
        case 'google':
        case 'microsoft':
          result = result.filter(model => {
            const searchTerm = filterBy.toLowerCase();
            return (
              (model.source && model.source.toLowerCase().includes(searchTerm)) ||
              (model.name && model.name.toLowerCase().includes(searchTerm))
            );
          });
          break;
          
        case 'commercial':
          result = result.filter(model => {
            const commercialProviders = ['openai', 'anthropic', 'cohere', 'ai21', 'microsoft'];
            return commercialProviders.some(provider => 
              (model.source && model.source.toLowerCase().includes(provider)) ||
              (model.name && model.name.toLowerCase().includes(provider))
            );
          });
          break;
          
        case 'research':
          result = result.filter(model => {
            const researchTerms = ['research', 'university', 'lab', 'institute', 'academic'];
            return (
              (model.description && researchTerms.some(term => model.description.toLowerCase().includes(term))) ||
              (model.tags && model.tags.some(tag => researchTerms.some(term => tag.toLowerCase().includes(term)))) ||
              (model.source && researchTerms.some(term => model.source.toLowerCase().includes(term)))
            );
          });
          break;
      }
    }
    
    // Apply sorting
    if (sortBy) {
      switch(sortBy) {
        case 'popular':
          result = result.sort((a, b) => {
            const aPopularity = a.downloads || a.likes || 0;
            const bPopularity = b.downloads || b.likes || 0;
            return bPopularity - aPopularity;
          });
          break;
          
        case 'recent':
          // For Hugging Face models, we don't have reliable date information
          // We'll use the API's default ordering which tends to have newer models first
          break;
          
        case 'downloads':
          result = result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
          break;
          
        case 'rating':
          result = result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
          break;
      }
    }
    
    setFilteredModels(result);
  }, [category, sortBy, filterBy, models]);
  
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
  };

  // Function to get model image with better fallbacks - completely rewritten to be more robust
  const getModelImage = async (model, cardData) => {
    // First check for thumbnail in card data
    if (cardData?.cardData?.thumbnail) {
      // Verify the thumbnail is accessible and not broken
      try {
        const response = await fetch(cardData.cardData.thumbnail, { method: 'HEAD' });
        if (response.ok) {
          return cardData.cardData.thumbnail;
        }
      } catch (error) {
        console.warn(`Thumbnail check failed for ${model.modelId}:`, error);
      }
    }
    
    // Check for direct image files in the repository
    let bestImageUrl = null;
    if (cardData?.siblings && cardData.siblings.length > 0) {
      // Filter for image files
      const imageFiles = cardData.siblings.filter(file => 
        file.rfilename.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      );
      
      if (imageFiles.length > 0) {
        // Sort to find the best images
        const sortedImages = imageFiles.sort((a, b) => {
          // Prioritize standard naming patterns
          const patterns = ['thumbnail', 'banner', 'header', 'preview', 'model', 'example'];
          
          const aName = a.rfilename.toLowerCase();
          const bName = b.rfilename.toLowerCase();
          
          // Check for thumbnail patterns
          const aScore = patterns.findIndex(pattern => aName.includes(pattern));
          const bScore = patterns.findIndex(pattern => bName.includes(pattern));
          
          // If both have patterns, compare their positions in the patterns array
          if (aScore !== -1 && bScore !== -1) {
            return aScore - bScore;
          }
          
          // If only one has a pattern, prioritize it
          if (aScore !== -1) return -1;
          if (bScore !== -1) return 1;
          
          // Prefer root files
          const aIsRoot = !aName.includes('/');
          const bIsRoot = !bName.includes('/');
          if (aIsRoot && !bIsRoot) return -1;
          if (!aIsRoot && bIsRoot) return 1;
          
          // Prefer larger files as they might be better quality
          return (b.size || 0) - (a.size || 0);
        });
        
        // Get the most suitable image and verify it exists
        bestImageUrl = `https://huggingface.co/${model.modelId}/resolve/main/${sortedImages[0].rfilename}`;
        
        // Verify the image is accessible
        try {
          const response = await fetch(bestImageUrl, { method: 'HEAD' });
          if (!response.ok) bestImageUrl = null;
        } catch (error) {
          console.warn(`Image file check failed for ${model.modelId}:`, error);
          bestImageUrl = null;
        }
      }
    }
    
    // If we found a valid image file, use it
    if (bestImageUrl) return bestImageUrl;
    
    // Look for README images as another option
    if (cardData?.cardData?.text) {
      const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
      const htmlImageRegex = /<img.*?src=["'](.*?)["']/g;
      
      let mdMatches = [...(cardData.cardData.text.matchAll(markdownImageRegex) || [])];
      let htmlMatches = [...(cardData.cardData.text.matchAll(htmlImageRegex) || [])];
      let matches = [...mdMatches, ...htmlMatches];
      
      if (matches.length > 0) {
        // Get the first image URL found
        const imageUrl = matches[0][1];
        
        // If it's a relative URL, make it absolute
        if (imageUrl && (imageUrl.startsWith('./') || !imageUrl.startsWith('http'))) {
          const relativePath = imageUrl.startsWith('./') ? imageUrl.substring(2) : imageUrl;
          const fullUrl = `https://huggingface.co/${model.modelId}/resolve/main/${relativePath}`;
          
          // Verify the image is accessible
          try {
            const response = await fetch(fullUrl, { method: 'HEAD' });
            if (response.ok) return fullUrl;
          } catch (error) {
            console.warn(`README image check failed for ${model.modelId}:`, error);
          }
        } else if (imageUrl && imageUrl.startsWith('http')) {
          // Use the absolute URL directly but verify it
          try {
            const response = await fetch(imageUrl, { method: 'HEAD' });
            if (response.ok) return imageUrl;
          } catch (error) {
            console.warn(`External image check failed for ${model.modelId}:`, error);
          }
        }
      }
    }
    
    // Try to use a themed fallback based on the model's pipeline tag
    const pipeline = cardData?.pipeline_tag || '';
    if (pipeline && fallbackImages[pipeline]) {
      return fallbackImages[pipeline];
    }
    
    // Try organization avatar if available
    if (model.modelId.includes('/')) {
      const orgName = model.modelId.split('/')[0];
      try {
        const avatarUrl = `https://huggingface.co/avatars/${orgName}`;
        const response = await fetch(avatarUrl, { method: 'HEAD' });
        if (response.ok) {
          return avatarUrl;
        }
      } catch (error) {
        console.warn(`Avatar check failed for ${orgName}:`, error);
      }
    }
    
    // Try to determine model type from tags or model ID
    const modelText = `${model.modelId} ${model.tags?.join(' ') || ''}`.toLowerCase();
    
    for (const [type, image] of Object.entries(fallbackImages)) {
      if (type !== 'default' && modelText.includes(type.toLowerCase().replace('-', ''))) {
        return image;
      }
    }
    
    // Final fallback
    return fallbackImages.default;
  };

  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: '#18445c',
              mb: 0
            }}
          >
            Discover Hugging Face Models
          </Typography>
          
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
        
        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          Explore the most popular AI models available on Hugging Face
        </Typography>
        
        {/* Filters Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="category-label">Categories</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={category}
                onChange={handleCategoryChange}
                label="Categories"
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="llm">Large Language Models</MenuItem>
                <MenuItem value="computer-vision">Computer Vision</MenuItem>
                <MenuItem value="image-generation">Image Generation</MenuItem>
                <MenuItem value="speech-recognition">Speech Recognition</MenuItem>
                <MenuItem value="multimodal">MultiModal</MenuItem>
                <MenuItem value="text-embedding">Text Embedding</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value=""><em>Default</em></MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="recent">Most Recent</MenuItem>
                <MenuItem value="downloads">Most Downloads</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="filter-label">Filter By</InputLabel>
              <Select
                labelId="filter-label"
                id="filter-select"
                value={filterBy}
                onChange={handleFilterChange}
                label="Filter By"
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="open-source">Open Source</MenuItem>
                <MenuItem value="openai">OpenAI</MenuItem>
                <MenuItem value="meta">Meta</MenuItem>
                <MenuItem value="google">Google</MenuItem>
                <MenuItem value="microsoft">Microsoft</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
                <MenuItem value="research">Research</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* Loading indicator */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Loading models... {loadingProgress}%
            </Typography>
            <Box sx={{ width: '50%', maxWidth: 300 }}>
              <LinearProgress variant="determinate" value={loadingProgress} />
            </Box>
          </Box>
        ) : loadingProgress < 100 && models.length > 0 ? (
          <Box sx={{ width: '100%', mb: 4 }}>
            <LinearProgress variant="determinate" value={loadingProgress} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              Loading model details... {loadingProgress}%
            </Typography>
          </Box>
        ) : null}
        
        {/* Error message */}
        {error && (
          <Alert 
            severity="warning" 
            sx={{ mb: 4 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRefresh}
              >
                Try Again
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        
        {/* Models Grid */}
        {models.length > 0 && (
          <>
            {filteredModels.length === 0 ? (
              <Alert severity="info" sx={{ mb: 4 }}>
                No models found matching your criteria. Try changing your filters.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {filteredModels.map((model) => (
                  <Grid item xs={12} sm={6} md={4} key={model.id}>
                    <ModelCard model={model} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
      
      <Footer />
      
      {/* Notification */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        message={notification}
      />
    </>
  );
};

export default DiscoverPage; 