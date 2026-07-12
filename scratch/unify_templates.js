import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function unifyTemplates() {
  const targetDir = 'd:/PROJECTS/control-oficios/public/plantillas';
  const masterPath = path.join(targetDir, 'plantilla-oficio-economico.pdf');
  
  if (!fs.existsSync(masterPath)) {
    console.error(`Master template not found at: ${masterPath}`);
    return;
  }
  
  console.log(`Loading master template from: ${masterPath}`);
  const masterBuffer = fs.readFileSync(masterPath);
  
  // Helper to create a unified letterhead template
  async function createUnifiedTemplate(destPath, originalPath = null) {
    const newDoc = await PDFDocument.create();
    
    // Load master page to copy layout
    const masterDoc = await PDFDocument.load(masterBuffer);
    const [copiedMasterPage] = await newDoc.copyPages(masterDoc, [0]);
    newDoc.addPage(copiedMasterPage);
    
    const page = newDoc.getPages()[0];
    
    // Draw a white rectangle to wipe out the pre-printed body text in the middle
    // Margins are roughly 40-50pt. Page width is 612, height is 792.
    // We cover from x: 30 to 582, and y: 175 to 680 to clear all text and labels
    page.drawRectangle({
      x: 35,
      y: 175,
      width: 542,
      height: 505,
      color: rgb(1, 1, 1), // White
    });
    
    // If there is an original document (like the sports files with a second page)
    if (originalPath && fs.existsSync(originalPath)) {
      console.log(`Copying additional pages from original: ${path.basename(originalPath)}`);
      const originalBuffer = fs.readFileSync(originalPath);
      const originalDoc = await PDFDocument.load(originalBuffer);
      const pageCount = originalDoc.getPageCount();
      
      if (pageCount > 1) {
        // Copy pages starting from index 1 (second page onwards)
        const pagesToCopy = Array.from({ length: pageCount - 1 }, (_, i) => i + 1);
        const copiedPages = await newDoc.copyPages(originalDoc, pagesToCopy);
        copiedPages.forEach(p => newDoc.addPage(p));
      }
    }
    
    const unifiedBytes = await newDoc.save();
    
    // Ensure destination directory exists
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(destPath, unifiedBytes);
    console.log(`Saved unified template to: ${destPath}`);
  }
  
  // Unify Specific template
  await createUnifiedTemplate(
    path.join(targetDir, 'plantilla-oficio-especifico.pdf')
  );
  
  // Unify Invitation template
  await createUnifiedTemplate(
    path.join(targetDir, 'plantilla-oficio-invitacion.pdf')
  );
  
  // Unify Sports templates
  const sportsTemplates = [
    'plantilla-oficio-deporte-fulbito-femenino.pdf',
    'plantilla-oficio-deporte-fulbito-master.pdf',
    'plantilla-oficio-deporte-futbol-libre.pdf',
    'plantilla-oficio-deporte-voley-mixto.pdf'
  ];
  
  for (const filename of sportsTemplates) {
    const originalSportsPath = path.join(targetDir, 'tipo-deporte', filename);
    const destSportsPath = path.join(targetDir, 'tipo-deporte', filename);
    
    // We pass the same path to read the original second page of rules before overwriting it
    await createUnifiedTemplate(destSportsPath, originalSportsPath);
  }
  
  console.log('\nAll templates unified successfully!');
}

unifyTemplates().catch(console.error);
