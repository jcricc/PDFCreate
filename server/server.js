const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PredictionServiceClient } = require('@google-cloud/aiplatform');
const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5500;
const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.VERTEX_AI_LOCATION;
const model = process.env.VERTEX_AI_MODEL;

app.use(cors());
app.use(bodyParser.json());

const predictionClient = new PredictionServiceClient();
const storageClient = new Storage();

app.post('/generateContent', async (req, res) => {
    try {
        if (!req.body.userInput) {
            return res.status(400).json({ error: 'Missing userInput field' });
        }

        const userInput = req.body.userInput;

        // Call Vertex AI to generate content based on user input
        // const generatedContent = await callVertexAIGenerateContent(userInput)

        // Mock generation of content
        const generatedContent = 'Generated PDF Content';

        // Upload generated PDF to Google Cloud Storage
        const pdfUrl = await uploadToStorage(generatedContent);

        // Return the PDF URL to the client
        res.json({ pdfUrl });

    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.use(express.static('frontend'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

async function uploadToStorage(content) {
    const bucketName = 'octink';
    const fileName = 'OctInker.pdf';

    const file = storageClient.bucket(bucketName).file(fileName);
    await file.save(content);

    // Generate signed URL for public access
    const signedUrl = await file.getSignedUrl({
        action: 'read',
        expires: '03-17-2023',
    });

    return signedUrl[0];
}