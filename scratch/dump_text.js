import { PDFDocument, PDFName, PDFContentStream } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

function decodeContentStream(page) {
  const contentStreams = page.getContentStreams();
  let text = '';
  
  for (const stream of contentStreams) {
    const rawBytes = stream.getContents();
    const rawText = new TextDecoder('utf-8').decode(rawBytes);
    
    // Look for text operators like Tj, TJ, or text in parentheses
    const matches = rawText.match(/\(([^)]+)\)\s*(Tj|TJ)/g) || [];
    for (const match of matches) {
      const cleanText = match.replace(/^\(|\)\s*(Tj|TJ)$/g, '');
      text += cleanText + ' ';
    }
  }
  return text.trim();
}

async function main() {
  const targetDir = 'd:/PROJECTS/control-oficios/public/plantillas';
  const files = [
    path.join(targetDir, 'plantilla-oficio-economico.pdf'),
    path.join(targetDir, 'plantilla-oficio-especifico.pdf'),
    path.join(targetDir, 'plantilla-oficio-invitacion.pdf')
  ];
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const fileBuffer = fs.readFileSync(file);
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const page = pdfDoc.getPages()[0];
      const extractedText = decodeContentStream(page);
      console.log(`\n--- EXTRACTED TEXT FROM: ${path.basename(file)} ---`);
      console.log(extractedText || '(No text layers or binary streams found)');
    }
  }
}

main().catch(console.error);
