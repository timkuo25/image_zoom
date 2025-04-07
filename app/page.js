'use client'

import React, { Component } from 'react';
class ImageCanvasUploader extends Component{ 
  
  state = {
    image: null,
    scaleFactor: 1,
    position: null,
    dragging: false,
    dragStart: null,
  }

  canvasRef = React.createRef();

  componentDidUpdate = () => {
    this.drawImageOnCanvas(this.state.image, this.state.scaleFactor, this.state.position);
  }

  drawImageOnCanvas = (img, currentScale, currentPosition) => {
    if (img) {
      const canvas = this.canvasRef.current;
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

  handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          this.setState({image: img});
          const canvas = this.canvasRef.current;

          this.setState({
            position: {
              x: (canvas.width - img.width) / 2,
              y: (canvas.height - img.height) / 2  
          }});
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  handleWheel = e => {
    if (!this.state.image) return;
    
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    
    this.setState(prev => ({
      scaleFactor: prev.scaleFactor * zoomFactor,
      position: {
        x: mouseX - (mouseX - prev.position.x) * zoomFactor,
        y: mouseY - (mouseY - prev.position.y) * zoomFactor,
      }
    }));

  };

  handleMouseDown = (event) => {
    if (this.state.image) {
      this.setState({
        dragging: true,
        dragStart: {
          x: event.nativeEvent.offsetX - this.state.position.x,
          y: event.nativeEvent.offsetY - this.state.position.y,
        }
      })
    }
  };

  handleMouseMove = (event) => {
    if (this.state.dragging) {
      const newX = event.nativeEvent.offsetX - this.state.dragStart.x;
      const newY = event.nativeEvent.offsetY - this.state.dragStart.y;
      this.setState({ position: { x: newX, y: newY }});
    }
  };

  handleMouseUp = () => this.setState({ dragging: false })
  
  render = () => {
    return(
      <div>
        <input 
          type='file'
          accept='image/*' 
          onChange={this.handleImageUpload} 
        />
        <canvas 
          ref={this.canvasRef}
          width={500} 
          height={500} 
          style={{ border: '2px solid black', cursor: 'grab'}}
          onWheel={this.handleWheel}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
        />
      </div>
    );
  }
}
export default ImageCanvasUploader;


// Functional Component

// 'use client'

// import React, { useState, useRef, useEffect } from 'react';

// const ImageCanvasUploader = () => {  
//   const canvasRef = useRef(null);
  
//   const [image, setImage] = useState(null);
//   const [scaleFactor, setScaleFactor] = useState(1);
//   const [position, setPosition] = useState(null);
//   const [dragging, setDragging] = useState(false); 
//   const [dragStart, setDragStart] = useState(null);
  
//   useEffect(
//     () => drawImageOnCanvas(image, scaleFactor, position), 
//     [image, scaleFactor, position]
//   )

//   const drawImageOnCanvas = (img, currentScale, currentPosition) => {
//     if (img) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
      
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
      
//       // calculate image size
//       const scaledWidth = img.width * currentScale;
//       const scaledHeight = img.height * currentScale;
      
//       ctx.drawImage(
//         img, 
//         currentPosition.x, 
//         currentPosition.y, 
//         scaledWidth, 
//         scaledHeight
//       );
//     }
//   };
  
//   const handleImageUpload = e => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const img = new Image();
//         img.onload = () => {
//           setImage(img);
          
//           const canvas = canvasRef.current;
//           setPosition({
//             x: (canvas.width - img.width) / 2,
//             y: (canvas.height - img.height) / 2
//           });
//         };
//         img.src = event.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleWheel = e => {
//     if (!image) return;
    
//     const mouseX = e.nativeEvent.offsetX;
//     const mouseY = e.nativeEvent.offsetY;

//     const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    
//     setScaleFactor(prev => prev * zoomFactor);
//     setPosition(prev => ({
//       x: mouseX - (mouseX - prev.x) * zoomFactor,
//       y: mouseY - (mouseY - prev.y) * zoomFactor,
//     }));

//   };

//   const handleMouseDown = (event) => {
//     if (image) {
//       setDragging(true);
//       setDragStart({
//         x: event.nativeEvent.offsetX - position.x,
//         y: event.nativeEvent.offsetY - position.y,
//       });
//     }
//   };

//   const handleMouseMove = (event) => {
//     if (dragging) {
//       const newX = event.nativeEvent.offsetX - dragStart.x;
//       const newY = event.nativeEvent.offsetY - dragStart.y;

//       setPosition({ x: newX, y: newY });
//     }
//   };

//   const handleMouseUp = () => setDragging(false);

//   return (
//     <html>
//       <body>
//         <div>
//           <input 
//             type='file'
//             accept='image/*' 
//             onChange={handleImageUpload} 
//           />
//           <canvas 
//             ref={canvasRef}
//             width={500} 
//             height={500} 
//             style={{ border: '2px solid black', cursor: 'grab'}}
//             onWheel={handleWheel}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//           />
//         </div>
//       </body>
//     </html>
//   );
// };

// export default ImageCanvasUploader;
