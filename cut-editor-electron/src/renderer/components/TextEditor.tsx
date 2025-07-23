/**
 * Cut Editor - Text Editor Component
 * Text content input with font controls and styling options
 */

import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { TextEditorProps } from '../../shared/types';

const TextEditor: React.FC<TextEditorProps> = memo(({
  textSettings,
  onTextUpdate,
  isLoading,
}) => {
  const [localContent, setLocalContent] = useState(textSettings.content);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Sync local content with props
  useEffect(() => {
    setLocalContent(textSettings.content);
  }, [textSettings.content]);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setIsColorPickerOpen(false);
      }
    };

    if (isColorPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isColorPickerOpen]);

  // Handle text content change with debouncing
  const handleContentChange = useCallback(
    (value: string) => {
      setLocalContent(value);
      // Debounce the update to avoid too many state changes
      const timeoutId = setTimeout(() => {
        onTextUpdate({ content: value });
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [onTextUpdate]
  );

  // Handle font size change
  const handleFontSizeChange = useCallback(
    (value: number) => {
      const clampedValue = Math.max(8, Math.min(72, value));
      onTextUpdate({ fontSize: clampedValue });
    },
    [onTextUpdate]
  );

  // Handle color change
  const handleColorChange = useCallback(
    (color: string) => {
      onTextUpdate({ color });
      setIsColorPickerOpen(false);
    },
    [onTextUpdate]
  );

  // Handle italic toggle
  const handleItalicToggle = useCallback(() => {
    onTextUpdate({ isItalic: !textSettings.isItalic });
  }, [onTextUpdate, textSettings.isItalic]);

  // Handle font family change
  const handleFontFamilyChange = useCallback(
    (fontFamily: string) => {
      onTextUpdate({ fontFamily });
    },
    [onTextUpdate]
  );

  // Predefined colors
  const predefinedColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#800000', '#008000',
    '#000080', '#808080', '#ffa500', '#800080', '#008080',
  ];

  // Available fonts
  const availableFonts = [
    { value: 'Korean Font', label: 'Korean Font' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Text Settings</h3>

      {/* Text Content */}
      <div className="space-y-2">
        <label htmlFor="text-content" className="block text-xs font-medium text-gray-700">
          Text Content
        </label>
        <textarea
          ref={textareaRef}
          id="text-content"
          value={localContent}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
          placeholder="Enter your text here..."
          disabled={isLoading}
        />
        <div className="text-xs text-gray-500">
          {localContent.length} characters
        </div>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <label htmlFor="font-family" className="block text-xs font-medium text-gray-700">
          Font Family
        </label>
        <select
          id="font-family"
          value={textSettings.fontFamily}
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          {availableFonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <label htmlFor="font-size" className="block text-xs font-medium text-gray-700">
          Font Size: {textSettings.fontSize}px
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="font-size"
            type="range"
            min="8"
            max="72"
            value={textSettings.fontSize}
            onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <input
            type="number"
            min="8"
            max="72"
            value={textSettings.fontSize}
            onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10) || 12)}
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-700">
          Text Color
        </label>
        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <div
              className="w-5 h-5 rounded border border-gray-300"
              style={{ backgroundColor: textSettings.color }}
            />
            <span className="text-sm text-gray-700">{textSettings.color}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isColorPickerOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Color Picker Dropdown */}
          {isColorPickerOpen && (
            <div className="absolute z-10 mt-1 p-3 bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="grid grid-cols-5 gap-2 mb-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                      textSettings.color === color ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              
              {/* Custom color input */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Custom Color
                </label>
                <input
                  type="color"
                  value={textSettings.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Style Options */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-700">
          Style Options
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleItalicToggle}
            className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
              textSettings.isItalic
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            disabled={isLoading}
          >
            <span className="italic">I</span> Italic
          </button>
        </div>
      </div>

      {/* Preview */}
      {localContent && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">
            Preview
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <div
              style={{
                fontSize: `${textSettings.fontSize}px`,
                fontFamily: textSettings.fontFamily,
                color: textSettings.color,
                fontStyle: textSettings.isItalic ? 'italic' : 'normal',
                transform: textSettings.isItalic ? `skew(${-textSettings.shearAngle * 10}deg, 0)` : 'none',
                lineHeight: 1.4,
                wordBreak: 'break-word',
              }}
            >
              {localContent}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Text will be applied to all text positions in the frame</p>
        <p>• Use "Apply Text" button to render text on the canvas</p>
        <p>• Korean Font is optimized for Korean characters</p>
      </div>
    </div>
  );
});

TextEditor.displayName = 'TextEditor';

export default TextEditor;