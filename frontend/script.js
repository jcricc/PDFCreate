// script.js
import { generatePDF } from './pdfgeneration.js';

document.getElementById('generatePDFBtn').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;
    if (!userInput.trim()) {
        alert("Please enter some text to generate PDF.");
        return;
    }
    const aiContent = await fetchAIContentFromServer(userInput);
    if (aiContent) {
        displayAIContentPreview(aiContent);
        generatePDF(aiContent);
    }
});

async function fetchAIContentFromServer(userInput) {
    try {
        const response = await fetch('http://localhost:5500/generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: userInput }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Error:', error);
        alert("Failed to fetch AI content. See console for details.");
    }
}

function displayAIContentPreview(content) {
    const previewElement = document.getElementById('aiContentPreview');
    previewElement.innerText = content;
}
