import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function main() {
  const targetDir = 'd:/PROJECTS/control-oficios/public/plantillas/tipo-deporte';
  const file = path.join(targetDir, 'plantilla-oficio-deporte-fulbito-femenino.pdf');
  
  if (!fs.existsSync(file)) {
    console.log("File not found");
    return;
  }
  
  const fileBuffer = fs.readFileSync(file);
  const pdfDoc = await PDFDocument.load(fileBuffer);
  console.log(`Number of pages: ${pdfDoc.getPageCount()}`);
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPages()[i];
    console.log(`Page ${i + 1} size: ${page.getWidth()} x ${page.getHeight()}`);
  }
}

main().catch(console.error);
