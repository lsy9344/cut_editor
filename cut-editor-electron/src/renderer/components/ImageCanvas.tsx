/**
 * Cut Editor - Image Canvas Component (Fabric.js Integration)
 * Interactive canvas for image editing with drag-and-drop and zoom functionality
 */

import React, { memo, useCallback, useMemo, useEffect } from 'react';
import { Rect, FabricImage } from 'fabric';
import { ImageCanvasProps } from '../../shared/types';
import { useFabricCanvas } from './canvas/useFabricCanvas';

const ImageCanvas: React.FC<ImageCanvasProps> = memo(
  ({
    frame,
    imageSlots,
    selectedSlotId,
    onSlotClick,
    onImagePositionChange,
    onImageScaleChange,
  }) => {
    // Calculate canvas dimensions based on frame
    const canvasDimensions = useMemo(() => {
      if (!frame) {
        return { width: 800, height: 600 };
      }

      // Scale frame dimensions to fit available space while maintaining aspect ratio
      const maxWidth = 800;
      const maxHeight = 600;
      const aspectRatio = frame.dimensions.width / frame.dimensions.height;

      let width = maxWidth;
      let height = maxWidth / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = maxHeight * aspectRatio;
      }

      return { width: Math.floor(width), height: Math.floor(height) };
    }, [frame]);

    // Fabric.js canvas event handlers
    const handleSelectionChange = useCallback(
      (objectId: string | null) => {
        if (objectId && onSlotClick) {
          onSlotClick(objectId);
        }
      },
      [onSlotClick]
    );

    const handlePositionChange = useCallback(
      (objectId: string, x: number, y: number) => {
        if (onImagePositionChange) {
          onImagePositionChange(objectId, x, y);
        }
      },
      [onImagePositionChange]
    );

    const handleScaleChange = useCallback(
      (objectId: string, scaleX: number, scaleY: number) => {
        if (onImageScaleChange) {
          // Use average of scaleX and scaleY for uniform scaling
          const scale = (scaleX + scaleY) / 2;
          onImageScaleChange(objectId, scale);
        }
      },
      [onImageScaleChange]
    );

    // Calculate slot bounds for constraints
    const slotBounds = useMemo(() => {
      if (!frame) return undefined;

      const scaleX = canvasDimensions.width / frame.dimensions.width;
      const scaleY = canvasDimensions.height / frame.dimensions.height;
      const bounds: {
        [slotId: string]: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
      } = {};

      frame.slots.forEach(slot => {
        bounds[slot.id] = {
          x: slot.bounds.x * scaleX,
          y: slot.bounds.y * scaleY,
          width: slot.bounds.width * scaleX,
          height: slot.bounds.height * scaleY,
        };
      });

      return bounds;
    }, [frame, canvasDimensions]);

    // Initialize Fabric.js canvas
    const { canvasRef, fabricCanvas, addObject, getObjectById } =
      useFabricCanvas({
        canvasDimensions,
        onSelectionChange: handleSelectionChange,
        onPositionChange: handlePositionChange,
        onScaleChange: handleScaleChange,
        slotBounds,
      });

    // Create slot boundary rectangles (only clear slots, not images)
    useEffect(() => {
      if (!frame || !fabricCanvas) return;

      // Calculate scaling factors
      const scaleX = canvasDimensions.width / frame.dimensions.width;
      const scaleY = canvasDimensions.height / frame.dimensions.height;

      // Remove only slot boundary rectangles, keep images
      const allObjects = fabricCanvas.getObjects();
      const slotRects = allObjects.filter(obj => {
        const id = obj.get('id');
        return typeof id === 'string' && !id.startsWith('image-');
      });
      slotRects.forEach(rect => fabricCanvas.remove(rect));

      // Add slot boundary rectangles
      frame.slots.forEach(slot => {
        const slotRect = new Rect({
          left: slot.bounds.x * scaleX,
          top: slot.bounds.y * scaleY,
          width: slot.bounds.width * scaleX,
          height: slot.bounds.height * scaleY,
          fill: 'transparent',
          stroke: selectedSlotId === slot.id ? '#3b82f6' : '#d1d5db',
          strokeWidth: 2,
          selectable: true,
        });

        // Set object ID for identification
        slotRect.set('id', slot.id);
        addObject(slotRect);
      });

      fabricCanvas.renderAll();
    }, [frame, fabricCanvas, canvasDimensions, selectedSlotId, addObject]);

    // Load images into slots
    useEffect(() => {
      if (!frame || !fabricCanvas) return;

      // Calculate scaling factors
      const scaleX = canvasDimensions.width / frame.dimensions.width;
      const scaleY = canvasDimensions.height / frame.dimensions.height;

      // Load images for each slot that has an image
      const loadImages = async (): Promise<void> => {
        // Remove existing images only, keep slot boundaries
        const allObjects = fabricCanvas.getObjects();
        const imageObjects = allObjects.filter(obj => {
          const id = obj.get('id');
          return typeof id === 'string' && id.startsWith('image-');
        });
        imageObjects.forEach(img => fabricCanvas.remove(img));

        const imagePromises = frame.slots.map(async frameSlot => {
          const imageSlot = imageSlots[frameSlot.id];
          if (!imageSlot?.image) return;

          // We already have the frame slot from the map

          const finalPosition = {
            left: frameSlot.bounds.x * scaleX + imageSlot.position.x,
            top: frameSlot.bounds.y * scaleY + imageSlot.position.y,
            scaleX: imageSlot.scale * scaleX,
            scaleY: imageSlot.scale * scaleY,
          };

          try {
            // Try multiple methods for creating Fabric image
            let fabricImage;

            // Method 1: Try fromElement (v6 style)
            try {
              fabricImage = await FabricImage.fromElement(imageSlot.image, {
                left: finalPosition.left,
                top: finalPosition.top,
                scaleX: finalPosition.scaleX,
                scaleY: finalPosition.scaleY,
                selectable: true,
              });
            } catch (e1) {
              // Method 2: Try constructor with element
              try {
                fabricImage = new FabricImage(imageSlot.image, {
                  left: finalPosition.left,
                  top: finalPosition.top,
                  scaleX: finalPosition.scaleX,
                  scaleY: finalPosition.scaleY,
                  selectable: true,
                });
              } catch (e2) {
                // Method 3: Try fromURL with data URL
                fabricImage = await FabricImage.fromURL(imageSlot.image.src, {
                  left: finalPosition.left,
                  top: finalPosition.top,
                  scaleX: finalPosition.scaleX,
                  scaleY: finalPosition.scaleY,
                  selectable: true,
                });
              }
            }

            if (!fabricImage) {
              throw new Error('Failed to create fabric image');
            }

            // Set object ID for identification
            fabricImage.set('id', `image-${imageSlot.slotId}`);

            // Add to canvas
            addObject(fabricImage);

            // Force canvas render
            fabricCanvas.renderAll();
          } catch (error) {
            // Silently handle image loading errors
            // Error can be logged for debugging if needed
          }
        });

        await Promise.all(imagePromises);
      };

      void loadImages();
    }, [frame, fabricCanvas, imageSlots, canvasDimensions, addObject]);

    // Update slot selection visual feedback
    useEffect(() => {
      if (!fabricCanvas || !frame) return;

      frame.slots.forEach(slot => {
        const slotObject = getObjectById(slot.id);
        if (slotObject) {
          slotObject.set(
            'stroke',
            selectedSlotId === slot.id ? '#3b82f6' : '#d1d5db'
          );
        }
      });

      fabricCanvas.renderAll();
    }, [selectedSlotId, fabricCanvas, frame, getObjectById]);

    // Render empty state when no frame is selected
    if (!frame) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Frame Selected
            </h3>
            <p className="text-sm text-gray-500">
              Choose a frame template to start editing
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-gray-100">
        {/* Canvas container */}
        <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Fabric.js Canvas */}
          <div
            className="relative bg-white"
            style={{
              width: canvasDimensions.width,
              height: canvasDimensions.height,
            }}
          >
            <canvas ref={canvasRef} className="absolute inset-0" />
          </div>

          {/* Canvas info bar */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
            {frame.name} ({canvasDimensions.width} × {canvasDimensions.height})
          </div>
        </div>
      </div>
    );
  }
);

ImageCanvas.displayName = 'ImageCanvas';

export default ImageCanvas;
