import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(bodyParser.json());

app.post('/generateContent', async (req, res) => {
    try {
        // Assuming the Gemini API has a different endpoint and API structure
        const geminiAPIEndpoint = 'https://api.gemini.com/generate';
        const apiKey = process.env['GeminiAPI']; // Make sure to set this in your .env file

        const response = await fetch(geminiAPIEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Adjusted for Gemini API, assuming it uses Bearer tokens
            },
            body: JSON.stringify({
                // Assuming the Gemini API expects a payload structure like this
                input: req.body.input,
                parameters: {
                    // Parameters for content generation, adjust these according to Gemini's API documentation
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`API call error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming the response structure, adjust according to Gemini's documentation
        res.json({ content: data.generatedContent });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});