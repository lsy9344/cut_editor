import React, { useCallback, useState } from 'react';
import { TextData, TextStyle } from '@shared/types';
import { AVAILABLE_FONTS, DEFAULT_FONT, getFontFamily } from '../utils/fontManager';

interface TextEditorProps {
  slotId: string;
  initialText?: TextData | undefined;
  onTextAdd: (slotId: string, text: TextData) => void;
  onTextUpdate: (slotId: string, text: TextData) => void;
  onTextRemove: (slotId: string) => void;
  onClose: () => void;
}

const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: DEFAULT_FONT.name,
  fontSize: 24,
  color: '#000000',
  textAlign: 'center',
  fontWeight: 'normal',
  fontStyle: 'normal',
};

export const TextEditor: React.FC<TextEditorProps> = ({
  slotId,
  initialText,
  onTextAdd,
  onTextUpdate,
  onTextRemove,
  onClose,
}) => {
  const [text, setText] = useState(initialText?.text ?? '');
  const [style, setStyle] = useState<TextStyle>(initialText?.style ?? DEFAULT_TEXT_STYLE);
  const [position, setPosition] = useState({
    x: initialText?.x ?? 50,
    y: initialText?.y ?? 50,
  });

  const handleStyleChange = useCallback(
    <K extends keyof TextStyle>(key: K, value: TextStyle[K]) => {
      setStyle(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handlePositionChange = useCallback((axis: 'x' | 'y', value: number) => {
    setPosition(prev => ({ ...prev, [axis]: value }));
  }, []);

  const handleSave = useCallback(() => {
    if (!text.trim()) {
      return;
    }

    const textData: TextData = {
      id: initialText?.id ?? `text-${Date.now()}`,
      text: text.trim(),
      x: position.x,
      y: position.y,
      style,
    };

    if (initialText) {
      onTextUpdate(slotId, textData);
    } else {
      onTextAdd(slotId, textData);
    }

    onClose();
  }, [text, position, style, slotId, initialText, onTextAdd, onTextUpdate, onClose]);

  const handleRemove = useCallback(() => {
    if (initialText) {
      onTextRemove(slotId);
    }
    onClose();
  }, [slotId, initialText, onTextRemove, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{initialText ? 'Edit Text' : 'Add Text'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ×
          </button>
        </div>

        {/* Text Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full p-3 border border-gray-300 rounded-md resize-none h-20"
            style={{ fontFamily: getFontFamily(style.fontFamily) }}
          />
        </div>

        {/* Font Settings */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
          <select
            value={style.fontFamily}
            onChange={e => handleStyleChange('fontFamily', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {AVAILABLE_FONTS.map(font => (
              <option key={font.name} value={font.name}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size: {style.fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="72"
            value={style.fontSize}
            onChange={e => handleStyleChange('fontSize', parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        {/* Text Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={style.color}
              onChange={e => handleStyleChange('color', e.target.value)}
              className="w-10 h-10 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={style.color}
              onChange={e => handleStyleChange('color', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Text Alignment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
          <div className="flex space-x-2">
            {(['left', 'center', 'right'] as const).map(align => (
              <button
                key={align}
                onClick={() => handleStyleChange('textAlign', align)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  style.textAlign === align
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Font Style */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                handleStyleChange('fontWeight', style.fontWeight === 'bold' ? 'normal' : 'bold')
              }
              className={`px-3 py-2 text-sm rounded-md border font-bold ${
                style.fontWeight === 'bold'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Bold
            </button>
            <button
              onClick={() =>
                handleStyleChange('fontStyle', style.fontStyle === 'italic' ? 'normal' : 'italic')
              }
              className={`px-3 py-2 text-sm rounded-md border italic ${
                style.fontStyle === 'italic'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Italic
            </button>
          </div>
        </div>

        {/* Position Controls */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">X: {position.x}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={position.x}
                onChange={e => handlePositionChange('x', parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Y: {position.y}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={position.y}
                onChange={e => handlePositionChange('y', parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div
            className="border border-gray-300 rounded-md p-4 bg-gray-50 h-20 flex items-center
                        justify-center"
          >
            <div
              style={{
                fontFamily: getFontFamily(style.fontFamily),
                fontSize: `${Math.min(style.fontSize, 18)}px`,
                color: style.color,
                textAlign: style.textAlign,
                fontWeight: style.fontWeight,
                fontStyle: style.fontStyle,
              }}
            >
              {text || 'Preview text...'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div>
            {initialText && (
              <button
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600
                          transition-colors"
              >
                Remove Text
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400
                        transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                        disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {initialText ? 'Update' : 'Add'} Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
