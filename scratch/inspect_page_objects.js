import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function main() {
  const targetDir = 'd:/PROJECTS/control-oficios/public/plantillas';
  const file = path.join(targetDir, 'plantilla-oficio-economico.pdf');
  
  if (!fs.existsSync(file)) {
    console.log("File not found");
    return;
  }
  
  const fileBuffer = fs.readFileSync(file);
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const page = pdfDoc.getPages()[0];
  
  console.log("Page objects:");
  console.log("Keys on page node:", Object.keys(page.node.entries()));
  
  // Let's check resources
  const resources = page.node.Resources();
  console.log("Resources keys:", Object.keys(resources.entries()));
  
  const xObjects = resources.lookup(PDFName.of('XObject'));
  if (xObjects) {
    console.log("XObjects present!");
    console.log("XObjects keys:", Object.keys(xObjects.entries()));
  } else {
    console.log("No XObjects.");
  }
}

import { PDFName } from 'pdf-lib';
main().catch(console.error);
