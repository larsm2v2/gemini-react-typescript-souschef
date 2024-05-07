// Threshold filter function
const thresholdFilter = (data: Uint8ClampedArray, threshold: number) => {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
  
      // Calculate the average color value
      const avg = (r + g + b) / 3;
  
      // Apply the threshold
      if (avg < threshold * 255) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      } else {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }
  };
const PreprocessImage = (canvas: HTMLCanvasElement): ImageData => {

  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    thresholdFilter(image.data, 0.5);

    // Return the preprocessed image data
    return image;
  }
    // Return a new ImageData object with the same dimensions as the canvas
    return new ImageData(canvas.width, canvas.height);
};

export default PreprocessImage;


