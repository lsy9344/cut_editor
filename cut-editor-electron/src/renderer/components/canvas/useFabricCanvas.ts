import { useRef, useEffect, useCallback } from 'react';
import { Canvas, FabricObject, SelectionEvent, ObjectEvent } from 'fabric';
import { Dimensions } from '../../../shared/types';

interface FabricCanvasHookProps {
  canvasDimensions: Dimensions;
  onSelectionChange?: (objectId: string | null) => void;
  onPositionChange?: (objectId: string, x: number, y: number) => void;
  onScaleChange?: (objectId: string, scaleX: number, scaleY: number) => void;
  enableZoom?: boolean;
  slotBounds?:
    | {
        [slotId: string]: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
      }
    | undefined;
}

interface FabricCanvasHookReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fabricCanvas: Canvas | null;
  addObject: (object: FabricObject) => void;
  removeObject: (object: FabricObject) => void;
  clearCanvas: () => void;
  getObjectById: (id: string) => FabricObject | null;
}

export const useFabricCanvas = ({
  canvasDimensions,
  onSelectionChange,
  onPositionChange,
  onScaleChange,
  enableZoom = true,
  slotBounds,
}: FabricCanvasHookProps): FabricCanvasHookReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  // Selection change handler
  const handleSelectionCreated = useCallback(
    (e: SelectionEvent) => {
      const target = e.selected?.[0];
      if (target && onSelectionChange) {
        const objectId = target.get('id');
        onSelectionChange(objectId);
      }
    },
    [onSelectionChange]
  );

  const handleSelectionCleared = useCallback(() => {
    if (onSelectionChange) {
      onSelectionChange(null);
    }
  }, [onSelectionChange]);

  // Object modification handlers
  const handleObjectMoving = useCallback(
    (e: ObjectEvent) => {
      const target = e.target;
      if (!target) return;

      const objectId = target.get('id');

      // Apply slot boundary constraints for image objects
      if (
        slotBounds &&
        typeof objectId === 'string' &&
        objectId.startsWith('image-')
      ) {
        const slotId = objectId.replace('image-', '');
        const bounds = slotBounds[slotId];

        if (bounds) {
          const left = target.get('left') ?? 0;
          const top = target.get('top') ?? 0;
          const width =
            (target.get('width') ?? 0) * (target.get('scaleX') ?? 1);
          const height =
            (target.get('height') ?? 0) * (target.get('scaleY') ?? 1);

          // Calculate constrained position
          const constrainedLeft = Math.max(
            bounds.x,
            Math.min(left, bounds.x + bounds.width - width)
          );
          const constrainedTop = Math.max(
            bounds.y,
            Math.min(top, bounds.y + bounds.height - height)
          );

          // Apply constraints if needed
          if (left !== constrainedLeft || top !== constrainedTop) {
            target.set({
              left: constrainedLeft,
              top: constrainedTop,
            });
          }
        }
      }

      // Call the position change callback
      if (onPositionChange) {
        const left = target.get('left') ?? 0;
        const top = target.get('top') ?? 0;
        onPositionChange(objectId, left, top);
      }
    },
    [onPositionChange, slotBounds]
  );

  const handleObjectScaling = useCallback(
    (e: ObjectEvent) => {
      const target = e.target;
      if (target && onScaleChange) {
        const objectId = target.get('id');
        const scaleX = target.get('scaleX') ?? 1;
        const scaleY = target.get('scaleY') ?? 1;
        onScaleChange(objectId, scaleX, scaleY);
      }
    },
    [onScaleChange]
  );

  // Mouse wheel zoom handler
  const handleMouseWheel = useCallback(
    (event: WheelEvent) => {
      if (!enableZoom || !fabricCanvasRef.current) return;

      event.preventDefault();
      event.stopPropagation();

      const canvas = fabricCanvasRef.current;
      const delta = event.deltaY;
      let zoom = canvas.getZoom();

      // Zoom factor and limits
      const zoomFactor = 0.999 ** delta;
      const minZoom = 0.1;
      const maxZoom = 5;

      zoom = Math.min(Math.max(zoom * zoomFactor, minZoom), maxZoom);

      // Get pointer position for center-point zoom
      const pointer = canvas.getPointer(event);
      canvas.zoomToPoint({ x: pointer.x, y: pointer.y }, zoom);
    },
    [enableZoom]
  );

  // Canvas management functions
  const addObject = useCallback((object: FabricObject): void => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.add(object);
    }
  }, []);

  const removeObject = useCallback((object: FabricObject): void => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.remove(object);
    }
  }, []);

  const clearCanvas = useCallback((): void => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
    }
  }, []);

  const getObjectById = useCallback((id: string): FabricObject | null => {
    if (!fabricCanvasRef.current) return null;

    const objects = fabricCanvasRef.current.getObjects();
    return objects.find((obj: FabricObject) => obj.get('id') === id) ?? null;
  }, []);

  // Canvas initialization and cleanup
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    // Initialize Fabric.js canvas
    const canvas = new Canvas(canvasElement, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      selection: true,
      preserveObjectStacking: true,
      imageSmoothingEnabled: true,
      allowTouchScrolling: false,
      centeredScaling: true,
      centeredRotation: true,
    });

    fabricCanvasRef.current = canvas;

    // Setup event listeners
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:scaling', handleObjectScaling);

    // Add mouse wheel event listener for zoom
    if (enableZoom) {
      canvasElement.addEventListener('wheel', handleMouseWheel, {
        passive: false,
      });
    }

    // Critical cleanup function
    return (): void => {
      // Remove all event listeners
      canvas.off('selection:created');
      canvas.off('selection:cleared');
      canvas.off('object:moving');
      canvas.off('object:scaling');

      // Remove wheel event listener
      if (enableZoom) {
        canvasElement.removeEventListener('wheel', handleMouseWheel);
      }

      // Dispose of the canvas and free memory
      void canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [
    canvasDimensions.width,
    canvasDimensions.height,
    handleSelectionCreated,
    handleSelectionCleared,
    handleObjectMoving,
    handleObjectScaling,
    enableZoom,
    handleMouseWheel,
    slotBounds,
  ]);

  return {
    canvasRef,
    fabricCanvas: fabricCanvasRef.current,
    addObject,
    removeObject,
    clearCanvas,
    getObjectById,
  };
};
