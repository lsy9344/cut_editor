/**
 * Cut Editor - Frame Selector Component
 * Frame template selection with visual previews and thumbnails
 */

import React, { memo, useCallback, useState } from 'react';
import { FrameSelectorProps, FrameTemplate } from '../../shared/types';

const FrameSelector: React.FC<FrameSelectorProps> = memo(({
  availableFrames,
  currentFrame,
  onFrameSelect,
  isLoading,
}) => {
  const [hoveredFrame, setHoveredFrame] = useState<string | null>(null);

  const handleFrameClick = useCallback(
    (frame: FrameTemplate) => {
      if (!isLoading) {
        onFrameSelect(frame);
      }
    },
    [onFrameSelect, isLoading]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, frame: FrameTemplate) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleFrameClick(frame);
      }
    },
    [handleFrameClick]
  );

  // Generate SVG preview for frame layout
  const generateFramePreview = useCallback((frame: FrameTemplate) => {
    const { dimensions, slots } = frame;
    const scale = 80 / Math.max(dimensions.width, dimensions.height);
    const scaledWidth = dimensions.width * scale;
    const scaledHeight = dimensions.height * scale;

    return (
      <svg
        width={scaledWidth}
        height={scaledHeight}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="border border-gray-300 rounded"
      >
        {/* Background */}
        <rect
          width={dimensions.width}
          height={dimensions.height}
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="2"
        />
        
        {/* Slots */}
        {slots.map((slot) => (
          <rect
            key={slot.id}
            x={slot.bounds.x}
            y={slot.bounds.y}
            width={slot.bounds.width}
            height={slot.bounds.height}
            fill="#f3f4f6"
            stroke="#9ca3af"
            strokeWidth="1"
            strokeDasharray="4,2"
          />
        ))}
        
        {/* Slot numbers */}
        {slots.map((slot, index) => (
          <text
            key={`label-${slot.id}`}
            x={slot.bounds.x + slot.bounds.width / 2}
            y={slot.bounds.y + slot.bounds.height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs fill-gray-600"
            fontSize="12"
          >
            {index + 1}
          </text>
        ))}
      </svg>
    );
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Frame Layout</h3>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Frame Layout</h3>
        {currentFrame && (
          <span className="text-xs text-gray-500">
            {currentFrame.slots.length} slots
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {availableFrames.map((frame) => {
          const isSelected = currentFrame?.id === frame.id;
          const isHovered = hoveredFrame === frame.id;

          return (
            <button
              key={frame.id}
              type="button"
              className={`
                relative p-2 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
                ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              onClick={() => handleFrameClick(frame)}
              onKeyDown={(e) => handleKeyDown(e, frame)}
              onMouseEnter={() => setHoveredFrame(frame.id)}
              onMouseLeave={() => setHoveredFrame(null)}
              disabled={isLoading}
              aria-label={`Select ${frame.name} layout with ${frame.slots.length} slots`}
              aria-pressed={isSelected}
            >
              {/* Preview */}
              <div className="flex justify-center mb-2">
                {generateFramePreview(frame)}
              </div>

              {/* Frame Name */}
              <div className="text-xs text-center text-gray-700 font-medium">
                {frame.name}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Hover Effect */}
              {isHovered && !isSelected && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg" />
              )}
            </button>
          );
        })}
      </div>

      {availableFrames.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="mt-2 text-sm">No frame templates available</p>
        </div>
      )}
    </div>
  );
});

FrameSelector.displayName = 'FrameSelector';

export default FrameSelector;