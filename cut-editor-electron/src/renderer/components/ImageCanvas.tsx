import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useFrame } from '../context/FrameContext';
import { ImageFile } from '@shared/types';

export const ImageCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { state, addImageToSlot, setSelectedSlot } = useFrame();
  const { currentFrame, frameData, selectedSlot } = state;

  const drawFrameSlots = useCallback((canvas: fabric.Canvas, frame: typeof currentFrame) => {
    if (!frame) return;

    frame.slots.forEach(slot => {
      const slotRect = new fabric.Rect({
        left: slot.x,
        top: slot.y,
        width: slot.width,
        height: slot.height,
        fill: '#f3f4f6',
        stroke: '#d1d5db',
        strokeWidth: 2,
        selectable: false,
        evented: true,
        hoverCursor: 'pointer',
        data: { type: 'slot', slotId: slot.id },
      });

      const slotLabel = new fabric.Text('Drop Image Here', {
        left: slot.x + slot.width / 2,
        top: slot.y + slot.height / 2,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: '#9ca3af',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        data: { type: 'slotLabel', slotId: slot.id },
      });

      canvas.add(slotRect, slotLabel);
    });

    canvas.renderAll();
  }, []);

  const setupCanvasEvents = useCallback((canvas: fabric.Canvas) => {
    canvas.on('mouse:down', (options: any) => {
      if (options.target && options.target.data?.type === 'slot') {
        const slotId = options.target.data.slotId;
        setSelectedSlot(slotId);
        highlightSlot(canvas, slotId);
      }
    });
  }, [setSelectedSlot]);

  const highlightSlot = useCallback((canvas: fabric.Canvas, slotId: string) => {
    canvas.forEachObject((obj: any) => {
      if (obj.data?.type === 'slot') {
        if (obj.data.slotId === slotId) {
          obj.set({ stroke: '#3b82f6', strokeWidth: 3 });
        } else {
          obj.set({ stroke: '#d1d5db', strokeWidth: 2 });
        }
      }
    });
    canvas.renderAll();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fabricCanvas = new fabric.Canvas(canvas, {
      width: currentFrame?.canvasWidth ?? 800,
      height: currentFrame?.canvasHeight ?? 600,
      backgroundColor: '#ffffff',
      selection: false,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = fabricCanvas;

    if (currentFrame) {
      drawFrameSlots(fabricCanvas, currentFrame);
    }

    setupCanvasEvents(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [currentFrame, drawFrameSlots, setupCanvasEvents]);

  const processImageFile = useCallback(async (file: File, slotId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const imageData = await new Promise<ImageFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve({
            name: file.name,
            path: file.name,
            data: result,
            size: file.size,
          });
        };
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
      });

      addImageToSlot(slotId, imageData);
      await addImageToCanvas(imageData, slotId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  }, [addImageToSlot]);

  const addImageToCanvas = useCallback(async (imageData: ImageFile, slotId: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !currentFrame) return;

    const slot = currentFrame.slots.find(s => s.id === slotId);
    if (!slot) return;

    return new Promise<void>((resolve) => {
      fabric.Image.fromURL(imageData.data, (img: any) => {
        const scaleX = slot.width / (img.width || 1);
        const scaleY = slot.height / (img.height || 1);
        const scale = Math.min(scaleX, scaleY);

        img.set({
          left: slot.x,
          top: slot.y,
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          evented: true,
          data: { type: 'image', slotId },
        });

        const existingImages = canvas.getObjects().filter(
          (obj: any) => obj.data?.type === 'image' && obj.data?.slotId === slotId,
        );
        existingImages.forEach((obj: any) => canvas.remove(obj));

        const slotLabel = canvas.getObjects().find(
          (obj: any) => obj.data?.type === 'slotLabel' && obj.data?.slotId === slotId,
        );
        if (slotLabel) {
          slotLabel.set({ visible: false });
        }

        canvas.add(img);
        canvas.renderAll();
        resolve();
      });
    });
  }, [currentFrame]);

  const handleCanvasDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!selectedSlot) {
      setError('Please select a slot first');
      return;
    }

    const files = Array.from(e.dataTransfer?.files ?? []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setError('No image files found. Please drop valid image files.');
      return;
    }

    const firstFile = imageFiles[0];
    if (firstFile) {
      await processImageFile(firstFile, selectedSlot);
    }
  }, [selectedSlot, processImageFile]);

  const handleCanvasClick = useCallback(async () => {
    if (!selectedSlot) {
      setError('Please select a slot first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fileData = (await window.electronAPI.openFile()) as ImageFile[] | null;
      if (fileData && fileData.length > 0) {
        const imageData = fileData[0];
        if (imageData) {
          addImageToSlot(selectedSlot, imageData);
          await addImageToCanvas(imageData, selectedSlot);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open files');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSlot, addImageToSlot, addImageToCanvas]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent) => {
      void handleCanvasDrop(e);
    };

    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('drop', handleDrop);

    return () => {
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('dragleave', handleDragLeave);
      container.removeEventListener('drop', handleDrop);
    };
  }, [handleCanvasDrop]);

  return (
    <div
      ref={containerRef}
      className={`relative canvas-container ${isDragOver ? 'drag-over' : ''}`}
    >
      <canvas
        ref={canvasRef}
        className="cursor-pointer transition-all duration-200"
        onClick={handleCanvasClick}
      />

      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 pointer-events-none">
          <div className="text-center">
            <div className="text-2xl mb-2">📁</div>
            <p className="text-blue-600 font-medium">
              {selectedSlot ? 'Drop image into selected slot' : 'Select a slot first'}
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
            <p className="text-gray-600">Processing image...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-sm">
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {selectedSlot && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-2">
          <p className="text-sm text-gray-600">
            Selected slot: {selectedSlot}
          </p>
        </div>
      )}

      {frameData && Object.keys(frameData.images).length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-2">
          <p className="text-sm text-gray-600">
            {Object.keys(frameData.images).length} image{Object.keys(frameData.images).length === 1 ? '' : 's'} loaded
          </p>
        </div>
      )}
    </div>
  );
};
