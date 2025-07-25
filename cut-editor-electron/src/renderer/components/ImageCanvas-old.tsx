/**
 * Cut Editor - Image Canvas Component
 * Left-side canvas area for image editing (basic structure, no Fabric.js yet)
 */

import React, { memo, useCallback, useMemo } from 'react';
import { ImageCanvasProps } from '../../shared/types';

const ImageCanvas: React.FC<ImageCanvasProps> = memo(
  ({
    frame,
    imageSlots,
    selectedSlotId,
    onSlotClick,
    // Note: onImagePositionChange and onImageScaleChange will be used in future phases
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onImagePositionChange,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onImageScaleChange,
  }) => {
    // Handle slot click events
    const handleSlotClick = useCallback(
      (slotId: string) => {
        onSlotClick(slotId);
      },
      [onSlotClick]
    );

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
          {/* Frame background */}
          <div
            className="relative bg-white"
            style={{
              width: canvasDimensions.width,
              height: canvasDimensions.height,
            }}
          >
            {/* Render frame slots */}
            {frame.slots.map(slot => {
              const imageSlot = imageSlots[slot.id];
              const isSelected = selectedSlotId === slot.id;

              // Scale slot bounds to canvas dimensions
              const scaleX = canvasDimensions.width / frame.dimensions.width;
              const scaleY = canvasDimensions.height / frame.dimensions.height;

              const slotStyle = {
                left: slot.bounds.x * scaleX,
                top: slot.bounds.y * scaleY,
                width: slot.bounds.width * scaleX,
                height: slot.bounds.height * scaleY,
              };

              return (
                <div
                  key={slot.id}
                  className={`absolute border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/30'
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50/30'
                  }`}
                  style={slotStyle}
                  onClick={(): void => handleSlotClick(slot.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e): void => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSlotClick(slot.id);
                    }
                  }}
                >
                  {/* Render image if loaded */}
                  {imageSlot?.image ? (
                    <div className="w-full h-full overflow-hidden">
                      <img
                        src={imageSlot.image.src}
                        alt="Loaded content"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${imageSlot.scale}) translate(${imageSlot.position.x}px, ${imageSlot.position.y}px)`,
                          transformOrigin: 'center',
                        }}
                        draggable={false}
                      />
                    </div>
                  ) : (
                    /* Empty slot placeholder */
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 mx-auto mb-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <p className="text-xs text-gray-500">Add Image</p>
                      </div>
                    </div>
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                  )}
                </div>
              );
            })}
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
