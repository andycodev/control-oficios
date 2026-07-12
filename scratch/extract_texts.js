import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Note: pdf-lib doesn't have a high-level text extraction API, but we can inspect the raw objects.
async function inspectTextObjects(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const page = pdfDoc.getPages()[0];
  console.log(`\n--- TEXT OBJECTS IN: ${path.basename(filePath)} ---`);
  
  // Let's look for fonts in the page resources
  try {
    const resources = page.node.Resources();
    if (resources) {
      const fonts = resources.lookup(PDFName.of('Font'));
      if (fonts) {
        console.log(`Fonts are present in resources!`);
      } else {
        console.log(`No fonts found in page resources.`);
      }
    }
  } catch (e) {
    console.log(`Could not check fonts: ${e.message}`);
  }
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
      await inspectTextObjects(file);
    }
  }
}

// Simple PDFName implementation since we need standard PDFName
import { PDFName } from 'pdf-lib';

main().catch(console.error);
