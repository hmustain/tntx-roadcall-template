// server.js
require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the project root
app.use(express.static(path.join(__dirname, '..')));

// Example API endpoint (e.g., for AI rewriting)
app.post('/rewrite', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text provided." });
  }

  try {
    // Here you would add your call to an AI API (like OpenAI)
    // For now, we'll simulate a rewritten text by appending " (rewritten)" to the original text.
    const rewrittenText = text + " (rewritten)";
    res.json({ rewrittenText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to rewrite text." });
  }
});

// Fallback to serve index.html for any unknown route (good for single-page apps)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
