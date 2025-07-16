import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useFrame } from '../context/FrameContext';
import { ImageFile, TextData } from '@shared/types';
import { getFontFamily } from '../utils/fontManager';

// Fabric.js object interfaces
interface FabricObjectWithData extends fabric.Object {
  data?: {
    type: string;
    slotId?: string;
    textId?: string;
  };
}

export const ImageCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { state, addImageToSlot, setSelectedSlot } = useFrame();
  const { currentFrame, frameData, selectedSlot } = state;

  const highlightSlot = useCallback((canvas: fabric.Canvas, slotId: string) => {
    canvas.forEachObject((obj: FabricObjectWithData) => {
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

  const highlightDragOverSlot = useCallback(
    (canvas: fabric.Canvas, slotId: string | null) => {
      canvas.forEachObject((obj: FabricObjectWithData) => {
        if (obj.data?.type === 'slot') {
          if (obj.data.slotId === slotId) {
            obj.set({ fill: '#dbeafe', stroke: '#3b82f6', strokeWidth: 3 });
          } else if (obj.data.slotId === selectedSlot) {
            obj.set({ fill: '#f3f4f6', stroke: '#3b82f6', strokeWidth: 3 });
          } else {
            obj.set({ fill: '#f3f4f6', stroke: '#d1d5db', strokeWidth: 2 });
          }
        }
      });
      canvas.renderAll();
    },
    [selectedSlot],
  );

  const getSlotAtPosition = useCallback(
    (x: number, y: number): string | null => {
      if (!currentFrame) return null;

      const slot = currentFrame.slots.find(
        slot => x >= slot.x && x <= slot.x + slot.width && y >= slot.y && y <= slot.y + slot.height,
      );

      return slot?.id ?? null;
    },
    [currentFrame],
  );

  const setupCanvasEvents = useCallback(
    (canvas: fabric.Canvas) => {
      canvas.on('mouse:down', (options: fabric.IEvent) => {
        const target = options.target as FabricObjectWithData;
        if (target?.data?.type === 'slot') {
          const slotId = target.data.slotId;
          if (slotId) {
            setSelectedSlot(slotId);
            highlightSlot(canvas, slotId);
          }
        }
      });
    },
    [setSelectedSlot, highlightSlot],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

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

    return (): void => {
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [currentFrame, drawFrameSlots, setupCanvasEvents]);

  const addImageToCanvas = useCallback(
    async (imageData: ImageFile, slotId: string): Promise<void> => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || !currentFrame) return Promise.resolve();

      const slot = currentFrame.slots.find(s => s.id === slotId);
      if (!slot) return Promise.resolve();

      return new Promise<void>(resolve => {
        fabric.Image.fromURL(
          imageData.data,
          (img: fabric.Image) => {
            // Ensure width and height are defined
            const imgWidth = img.width ?? 0;
            const imgHeight = img.height ?? 0;

            if (imgWidth === 0 || imgHeight === 0) {
              resolve();
              return;
            }

            const scaleX = slot.width / imgWidth;
            const scaleY = slot.height / imgHeight;
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

            // Clean up existing images to prevent memory leaks
            const existingImages = canvas
              .getObjects()
              .filter(
                (obj: FabricObjectWithData) =>
                  obj.data?.type === 'image' && obj.data?.slotId === slotId,
              );
            existingImages.forEach((obj: FabricObjectWithData) => {
              canvas.remove(obj);
              // Fabric.js object memory cleanup
              if ('dispose' in obj && typeof obj.dispose === 'function') {
                obj.dispose();
              }
            });

            const slotLabel = canvas
              .getObjects()
              .find(
                (obj: FabricObjectWithData) =>
                  obj.data?.type === 'slotLabel' && obj.data?.slotId === slotId,
              ) as FabricObjectWithData | undefined;
            if (slotLabel) {
              slotLabel.set({ visible: false });
            }

            canvas.add(img);
            canvas.renderAll();
            resolve();
          },
          {
            // Image loading optimization
            crossOrigin: 'anonymous',
          },
        );
      });
    },
    [currentFrame],
  );

  const addTextToCanvas = useCallback(
    (textData: TextData, slotId: string): void => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || !currentFrame) return;

      const slot = currentFrame.slots.find(s => s.id === slotId);
      if (!slot) return;

      // Calculate position relative to slot
      const x = slot.x + (slot.width * textData.x) / 100;
      const y = slot.y + (slot.height * textData.y) / 100;

      const fabricText = new fabric.Text(textData.text, {
        left: x,
        top: y,
        fontFamily: getFontFamily(textData.style.fontFamily),
        fontSize: textData.style.fontSize,
        fill: textData.style.color,
        textAlign: textData.style.textAlign,
        fontWeight: textData.style.fontWeight,
        fontStyle: textData.style.fontStyle,
        selectable: true,
        evented: true,
        data: { type: 'text', slotId, textId: textData.id },
      });

      // Remove existing text with same ID
      const existingTexts = canvas
        .getObjects()
        .filter(
          (obj: FabricObjectWithData) =>
            obj.data?.type === 'text' && obj.data?.textId === textData.id,
        );
      existingTexts.forEach((obj: FabricObjectWithData) => {
        canvas.remove(obj);
      });

      canvas.add(fabricText);
      canvas.renderAll();
    },
    [currentFrame],
  );

  /*
   * Text update and removal functions - will be used when integrating with TextEditor
   */
  /*
  const updateTextOnCanvas = useCallback(
    (textData: TextData, slotId: string): void => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || !currentFrame) return;

      const slot = currentFrame.slots.find(s => s.id === slotId);
      if (!slot) return;

      // Find existing text object
      const textObj = canvas
        .getObjects()
        .find(
          (obj: FabricObjectWithData) =>
            obj.data?.type === 'text' && obj.data?.textId === textData.id,
        ) as fabric.Text;

      if (textObj) {
        // Calculate new position
        const x = slot.x + (slot.width * textData.x) / 100;
        const y = slot.y + (slot.height * textData.y) / 100;

        textObj.set({
          text: textData.text,
          left: x,
          top: y,
          fontFamily: getFontFamily(textData.style.fontFamily),
          fontSize: textData.style.fontSize,
          fill: textData.style.color,
          textAlign: textData.style.textAlign,
          fontWeight: textData.style.fontWeight,
          fontStyle: textData.style.fontStyle,
        });
        canvas.renderAll();
      } else {
        // If text doesn't exist, add it
        addTextToCanvas(textData, slotId);
      }
    },
    [currentFrame, addTextToCanvas],
  );

  const removeTextFromCanvas = useCallback(
    (textId: string): void => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const textObjects = canvas
        .getObjects()
        .filter(
          (obj: FabricObjectWithData) =>
            obj.data?.type === 'text' && obj.data?.textId === textId,
        );

      textObjects.forEach((obj) => {
        canvas.remove(obj);
      });
      canvas.renderAll();
    },
    [],
  );
  */

  // Effect to sync text data with canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !frameData || !currentFrame) return;

    // Add all texts to canvas
    Object.keys(frameData.texts).forEach(slotId => {
      const textData = frameData.texts[slotId];
      if (textData) {
        addTextToCanvas(textData, slotId);
      }
    });
  }, [frameData, currentFrame, addTextToCanvas]);

  /*
   * Wrapper functions for text management with canvas sync
   * These will be activated when integrating TextEditor with Sidebar
   */
  /*
  const handleAddTextToSlot = useCallback(
    (slotId: string, textData: TextData) => {
      addTextToSlot(slotId, textData);
      addTextToCanvas(textData, slotId);
    },
    [addTextToSlot, addTextToCanvas],
  );

  const handleUpdateText = useCallback(
    (slotId: string, textData: TextData) => {
      updateText(slotId, textData);
      updateTextOnCanvas(textData, slotId);
    },
    [updateText, updateTextOnCanvas],
  );

  const handleRemoveTextFromSlot = useCallback(
    (slotId: string, textId: string) => {
      removeTextFromSlot(slotId);
      removeTextFromCanvas(textId);
    },
    [removeTextFromSlot, removeTextFromCanvas],
  );
  */

  const processImageFile = useCallback(
    async (file: File, slotId: string) => {
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
    },
    [addImageToSlot, addImageToCanvas],
  );

  const handleCanvasDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      setDragOverSlot(null);

      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      // Get drop position relative to canvas
      const rect = canvas.getElement().getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Auto-detect target slot based on drop position
      const targetSlot = getSlotAtPosition(x, y);

      if (!targetSlot) {
        setError('Please drop the image directly onto a slot area');
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
        setSelectedSlot(targetSlot);
        highlightSlot(canvas, targetSlot);
        await processImageFile(firstFile, targetSlot);
      }
    },
    [getSlotAtPosition, processImageFile, setSelectedSlot, highlightSlot],
  );

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
    if (!container) return undefined;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);

      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      // Get mouse position relative to canvas for slot highlighting
      const rect = canvas.getElement().getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const hoveredSlot = getSlotAtPosition(x, y);
      if (hoveredSlot !== dragOverSlot) {
        setDragOverSlot(hoveredSlot);
        highlightDragOverSlot(canvas, hoveredSlot);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();

      // Only hide drag state if we're actually leaving the container
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const isLeavingContainer =
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom;

        if (isLeavingContainer) {
          setIsDragOver(false);
          setDragOverSlot(null);
          const canvas = fabricCanvasRef.current;
          if (canvas && selectedSlot) {
            highlightSlot(canvas, selectedSlot);
          }
        }
      }
    };

    const handleDrop = (e: DragEvent) => {
      void handleCanvasDrop(e);
    };

    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('drop', handleDrop);

    return (): void => {
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('dragleave', handleDragLeave);
      container.removeEventListener('drop', handleDrop);
    };
  }, [
    handleCanvasDrop,
    getSlotAtPosition,
    dragOverSlot,
    highlightDragOverSlot,
    selectedSlot,
    highlightSlot,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative canvas-container ${isDragOver ? 'drag-over' : ''}`}
    >
      <canvas
        ref={canvasRef}
        className="cursor-pointer transition-all duration-200"
        onClick={() => void handleCanvasClick()}
      />

      {isDragOver && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90
                     pointer-events-none"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📁</div>
            <p className="text-blue-600 font-medium">
              {dragOverSlot ? `Drop image into ${dragOverSlot}` : 'Drop image onto any slot'}
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
        <div
          className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700
                     px-4 py-3 rounded max-w-sm"
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

      {selectedSlot && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-2">
          <p className="text-sm text-gray-600">Selected slot: {selectedSlot}</p>
        </div>
      )}

      {frameData && Object.keys(frameData.images).length > 0 && (
        <div
          className="absolute bottom-4 right-4 bg-white bg-opacity-90
                      rounded-lg p-2"
        >
          <p className="text-sm text-gray-600">
            {Object.keys(frameData.images).length} image
            {Object.keys(frameData.images).length === 1 ? '' : 's'} loaded
          </p>
        </div>
      )}
    </div>
  );
};
