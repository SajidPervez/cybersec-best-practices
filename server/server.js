import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Read system prompt from file
const getSystemPrompt = async () => {
  const promptPath = path.join(__dirname, 'system-prompt.md');
  return await fs.readFile(promptPath, 'utf-8');
};

app.post('/api/explain', async (req, res) => {
  try {
    const { practice, domain } = req.body;
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    const systemPrompt = await getSystemPrompt();
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}

For the following cybersecurity best practice from the domain of ${domain}:

"${practice}"

Please provide:

1. Explanation:
[Explain the concept and its importance]

2. Example:
[Provide a practical, real-world example]

Note: Use clear headings and avoid any special formatting characters.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch explanation');
    }

    const data = await response.json();
    const explanation = data.candidates[0].content.parts[0].text
      .replace(/\*\*/g, '')  // Remove all ** markers
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .trim();
    
    res.json({ explanation });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to get explanation',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
