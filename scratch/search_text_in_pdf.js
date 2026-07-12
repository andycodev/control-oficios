import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function searchText(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const page = pdfDoc.getPages()[0];
  
  // pdf-lib page node contains content streams
  const contentStreams = page.getContentStreams();
  let rawText = '';
  for (const stream of contentStreams) {
    const rawBytes = stream.getContents();
    rawText += new TextDecoder('utf-8').decode(rawBytes) + '\n';
  }
  
  console.log(`\n===========================================`);
  console.log(`FILE: ${path.basename(filePath)}`);
  console.log(`===========================================`);
  
  // Let's print out lines containing parentheses (which are drawn text in PDF syntax)
  const lines = rawText.split('\n');
  const textLines = lines.filter(l => l.includes('(') && l.includes(')'));
  
  // Print first 20 matching lines to see what text is drawn
  console.log(`Found ${textLines.length} text draw lines. Printing sample:`);
  textLines.slice(0, 30).forEach(l => {
    // Extract text inside parentheses
    const matches = l.match(/\(([^)]+)\)/g);
    if (matches) {
      console.log("  " + matches.map(m => m.slice(1, -1)).join(' | '));
    }
  });
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
      await searchText(file);
    }
  }
}

main().catch(console.error);
