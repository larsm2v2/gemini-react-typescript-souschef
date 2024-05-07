import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import PreprocessImage from './Preprocess';



const OCR = () => {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
 
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    } else {
      setImage(''); // or any other fallback value you prefer
    }
  }
 
  const handleClick = () => {
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas is not defined');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Cannot get 2D rendering context');
      return;
    }
    const image = imageRef.current;
    if (!image) {
      console.error('Image is not defined');
    return;
    }
    ctx.drawImage(image, 0, 0);
    const processedImage = PreprocessImage(canvas);
    if (!processedImage) {
      console.error('Processed image is not defined');
    return;
    }
    ctx.putImageData(PreprocessImage(canvas), 0,0);
    const dataUrl = canvas.toDataURL("image/jpeg");
  
    Tesseract.recognize(
      dataUrl,'eng',
      { 
        logger: m => console.log(m) 
      }
    )
    .catch (err => {
      console.error(err);
    })
    .then(result => {
      if (result && 'confidence' in result && typeof result.confidence === 'number') {
        // Get Confidence score
        let confidence: number = result.confidence;
        console.log(confidence);
      }
      // Get full output
      if (result && 'text' in result && typeof result.text === 'string') {
      let text: string = result.text
      
      setText(text);
      }
    })
  }
 
  return (
    <div className="OCR-container">
      <main className="OCR-main">
      <h1>myImport</h1>
        <h3>Actual image uploaded</h3>
        <img 
           src={image} className="OCR-logo" alt="logo"
           ref={imageRef} 
           />
        <h3>Canvas</h3>
        <canvas ref={canvasRef} width={700} height={250}></canvas>
          <h3>Extracted text</h3>
        <div className="pin-box">
          <p> {text} </p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{height:50}}>Convert to text</button>
      </main>
    </div>
  );
}

export default OCR