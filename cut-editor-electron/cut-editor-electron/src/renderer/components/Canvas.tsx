import React, { useEffect, useRef, useState } from 'react';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Draw initial frame
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw placeholder content
    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Drop images here or click to add', canvas.width / 2, canvas.height / 2);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      // eslint-disable-next-line no-console
      console.log('Dropped images:', imageFiles);
      // TODO: Handle image loading
    }
  };

  const handleCanvasClick = () => {
    // TODO: Open file dialog
    // eslint-disable-next-line no-console
    console.log('Canvas clicked - should open file dialog');
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className={`cursor-pointer transition-all duration-200 ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
      />

      {isDragOver && (
        <div
          // eslint-disable-next-line max-len
          className="absolute inset-0 flex items-center justify-center bg-primary-50 bg-opacity-90 pointer-events-none"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📁</div>
            <p className="text-primary-600 font-medium">Drop images here</p>
          </div>
        </div>
      )}
    </div>
  );
};
