import React, { useState } from 'react';
import { FrameTemplate } from '../../shared/types';
import { getAllFrameTemplates } from '../../shared/data/frameTemplates';

interface FrameSelectorProps {
  selectedFrame?: FrameTemplate | undefined;
  onFrameSelect: (frame: FrameTemplate) => void;
  className?: string;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({
  selectedFrame,
  onFrameSelect,
  className = '',
}) => {
  const [frames] = useState<FrameTemplate[]>(getAllFrameTemplates());

  const renderFramePreview = (frame: FrameTemplate) => {
    const scale = 0.15;
    const previewWidth = frame.canvasWidth * scale;
    const previewHeight = frame.canvasHeight * scale;

    return (
      <div
        className="relative border-2 border-gray-200 bg-white"
        style={{
          width: previewWidth,
          height: previewHeight,
          minWidth: 120,
          minHeight: 120,
        }}
      >
        {frame.slots.map(slot => (
          <div
            key={slot.id}
            className="absolute border border-gray-300 bg-gray-100 rounded-sm"
            style={{
              left: slot.x * scale,
              top: slot.y * scale,
              width: slot.width * scale,
              height: slot.height * scale,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`frame-selector ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Frame Layout</h3>
        <p className="text-sm text-gray-600">Select a frame layout for your images</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {frames.map(frame => (
          <button
            key={frame.id}
            onClick={() => onFrameSelect(frame)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md
              ${
          selectedFrame?.id === frame.id
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300'
          }
            `}
          >
            <div className="flex flex-col items-center space-y-2">
              {renderFramePreview(frame)}
              <div className="text-center">
                <h4 className="font-medium text-gray-800">{frame.name}</h4>
                <p className="text-xs text-gray-500">{frame.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FrameSelector;
