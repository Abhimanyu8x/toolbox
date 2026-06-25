import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
};

export const splitPdf = async (file: File, pageRanges: string): Promise<Uint8Array[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();
  const results: Uint8Array[] = [];

  // Simple parser: "1, 2-4, 6"
  const ranges = pageRanges.split(',').map(r => r.trim());

  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    let indices: number[] = [];

    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= totalPages) indices.push(i - 1);
      }
    } else {
      const pageNum = Number(range);
      if (pageNum >= 1 && pageNum <= totalPages) indices.push(pageNum - 1);
    }

    if (indices.length > 0) {
      const copiedPages = await newPdf.copyPages(pdfDoc, indices);
      copiedPages.forEach(page => newPdf.addPage(page));
      results.push(await newPdf.save());
    }
  }

  return results;
};

export const imagesToPdf = async (files: File[]): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    let image;
    
    if (file.type === 'image/jpeg') {
      image = await pdfDoc.embedJpg(imageBytes);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      continue; // Skip unsupported
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return await pdfDoc.save();
};

export const compressPdfMock = async (file: File): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  return await pdfDoc.save({ useObjectStreams: false }); 
};

export const deletePagesFromPdf = async (file: File, pageIndicesToDelete: number[]): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();
  const newPdf = await PDFDocument.create();
  
  const pagesToKeep = [];
  for (let i = 0; i < totalPages; i++) {
    if (!pageIndicesToDelete.includes(i)) {
      pagesToKeep.push(i);
    }
  }

  if (pagesToKeep.length === 0) {
    throw new Error("Cannot delete all pages from the PDF.");
  }

  const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
  copiedPages.forEach(page => newPdf.addPage(page));

  return await newPdf.save();
};

export const rotatePdf = async (file: File, rotationDegrees: number): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  pages.forEach(page => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotationDegrees));
  });

  return await pdfDoc.save();
};

export const addWatermark = async (file: File, text: string, options: { opacity: number; size: number; color?: string; x?: number; y?: number }): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  pages.forEach(page => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, options.size);
    const textHeight = font.heightAtSize(options.size);

    // Default to center if x/y not provided
    // Note: pdf-lib uses bottom-left origin. 
    // If options.x/y are provided, we assume they are top-left coordinates (UI standard) and convert them.
    // Wait, let's assume options.x/y are percentages (0-1) or absolute points?
    // Let's assume absolute points from top-left for consistency with other tools if passed.
    
    let x, y;
    
    if (options.x !== undefined && options.y !== undefined) {
        x = options.x;
        y = height - options.y - textHeight; // Convert top-left Y to bottom-left Y
    } else {
        x = width / 2 - textWidth / 2;
        y = height / 2 - textHeight / 2;
    }

    page.drawText(text, {
      x: x,
      y: y,
      size: options.size,
      font: font,
      color: rgb(0.6, 0.6, 0.6), // Grey default
      opacity: options.opacity,
      rotate: (options.x !== undefined) ? degrees(0) : degrees(45), // No rotation if custom positioned, else 45 deg
    });
  });

  return await pdfDoc.save();
};

export const addPageNumbers = async (file: File, position: 'bottom-center' | 'bottom-right' | 'top-right'): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    const fontSize = 10;
    const text = `${idx + 1}`;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    
    let x = 0;
    let y = 20;

    if (position === 'bottom-center') {
      x = width / 2 - textWidth / 2;
    } else if (position === 'bottom-right') {
      x = width - textWidth - 20;
    } else if (position === 'top-right') {
      x = width - textWidth - 20;
      y = height - 30;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
  });

  return await pdfDoc.save();
};

export const cropPdf = async (file: File, crop: number | { x: number, y: number, width: number, height: number }): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  
  pages.forEach(page => {
    const { width, height } = page.getSize();
    
    if (typeof crop === 'number') {
        // Margin mode
        const margin = crop;
        if (width > margin * 2 && height > margin * 2) {
            page.setCropBox(margin, margin, width - margin * 2, height - margin * 2);
        }
    } else {
        // Custom box mode
        // Ensure crop box is within bounds
        const x = Math.max(0, crop.x);
        const y = Math.max(0, crop.y);
        const w = Math.min(width - x, crop.width);
        const h = Math.min(height - y, crop.height);
        
        if (w > 0 && h > 0) {
            page.setCropBox(x, y, w, h);
        }
    }
  });

  return await pdfDoc.save();
};

export interface PdfModification {
  type: 'text';
  content: string;
  x: number;
  y: number; // Top-left coordinate system for UI
  size?: number;
  pageIndex: number;
}

export const modifyPdf = async (file: File, mods: PdfModification[]): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  mods.forEach(mod => {
    if (mod.pageIndex < pdfDoc.getPageCount()) {
      const page = pdfDoc.getPages()[mod.pageIndex];
      const { height } = page.getSize();
      
      if (mod.type === 'text') {
        page.drawText(mod.content, {
          x: mod.x,
          y: height - mod.y - (mod.size || 12), // Convert top-left to bottom-left
          size: mod.size || 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
    }
  });

  return await pdfDoc.save();
};