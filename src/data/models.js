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
  },
  {
    id: 5,
    name: 'Gemini Pro',
    description: 'Google\'s advanced multimodal model capable of understanding text, images, audio, and code. Gemini excels at complex reasoning tasks and provides accurate responses across a wide range of domains.',
    longDescription: `
      Gemini Pro is Google's advanced multimodal AI model, designed to understand and process various types of information including text, images, audio, and code.
      
      Key features include:
      
      - Strong reasoning capabilities across diverse domains
      - Deep understanding of code in multiple programming languages
      - Ability to process and understand images alongside text
      - Multilingual support with strong performance across languages
      - Balanced instruction-following with reduced hallucinations
      - Optimized for real-world application deployment
      
      Gemini Pro serves as a versatile foundation model for a wide range of applications from content creation to complex problem-solving.
    `,
    type: 'Large Language Model',
    tags: ['Multimodal', 'Text Generation', 'Code Generation', 'Reasoning', 'LLM'],
    author: 'Google',
    downloadCount: 175430,
    likes: 4125,
    lastUpdated: '2023-12-13',
    license: 'Commercial (API access)',
    imageUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Header_2.width-1300.format-webp.webp',
    huggingFaceUrl: null,
    githubUrl: null,
    paperUrl: 'https://storage.googleapis.com/deepmind-media/gemini/gemini_1_report.pdf',
    performance: {
      accuracy: 90.8,
      speed: 'Fast',
      memoryUsage: 'Medium',
      metrics: [
        { name: 'MMLU', value: '83.7%' },
        { name: 'HumanEval', value: '67.9%' },
        { name: 'GSM8K', value: '86.5%' },
      ],
    },
    usage: `
      # Setup
      \`\`\`python
      from google.generativeai import configure, GenerativeModel
      
      # Configure the API key
      configure(api_key="YOUR_API_KEY")
      
      # Initialize the model
      model = GenerativeModel('gemini-pro')
      
      # Generate a response
      response = model.generate_content("Explain the principles of quantum computing")
      
      print(response.text)
      \`\`\`
    `,
  },
  {
    id: 6,
    name: 'DALL-E 3',
    description: 'OpenAI\'s latest text-to-image generation model with remarkable ability to create highly detailed and accurate images from complex text descriptions.',
    longDescription: `
      DALL-E 3 represents a significant advancement in text-to-image generation technology from OpenAI, pushing the boundaries of what's possible in AI image creation.
      
      Key features include:
      
      - Extraordinary precision in rendering details described in prompts
      - Enhanced understanding of spatial relationships and compositions
      - Improved handling of text within images
      - Better interpretation of abstract and creative concepts
      - More consistent adherence to user intentions
      - Refined aesthetic quality across different artistic styles
      
      The model excels at transforming detailed textual descriptions into visually stunning and accurate images, with particular improvements in understanding complex scenes, human anatomy, and text rendering.
    `,
    type: 'Text-to-Image',
    tags: ['Image Generation', 'Computer Vision', 'Generative AI', 'AI Art'],
    author: 'OpenAI',
    downloadCount: 158920,
    likes: 3875,
    lastUpdated: '2023-10-19',
    license: 'Commercial (API access)',
    imageUrl: 'https://images.unsplash.com/photo-1682687220945-922198770e60',
    huggingFaceUrl: null,
    githubUrl: null,
    paperUrl: null,
    performance: {
      accuracy: null,
      speed: 'Medium',
      memoryUsage: 'High',
      metrics: [
        { name: 'Human Preference', value: '85.3%' },
        { name: 'Prompt Alignment', value: '92.1%' },
        { name: 'Detail Rendering', value: 'Excellent' },
      ],
    },
    usage: `
      # Setup
      \`\`\`python
      import openai
      from openai import OpenAI
      
      # Initialize client
      client = OpenAI(api_key="your_api_key")
      
      # Generate an image
      response = client.images.generate(
          model="dall-e-3",
          prompt="A futuristic cityscape with flying vehicles and towering glass structures, in the style of a vibrant digital painting",
          n=1,
          size="1024x1024",
          quality="standard"
      )
      
      # Get image URL
      image_url = response.data[0].url
      print(image_url)
      \`\`\`
    `,
  },
  {
    id: 7,
    name: 'Llama 3',
    description: 'Meta\'s powerful open-source large language model designed for both research and commercial applications, with improved reasoning capabilities.',
    longDescription: `
      Llama 3 is Meta's latest iteration of their open-source large language model family, designed to be accessible to researchers and developers while offering competitive performance.
      
      Key features include:
      
      - Open-source availability with multiple size variants
      - Improved reasoning and factual accuracy
      - Enhanced instruction following capabilities
      - Strong performance on benchmark tasks
      - Reduced hallucinations compared to previous versions
      - Optimized for running efficiently on various hardware setups
      
      The model comes in several parameter sizes (8B to 70B) allowing for deployment in different contexts, from resource-constrained environments to high-performance applications requiring advanced capabilities.
    `,
    type: 'Large Language Model',
    tags: ['Open Source', 'Text Generation', 'Transformers', 'LLM'],
    author: 'Meta AI',
    downloadCount: 142670,
    likes: 3690,
    lastUpdated: '2024-04-18',
    license: 'Llama 3 Community License',
    imageUrl: 'https://engineering.fb.com/wp-content/uploads/2023/07/Llama-2-Open-Source-App-Hero.jpg',
    huggingFaceUrl: 'https://huggingface.co/meta-llama',
    githubUrl: 'https://github.com/meta-llama/llama',
    paperUrl: 'https://ai.meta.com/research/publications/llama-3-herdmodels/',
    performance: {
      accuracy: 88.7,
      speed: 'Medium',
      memoryUsage: 'Variable (size dependent)',
      metrics: [
        { name: 'MMLU (70B)', value: '79.5%' },
        { name: 'HumanEval (70B)', value: '72.3%' },
        { name: 'GSM8K (70B)', value: '83.7%' },
      ],
    },
    usage: `
      # Setup
      \`\`\`python
      # Using Hugging Face Transformers
      from transformers import AutoTokenizer, AutoModelForCausalLM
      
      # Load model and tokenizer
      model_id = "meta-llama/Llama-3-70b-hf"
      tokenizer = AutoTokenizer.from_pretrained(model_id)
      model = AutoModelForCausalLM.from_pretrained(
          model_id,
          device_map="auto",
          torch_dtype="auto",
      )
      
      # Generate text
      prompt = "Explain the importance of renewable energy sources in addressing climate change."
      inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
      
      outputs = model.generate(
          **inputs,
          max_new_tokens=512,
          temperature=0.7,
          top_p=0.9,
      )
      
      response = tokenizer.decode(outputs[0], skip_special_tokens=True)
      print(response)
      \`\`\`
    `,
  },
  {
    id: 8,
    name: 'Midjourney v6',
    description: 'A leading text-to-image generation model known for its artistic style and exceptional quality, capable of producing highly detailed and aesthetically pleasing imagery.',
    longDescription: `
      Midjourney v6 represents the latest evolution of the popular text-to-image generation system known for its distinctive aesthetic quality and artistic outputs.
      
      Key features include:
      
      - Significant improvements in photorealism and detail rendering
      - Enhanced understanding of complex prompts and user intent
      - Superior handling of human anatomy and faces
      - Better coherence in multi-element compositions
      - More precise control over artistic styles and techniques
      - Improved text rendering within generated images
      
      Midjourney v6 is particularly noted for its balance between photorealistic capability and artistic expression, allowing users to generate both highly realistic images and stylized creative works with equal facility.
    `,
    type: 'Text-to-Image',
    tags: ['Image Generation', 'AI Art', 'Generative AI', 'Discord Bot'],
    author: 'Midjourney',
    downloadCount: 167340,
    likes: 4532,
    lastUpdated: '2023-12-21',
    license: 'Commercial (Subscription)',
    imageUrl: 'https://cdn.midjourney.com/e4425caf-3f8e-4340-9098-32f5cdd9aa81/0_0.png',
    huggingFaceUrl: null,
    githubUrl: null,
    paperUrl: null,
    performance: {
      accuracy: null,
      speed: 'Fast',
      memoryUsage: 'High',
      metrics: [
        { name: 'Aesthetic Quality', value: '9.2/10' },
        { name: 'Prompt Adherence', value: '8.9/10' },
        { name: 'Detail Precision', value: 'Very High' },
      ],
    },
    usage: `
      # Usage (via Discord)
      \`\`\`
      # Midjourney is primarily accessed through Discord
      # Basic prompt
      /imagine prompt: A serene mountain landscape with a crystal clear lake, highly detailed cinematic lighting
      
      # With parameters
      /imagine prompt: A futuristic cyberpunk city with neon lights and flying cars --ar 16:9 --v 6 --style raw
      
      # Style reference
      /imagine prompt: A portrait of a woman in the style of Rembrandt --s 750
      \`\`\`
      
      # Parameters:
      # --ar: Aspect ratio (16:9, 1:1, etc.)
      # --v: Version (6 for latest)
      # --s: Stylize parameter (0-1000)
      # --style: Preset styles (raw, ornate, etc.)
      # --q: Quality parameter (determines rendering time)
      # --c: Chaos parameter (variation level)
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