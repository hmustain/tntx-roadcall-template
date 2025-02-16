// server.js
const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const axios = require('axios');
const port = process.env.PORT || 3000;


// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the project root
app.use(express.static(path.join(__dirname, '..')));

// Example API endpoint for AI rewriting using GPT-3.5-turbo
app.post('/rewrite', async (req, res) => {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided." });
    }
  
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: "gpt-4o-mini",  // Updated model
              messages: [
                { "role": "system", "content": "You are a professional rewriting assistant." },
                { "role": "user", "content": `Rewrite the following breakdown description in a professional, concise tone:\n\n${text}\n\nRewritten:` }
              ],
              max_tokens: 100,
              temperature: 0.7
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
              }
            }
          );
          
  
      // Extract the rewritten text from the API response
      const rewrittenText = response.data.choices[0].message.content.trim();
      res.json({ rewrittenText });
    } catch (error) {
      console.error("Error calling OpenAI API:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to rewrite text." });
    }
  });
  

// Fallback to serve index.html for any unknown route (good for single-page apps)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  
