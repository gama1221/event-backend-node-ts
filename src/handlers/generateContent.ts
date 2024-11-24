import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';

import fetch from 'node-fetch'; // Import node-fetch to download the image
import fs from 'fs';           // File system module to save the image
import path from 'path';   

const apiKey = process.env.API_KEY || 'defaultApiKey'; // Type is string | undefined
// const apiKeyOAI = process.env.API_KEY_OAI || 'defaultApiKey'; // Type is string | undefined

const openai = new OpenAI({
  apiKey:  process.env.API_KEY_OAI || 'defaultApiKey'
});

// Ensure the /images directory exists
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir); // Create the /images directory if it doesn't exist
}

const genAI = new GoogleGenerativeAI(apiKey);

export const generateContent = async (req: Request, res: Response) => {
  const { prompt, topK } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).send('Invalid input: "prompt" must be a non-empty string.');
  }

  const finalTopK = topK && typeof topK === 'number' ? topK : 5; 
  try {
    const model = genAI.getGenerativeModel({
      model: process.env.TEXT_GENERATIVE_MODEL || 'gemini-1.5-flash',
    });

    const result = await model.generateContent(prompt);

    const generatedText = result.response.text();
    res.json({ generatedText });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).send('Error generating content from the AI model');
  }
};

export async function generateImage() {
  try {
    const response = await openai.images.generate({
      prompt: 'A futuristic city skyline at sunset',
      n: 1, // Number of images to generate
      size: '1024x1024', // Image size
    });
    // Extract the image URL from the API response
    const imageUrl = response.data[0]?.url;

    // Check if imageUrl is defined and a valid string before proceeding
    if (!imageUrl) {
      throw new Error('Image URL is not available');
    }

    console.log('Generated Image URL:', imageUrl);

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl);

    // Check if the image fetch was successful
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }

    // Get the image buffer
    const buffer = await imageResponse.buffer();

    // Define the path to save the image
    const imagePath = path.join(imagesDir, 'generated-image.png');

    // Save the image to the /images directory
    fs.writeFileSync(imagePath, buffer);
    console.log(`Image saved to ${imagePath}`);
    } catch (error) {
    console.error('Error generating or saving image:', error);
  }
}

generateImage();