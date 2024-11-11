import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure this is set in your .env file
});

async function generateImage(prompt: string) {
  try {
    console.log(`Generating image for prompt: ${prompt}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3", // or "dall-e-2" depending on your needs
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    });

    // Get the image URL from the response
    const imageUrl = response.data[0].url;
    
    if (!imageUrl) {
      throw new Error('No image URL received in the response');
    }

    console.log('Image generated successfully!');
    console.log('Image URL:', imageUrl);

    // Optionally save the image URL to a file
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(
      path.join(outputDir, 'image-url.txt'),
      imageUrl
    );

    return imageUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating image:', error.message);
      if ('response' in error) {
        console.error('API Response:', error.response);
      }
    }
    throw error;
  }
}

// Get the prompt from command line arguments
const prompt = process.argv.slice(2).join(' ');

if (!prompt) {
  console.error('Please provide a prompt');
  process.exit(1);
}

generateImage(prompt)
  .then(() => {
    console.log('Process completed successfully');
  })
  .catch((error) => {
    console.error('Process failed:', error);
    process.exit(1);
  });