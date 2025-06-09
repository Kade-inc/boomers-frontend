import {  PixelCrop } from "react-image-crop";

// helper function for canvas preview
export function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  targetSize = 200, // Default target size for profile picture 200px
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Calculate scale factors based on natural vs displayed dimensions
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Set canvas dimensions to target size while maintaining aspect ratio
  canvas.width = targetSize;
  canvas.height = targetSize;

  ctx.imageSmoothingQuality = "high";

  // Calculate the crop coordinates
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  // Calculate aspect ratio of the crop
  const cropAspect = cropWidth / cropHeight;
  let drawWidth = targetSize;
  let drawHeight = targetSize;

  if (cropAspect > 1) {
    // Width is larger than height
    drawHeight = targetSize / cropAspect;
  } else if (cropAspect < 1) {
    // Height is larger than width
    drawWidth = targetSize * cropAspect;
  }

  // Center the image on the canvas
  const offsetX = (targetSize - drawWidth) / 2;
  const offsetY = (targetSize - drawHeight) / 2;

  // Draw the cropped portion of the image on the canvas
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
  );
}