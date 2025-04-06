// This file contains the model data for various AI models displayed in the application
export const models = [
  {
    id: 1,
    name: 'GPT-4 Turbo',
    description: 'The most advanced language model from OpenAI with improved capabilities for understanding and generating text, code, and creative content with higher reliability and accuracy.',
    longDescription: `
      GPT-4 Turbo represents a significant advancement in large language model technology. It builds on the foundation of GPT-4 with additional training and architectural improvements.
      
      Key features include:
      
      - Enhanced contextual understanding with 128k token context window
      - Improved coding capabilities across multiple programming languages
      - More accurate and nuanced responses to complex queries
      - Better instruction following and reduced hallucinations
      - Knowledge cutoff extended to April 2023
      - Optimized performance with lower latency than previous versions
      
      The model excels at tasks like content creation, summarization, code generation, creative writing, and knowledge-based Q&A.
    `,
    type: 'Large Language Model',
    tags: ['NLP', 'Text Generation', 'Code Generation', 'Transformers', 'LLM'],
    author: 'OpenAI',
    downloadCount: 245800,
    likes: 5627,
    lastUpdated: '2023-11-06',
    license: 'Commercial (API access)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
    huggingFaceUrl: 'https://huggingface.co/openai-community/gpt4',
    githubUrl: 'https://github.com/openai/gpt-4',
    paperUrl: 'https://arxiv.org/abs/2303.08774',
    performance: {
      accuracy: 92.4,
      speed: 'Fast',
      memoryUsage: 'High',
      metrics: [
        { name: 'MMLU', value: '86.4%' },
        { name: 'HumanEval', value: '67.0%' },
        { name: 'GSM8K', value: '92.0%' },
      ],
    },
    usage: `
      # Setup
      \`\`\`python
      import openai
      from openai import OpenAI
      
      # Initialize the client
      client = OpenAI(
          api_key="your_api_key_here",
      )
      
      # Basic usage
      response = client.chat.completions.create(
          model="gpt-4-turbo",
          messages=[
              {"role": "system", "content": "You are a helpful assistant."},
              {"role": "user", "content": "Explain quantum computing in simple terms"}
          ],
          max_tokens=500
      )
      
      print(response.choices[0].message.content)
      \`\`\`
    `,
  },
  {
    id: 2,
    name: 'Claude 3 Opus',
    description: 'Anthropic\'s most advanced AI assistant with superior reasoning and instruction following abilities, designed to be helpful, harmless, and honest.',
    longDescription: `
      Claude 3 Opus is Anthropic's most capable and intelligent AI assistant, designed with breakthrough reasoning and instruction-following capabilities.
      
      Key strengths include:
      
      - State-of-the-art reasoning and problem-solving abilities
      - Exceptional performance on complex academic and professional tasks
      - Superior context understanding and retention
      - More nuanced, thoughtful responses to complex queries
      - Better at following nuanced instructions with precision
      - Reduced tendency to fabricate information
      
      Claude 3 Opus excels at content generation, coding assistance, data analysis, and sophisticated reasoning tasks.
    `,
    type: 'Large Language Model',
    tags: ['NLP', 'Text Generation', 'Reasoning', 'Transformers', 'LLM'],
    author: 'Anthropic',
    downloadCount: 192650,
    likes: 4836,
    lastUpdated: '2024-03-04',
    license: 'Commercial (API access)',
    imageUrl: 'https://images.ctfassets.net/jicauaj2bk5g/11hrK3sYgSOTHyufj0hLv/3b36ca6ad23e5c14aac1d0da96b11ec9/CL-Favicon.png',
    huggingFaceUrl: null,
    githubUrl: null,
    paperUrl: 'https://www-cdn.anthropic.com/de8ba9b01c9ab7cbabf5c33b80b7bbc618857627/Model_Card_Claude_3.pdf',
    performance: {
      accuracy: 94.5,
      speed: 'Medium',
      memoryUsage: 'High',
      metrics: [
        { name: 'MMLU', value: '89.2%' },
        { name: 'GSM8K', value: '94.3%' },
        { name: 'MATH', value: '53.2%' },
      ],
    },
    usage: `
      # Setup
      \`\`\`python
      import anthropic
      
      client = anthropic.Anthropic(
          api_key="your_api_key_here",
      )
      
      # Basic usage
      message = client.messages.create(
          model="claude-3-opus-20240229",
          max_tokens=1000,
          system="You are a helpful AI assistant that specializes in explaining complex topics.",
          messages=[
              {"role": "user", "content": "Explain the concept of quantum entanglement to a high school student"}
          ]
      )
      
      print(message.content)
      \`\`\`
    `,
  },
  {
    id: 3,
    name: 'Stable Diffusion XL',
    description: 'A state-of-the-art text-to-image generation model capable of creating highly detailed and realistic images from text descriptions.',
    longDescription: `
      Stable Diffusion XL (SDXL) is an advanced text-to-image generation model that significantly improves upon previous Stable Diffusion versions.
      
      Key features include:
      
      - Higher resolution outputs with finer details
      - Improved composition and coherence in complex scenes
      - Better understanding of text prompts and artistic styles
      - More realistic human figures and faces
      - Enhanced ability to follow complex prompts with multiple elements
      - Broader stylistic range from photorealistic to artistic
      
      SDXL combines a larger UNet backbone with a sophisticated dual text encoder system that utilizes both OpenCLIP and CLIP ViT-L for superior text understanding.
    `,
    type: 'Text-to-Image',
    tags: ['Image Generation', 'Diffusion Models', 'AI Art', 'Generative AI'],
    author: 'Stability AI',
    downloadCount: 183500,
    likes: 4253,
    lastUpdated: '2023-07-26',
    license: 'Open RAIL++-M License',
    imageUrl: 'https://production-media.paperswithcode.com/methods/406f6f32-36a4-4804-b350-16fcfab860f7.png',
    huggingFaceUrl: 'https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0',
    githubUrl: 'https://github.com/Stability-AI/generative-models',
    paperUrl: 'https://arxiv.org/abs/2307.01952',
    performance: {
      accuracy: null,
      speed: 'Medium',
      memoryUsage: 'High',
      metrics: [
        { name: 'FID', value: '7.21' },
        { name: 'CLIP Score', value: '34.9' },
        { name: 'Human Preference', value: '73.6%' },
      ],
    },
    usage: `
      # Setup
      \`\`\`python
      import torch
      from diffusers import StableDiffusionXLPipeline

      # Load the pipeline
      model_id = "stabilityai/stable-diffusion-xl-base-1.0"
      pipe = StableDiffusionXLPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
      pipe = pipe.to("cuda")
      
      # Generate image
      prompt = "A stunning landscape with mountains, a lake, and a colorful sunset sky"
      negative_prompt = "low quality, blurry, distorted"
      
      image = pipe(
          prompt=prompt,
          negative_prompt=negative_prompt,
          width=1024,
          height=768,
          num_inference_steps=30,
          guidance_scale=7.5
      ).images[0]
      
      # Save image
      image.save("generated_landscape.png")
      \`\`\`
    `,
  },
  {
    id: 4,
    name: 'Whisper Large v3',
    description: 'OpenAI\'s most accurate speech recognition model supporting multiple languages, transcription, and translation capabilities.',
    longDescription: `
      Whisper Large v3 is the latest and most advanced model in OpenAI's Whisper family of speech recognition systems.
      
      Key capabilities include:
      
      - Highly accurate speech recognition across multiple languages
      - Support for 100+ languages for both transcription and translation
      - Improved robustness to accents, technical language, and background noise
      - Effective timestamp prediction for aligning text with audio
      - Strong performance even in challenging acoustic environments
      - Support for various audio formats and recordings of different quality
      
      The model uses a encoder-decoder Transformer architecture trained on a massive and diverse multilingual dataset, making it capable of handling various accents, acoustic environments, and technical terminology.
    `,
    type: 'Speech Recognition',
    tags: ['ASR', 'Audio Processing', 'Transcription', 'Translation', 'Multilingual'],
    author: 'OpenAI',
    downloadCount: 137900,
    likes: 3182,
    lastUpdated: '2023-09-18',
    license: 'Apache 2.0',
    imageUrl: 'https://whisper.ggerganov.com/assets/whisper-anim.gif',
    huggingFaceUrl: 'https://huggingface.co/openai/whisper-large-v3',
    githubUrl: 'https://github.com/openai/whisper',
    paperUrl: 'https://arxiv.org/abs/2212.04356',
    performance: {
      accuracy: 89.2,
      speed: 'Fast',
      memoryUsage: 'Medium',
      metrics: [
        { name: 'WER (English)', value: '4.2%' },
        { name: 'WER (Multilingual)', value: '9.8%' },
        { name: 'Translation BLEU', value: '32.4' },
      ],
    },
    usage: `
      # Setup
      \`\`\`python
      import torch
      from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
      
      # Load the model
      device = "cuda" if torch.cuda.is_available() else "cpu"
      torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
      
      model_id = "openai/whisper-large-v3"
      model = AutoModelForSpeechSeq2Seq.from_pretrained(
          model_id, torch_dtype=torch_dtype, device_map="auto"
      )
      processor = AutoProcessor.from_pretrained(model_id)
      
      # Create a pipeline
      pipe = pipeline(
          "automatic-speech-recognition",
          model=model,
          tokenizer=processor.tokenizer,
          feature_extractor=processor.feature_extractor,
          max_new_tokens=128,
          chunk_length_s=30,
          batch_size=16,
          device=device,
      )
      
      # Transcribe audio
      result = pipe("path/to/audio/file.mp3", generate_kwargs={"language": "english"})
      print(result["text"])
      \`\`\`
    `,
  }
];

// Function to get model by ID
export const getModelById = (id) => {
  const modelId = parseInt(id);
  return models.find(model => model.id === modelId) || null;
};

// Function to get trending models (for homepage)
export const getTrendingModels = () => {
  // In a real app, you might sort by popularity metrics
  return models.slice(0, 3);
};

// Function to get the recommended model
export const getRecommendedModel = () => {
  // For now just return Claude 3 as the recommended model
  return models.find(model => model.id === 2) || models[0];
};

export default models; 