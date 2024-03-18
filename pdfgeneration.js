// pdfgeneration.js
import jsPDF from 'jspdf';

function generatePDF(content) {
    const doc = new jsPDF();
    doc.text(content, 10, 10);
    doc.save('GeneratedDocument.pdf');
}

export { generatePDF };
