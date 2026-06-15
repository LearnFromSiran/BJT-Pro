'use client';

import type { UploadedPage } from './types';

const MAX_DIM = 2200; // downscale large phone photos before upload/OCR

export async function fileToPage(file: File): Promise<UploadedPage> {
  if (file.type === 'application/pdf') {
    // PDFs are passed through as-is (data URL). Live OCR of PDFs requires a
    // server-side render step; for best results, photograph each page.
    const dataUrl = await readAsDataUrl(file);
    return { dataUrl, mimeType: file.type, name: file.name };
  }
  const dataUrl = await downscaleImage(file);
  return { dataUrl, mimeType: 'image/jpeg', name: file.name };
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function downscaleImage(file: File): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  try {
    const img = await loadImage(dataUrl);
    const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
    if (scale >= 1) return dataUrl;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  } catch {
    return dataUrl;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
