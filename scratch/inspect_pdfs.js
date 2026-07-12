import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function inspectPDF(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const page = pdfDoc.getPages()[0];
  console.log(`\n--- INSPECTION OF: ${path.basename(filePath)} ---`);
  console.log(`Page Size: ${page.getWidth()} x ${page.getHeight()}`);
  
  // Let's check how many elements or annotations are present
  console.log(`Number of pages: ${pdfDoc.getPageCount()}`);
  const { Annots } = page.node.entries();
  if (Annots) {
    console.log(`Annotations present.`);
  } else {
    console.log(`No annotations.`);
  }
}

async function main() {
  const targetDir = 'd:/PROJECTS/control-oficios/public/plantillas';
  const files = [
    path.join(targetDir, 'plantilla-oficio-economico.pdf'),
    path.join(targetDir, 'plantilla-oficio-especifico.pdf'),
    path.join(targetDir, 'plantilla-oficio-invitacion.pdf'),
    path.join(targetDir, 'tipo-deporte/plantilla-oficio-deporte-fulbito-femenino.pdf')
  ];
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      await inspectPDF(file);
    } else {
      console.log(`File not found: ${file}`);
    }
  }
}

main().catch(console.error);
