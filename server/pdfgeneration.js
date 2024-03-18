const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

// Function to generate a PDF and return it as a blob
const jsPDF = require('jspdf');

async function generatePDF(content) {
    const doc = new jsPDF();
    doc.text(content, 10, 10);
    return doc.output('blob');
}

// Function to upload the generated PDF blob to Google Cloud Storage
async function uploadPDFToGoogleStorage(blob) {
    const bucketName = '<octink>'; // Replace with your bucket name
    const fileName = `pdf-${Date.now()}.pdf`; // Unique file name for the PDF
    const bucket = storage.bucket(bucketName);

    const file = bucket.file(fileName);

    // Convert blob to a stream, since Google Cloud Storage expects a stream for uploads
    const blobStream = blob.stream();

    await new Promise((resolve, reject) => {
        const stream = file.createWriteStream({
            metadata: {
                contentType: 'application/pdf',
            },
        });

        stream.on('error', (err) => reject(err));
        stream.on('finish', () => resolve());
        blobStream.pipe(stream);
    });

    return fileName; // Returning fileName to be used for generating download URL
}

// Function to generate a public URL for the uploaded PDF in Google Cloud Storage
async function getPDFDownloadURL(fileName) {
    const bucketName = '<octink>'; // Replace with your bucket name
    const file = storage.bucket(bucketName).file(fileName);

    // Generate a signed URL for read access
    const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 30 * 60 * 1000, // URL expires in 30 minutes
    });

    return url;
}

module.exports = { generatePDF, uploadPDFToGoogleStorage, getPDFDownloadURL };
