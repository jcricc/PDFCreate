// server.js
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
        const response = await fetch('https://api.openai.com/v4/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'text-davinci-002',
                prompt: req.body.input,
                max_tokens: 60,
                temperature: 0.5,
            }),
        });

        if (!response.ok) {
            throw new Error(`API call error! status: ${response.status}`);
        }
        const data = await response.json();
        res.json({ content: data.choices[0].text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
