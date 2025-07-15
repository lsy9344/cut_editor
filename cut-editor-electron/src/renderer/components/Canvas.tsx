import React, { useEffect, useRef, useState } from 'react';
import { ImageFile } from '@shared/types';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadedImages, setLoadedImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

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

    // Add native drag and drop event listeners
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
      // eslint-disable-next-line no-console
      console.log('Drag over detected');
    };

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
      // eslint-disable-next-line no-console
      console.log('Drag enter detected');
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      // eslint-disable-next-line no-console
      console.log('Drag leave detected');
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer?.files ?? []);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));

      if (imageFiles.length === 0) {
        setError('No image files found. Please drop valid image files.');
        return;
      }

      await processFiles(imageFiles);
    };

    // Add event listeners to container
    const dropHandler = (e: DragEvent) => {
      void handleDrop(e);
    };

    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragenter', handleDragEnter);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('drop', dropHandler);

    // Cleanup function
    // eslint-disable-next-line consistent-return
    return () => {
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('dragenter', handleDragEnter);
      container.removeEventListener('dragleave', handleDragLeave);
      container.removeEventListener('drop', dropHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processFiles = async (files: File[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const filePromises = files.map(
        async file =>
          new Promise<ImageFile>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              resolve({
                name: file.name,
                path: file.name, // For drag-and-drop, we use the name as path
                data: result,
                size: file.size,
              });
            };
            reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
            reader.readAsDataURL(file);
          }),
      );

      const newImages = await Promise.all(filePromises);
      setLoadedImages(prev => [...prev, ...newImages]);
      drawImages([...loadedImages, ...newImages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process files');
    } finally {
      setIsLoading(false);
    }
  };

  const drawImages = (images: ImageFile[]) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the first image as an example
    const firstImage = images[0];
    if (!firstImage) return;

    const img = new Image();
    img.onload = () => {
      // Calculate scaling to fit canvas while maintaining aspect ratio
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.8;
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Draw border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    };
    img.src = firstImage.data;
  };

  const handleCanvasClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fileData = (await window.electronAPI.openFile()) as ImageFile[] | null;
      if (fileData && fileData.length > 0) {
        setLoadedImages(prev => [...prev, ...fileData]);
        drawImages([...loadedImages, ...fileData]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open files');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className={`canvas-container ${isDragOver ? 'drag-over' : ''}`}>
      <canvas
        ref={canvasRef}
        className="cursor-pointer transition-all duration-200"
        onClick={() => {
          void handleCanvasClick();
        }}
      />

      {isDragOver && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-blue-50 
            bg-opacity-90 pointer-events-none`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📁</div>
            <p className="text-blue-600 font-medium">Drop images here</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
            <p className="text-gray-600">Processing images...</p>
          </div>
        </div>
      )}

      {error && (
        <div
          className={`absolute top-4 right-4 bg-red-100 border border-red-400 
            text-red-700 px-4 py-3 rounded max-w-sm`}
        >
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {loadedImages.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-2">
          <p className="text-sm text-gray-600">
            {loadedImages.length} image{loadedImages.length === 1 ? '' : 's'} loaded
          </p>
        </div>
      )}
    </div>
  );
};
