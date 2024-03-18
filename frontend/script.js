// Corrected import statement
const { generatePDF, uploadPDFToGoogleStorage, getPDFDownloadURL } = require('./pdfgeneration.js');

document.getElementById('generatePDFBtn').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;
    if (!userInput.trim()) {
        alert("Please enter some text to generate PDF.");
        return;
    }

    const htmlContent = await fetchAIContentFromServer(userInput);
    if (htmlContent) {
        displayAIContentPreview(htmlContent);
        const pdfBlob = await generatePDF(htmlContent);
        const storagePath = await uploadPDFToGoogleStorage(pdfBlob); // Updated function name
        const downloadUrl = await getPDFDownloadURL(storagePath);
        displayPDF(downloadUrl); // Use downloadUrl for displaying PDF
    }
});

// Fetch AI content from the server
async function fetchAIContentFromServer(userInput) {
    try {
        const response = await fetch('/generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const { pdfUrl } = await response.json();
        return pdfUrl;
    } catch (error) {
        console.error('Failed to fetch AI content:', error);
        alert('Failed to fetch AI content. Please try again.');
    }
}

// Display AI content preview
function displayAIContentPreview(content) {
    const previewElement = document.getElementById('aiContentPreview');
    previewElement.innerHTML = content;
}

// Display the PDF
function displayPDF(pdfUrl) {
    window.open(pdfUrl, '_blank');
}

