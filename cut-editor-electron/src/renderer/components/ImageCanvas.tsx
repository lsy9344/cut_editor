import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useFrame } from '../context/FrameContext';
import { useMultiSelect } from '../hooks/useMultiSelect';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const { state, addImageToSlot, setSelectedSlot, executeBatchDrop } = useFrame();
  const { currentFrame, frameData, selectedSlot } = state;
  const { selectedSlots, selectionMode, toggleSlotSelection, isSlotSelected } = useMultiSelect();

  const highlightSlot = useCallback((canvas: fabric.Canvas, slotId: string) => {
    canvas.forEachObject((obj: FabricObjectWithData) => {
      if (obj.data?.type === 'slot') {
        if (obj.data.slotId === slotId) {
          // Enhanced visual feedback for selected slot
          obj.set({
            stroke: '#3b82f6',
            strokeWidth: 4,
            fill: '#dbeafe',
            shadow: new fabric.Shadow({
              color: '#3b82f6',
              blur: 10,
              offsetX: 0,
              offsetY: 0,
            }),
          });
        } else {
          obj.set({
            stroke: '#d1d5db',
            strokeWidth: 2,
            fill: '#f3f4f6',
            shadow: undefined,
          });
        }
      }
    });
    canvas.renderAll();
  }, []);

  const highlightSelectedSlots = useCallback(
    (canvas: fabric.Canvas) => {
      canvas.forEachObject((obj: FabricObjectWithData) => {
        if (obj.data?.type === 'slot') {
          const slotId = obj.data.slotId;
          if (slotId && isSlotSelected(slotId)) {
            obj.set({ stroke: '#10b981', strokeWidth: 3, fill: '#ecfdf5' });
          } else if (slotId === selectedSlot) {
            obj.set({ stroke: '#3b82f6', strokeWidth: 3, fill: '#f3f4f6' });
          } else {
            obj.set({ stroke: '#d1d5db', strokeWidth: 2, fill: '#f3f4f6' });
          }
        }
      });
      canvas.renderAll();
    },
    [isSlotSelected, selectedSlot],
  );

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

  const setupCanvasEvents = useCallback(
    (canvas: fabric.Canvas) => {
      canvas.on('mouse:down', (options: fabric.IEvent) => {
        const target = options.target as FabricObjectWithData;
        if (target?.data?.type === 'slot') {
          const slotId = target.data.slotId;
          if (slotId) {
            const isCtrlPressed =
              (options.e as KeyboardEvent).ctrlKey || (options.e as KeyboardEvent).metaKey;
            if (selectionMode === 'multi' && isCtrlPressed) {
              // Multi-select mode with Ctrl key
              toggleSlotSelection(slotId);
              highlightSelectedSlots(canvas);
            } else {
              // Single select mode or single click without Ctrl
              setSelectedSlot(slotId);
              highlightSlot(canvas, slotId);
            }
          }
        }
      });
    },
    [setSelectedSlot, highlightSlot, selectionMode, toggleSlotSelection, highlightSelectedSlots],
  );

  // Asynchronous Fabric.js initialization with error handling
  useEffect(() => {
    const initializeCanvas = async () => {
      try {
        console.log('🎨 Starting canvas initialization...');
        setIsLoading(true);
        setError(null);

        const canvas = canvasRef.current;
        if (!canvas) {
          console.log('❌ Canvas ref not available');
          return;
        }

        console.log('✅ Canvas element found, creating Fabric.js canvas...');

        // Wrap Fabric.js initialization in setTimeout to make it async
        await new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            try {
              const fabricCanvas = new fabric.Canvas(canvas, {
                width: currentFrame?.canvasWidth ?? 800,
                height: currentFrame?.canvasHeight ?? 600,
                backgroundColor: '#ffffff',
                selection: false,
                preserveObjectStacking: true,
              });

              console.log('✅ Fabric.js canvas created successfully');
              fabricCanvasRef.current = fabricCanvas;

              if (currentFrame) {
                console.log('🎯 Drawing frame slots...');
                drawFrameSlots(fabricCanvas, currentFrame);
              }

              console.log('🎪 Setting up canvas events...');
              setupCanvasEvents(fabricCanvas);

              setIsCanvasReady(true);
              console.log('🎉 Canvas initialization complete!');
              resolve();
            } catch (err) {
              console.error('❌ Error creating Fabric.js canvas:', err);
              reject(err);
            }
          }, 0);
        });
      } catch (err) {
        console.error('❌ Canvas initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize canvas');
      } finally {
        setIsLoading(false);
      }
    };

    void initializeCanvas();

    return () => {
      console.log('🧹 Cleaning up canvas...');
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
      setIsCanvasReady(false);
    };
  }, [currentFrame, drawFrameSlots, setupCanvasEvents]);

  // Show loading state while canvas initializes
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Initializing Canvas...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <h3 className="text-red-800 font-semibold mb-1">Canvas Error</h3>
          <p className="text-red-600 text-sm mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`canvas-container relative ${isDragOver ? 'drag-over' : ''}`}
    >
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-sm"
      />
      {!isCanvasReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
          <p className="text-gray-600">Setting up canvas...</p>
        </div>
      )}
    </div>
  );
};