import React from 'react';
import FrameSelector from './FrameSelector';
import { useFrame } from '../context/FrameContext';

export const Sidebar: React.FC = () => {
  const { state, setFrame } = useFrame();

  return (
    <aside className="sidebar">
      <div className="mb-6">
        <FrameSelector
          selectedFrame={state.currentFrame}
          onFrameSelect={setFrame}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tools</h2>
        <div className="space-y-2">
          <button className="btn btn-outline w-full text-left justify-start">
            <span className="mr-2">🖼️</span>
          Add Image
          </button>
          <button className="btn btn-outline w-full text-left justify-start">
            <span className="mr-2">📝</span>
          Add Text
          </button>
          <button className="btn btn-outline w-full text-left justify-start">
            <span className="mr-2">🔄</span>
          Rotate
          </button>
          <button className="btn btn-outline w-full text-left justify-start">
            <span className="mr-2">↩️</span>
          Undo
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Quality</label>
            <select className="input text-sm">
              <option>High (1200 DPI)</option>
              <option>Medium (600 DPI)</option>
              <option>Low (300 DPI)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select className="input text-sm">
              <option>PNG</option>
              <option>JPEG</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};
