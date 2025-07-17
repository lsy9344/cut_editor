import React, { useState } from 'react';
import FrameSelector from './FrameSelector';
import { TextEditor } from './TextEditor';
import { useFrame } from '../context/FrameContext';
import { useMultiSelect } from '../hooks/useMultiSelect';

export const Sidebar: React.FC = () => {
  const { state, setFrame, addTextToSlot, updateText, removeTextFromSlot } = useFrame();
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const {
    selectedSlots,
    selectionMode,
    setSelectionMode,
    clearSelection,
    selectAll,
    getSelectedCount,
  } = useMultiSelect();

  return (
    <aside className="sidebar">
      <div className="mb-6">
        <FrameSelector selectedFrame={state.currentFrame} onFrameSelect={setFrame} />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Selection Mode</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Mode:</label>
            <select
              value={selectionMode}
              onChange={e => setSelectionMode(e.target.value as 'single' | 'multi')}
              className="input text-sm flex-1"
            >
              <option value="single">Single Select</option>
              <option value="multi">Multi Select</option>
            </select>
          </div>
          {selectionMode === 'multi' && (
            <>
              <div className="text-sm text-gray-600">
                Selected: {getSelectedCount()} slot{getSelectedCount() !== 1 ? 's' : ''}
              </div>
              <div className="flex space-x-2">
                <button onClick={selectAll} className="btn btn-outline text-xs px-2 py-1 flex-1">
                  Select All
                </button>
                <button
                  onClick={clearSelection}
                  className="btn btn-outline text-xs px-2 py-1 flex-1"
                >
                  Clear
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tools</h2>
        <div className="space-y-2">
          <button className="btn btn-outline w-full text-left justify-start">
            <span className="mr-2">🖼️</span>
            Add Image
          </button>
          <button
            onClick={() => {
              // Use the current frame's first slot as default
              const firstSlot = state.frameData?.template.slots?.[0]?.id ?? 'slot-1';
              setSelectedSlot(firstSlot);
              setShowTextEditor(true);
            }}
            className="btn btn-outline w-full text-left justify-start"
          >
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
          {selectionMode === 'multi' && selectedSlots.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-1">Batch Operation Mode</div>
              <div className="text-xs text-blue-700">
                Drop multiple images to fill {selectedSlots.length} selected slots
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Text Elements Section */}
      {state.frameData?.texts && Object.keys(state.frameData.texts).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Text Elements</h2>
          <div className="space-y-2">
            {Object.entries(state.frameData.texts).map(([slotId, textData]) => (
              <button
                key={slotId}
                onClick={() => {
                  setSelectedSlot(slotId);
                  setShowTextEditor(true);
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50
                          transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 truncate">{textData.text}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {textData.style.fontFamily} • {textData.style.fontSize}px
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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

      {/* Text Editor Modal */}
      {showTextEditor && selectedSlot && (
        <TextEditor
          slotId={selectedSlot}
          initialText={state.frameData?.texts?.[selectedSlot]}
          onTextAdd={addTextToSlot}
          onTextUpdate={updateText}
          onTextRemove={removeTextFromSlot}
          onClose={() => {
            setShowTextEditor(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </aside>
  );
};
