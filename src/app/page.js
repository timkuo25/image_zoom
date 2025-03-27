'use client'

import React, { useState, useRef, useEffect } from 'react';

const ImageCanvasUploader = () => {  
  const canvasRef = useRef(null);
  
  const [image, setImage] = useState(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [position, setPosition] = useState(null);
  const [dragging, setDragging] = useState(false); 
  const [dragStart, setDragStart] = useState(null);
  
  useEffect(
    () => drawImageOnCanvas(image, scaleFactor, position), 
    [image, scaleFactor, position]
  )

  const drawImageOnCanvas = (img, currentScale, currentPosition) => {
    if (img) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // calculate image size
      const scaledWidth = img.width * currentScale;
      const scaledHeight = img.height * currentScale;
      
      ctx.drawImage(
        img, 
        currentPosition.x, 
        currentPosition.y, 
        scaledWidth, 
        scaledHeight
      );
    }
  };
  
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          
          const canvas = canvasRef.current;
          setPosition({
            x: (canvas.width - img.width) / 2,
            y: (canvas.height - img.height) / 2
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWheel = e => {
    if (!image) return;
    
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    
    setScaleFactor(prev => prev * zoomFactor);
    setPosition(prev => ({
      x: mouseX - (mouseX - prev.x) * zoomFactor,
      y: mouseY - (mouseY - prev.y) * zoomFactor,
    }));

  };

  const handleMouseDown = (event) => {
    if (image) {
      setDragging(true);
      setDragStart({
        x: event.nativeEvent.offsetX - position.x,
        y: event.nativeEvent.offsetY - position.y,
      });
    }
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const newX = event.nativeEvent.offsetX - dragStart.x;
      const newY = event.nativeEvent.offsetY - dragStart.y;

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div >
      <input 
        type='file'
        accept='image/*' 
        onChange={handleImageUpload} 
      />
      <canvas 
        ref={canvasRef}
        width={500} 
        height={500} 
        style={{ border: '2px solid black', cursor: 'grab'}}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default ImageCanvasUploader;