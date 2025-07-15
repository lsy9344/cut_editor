import React from 'react';

export const Sidebar: React.FC = () => (
  <aside className="sidebar">
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Frames</h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="card p-3 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="w-full h-16 bg-gray-200 rounded mb-2 flex items-center justify-center">
            <span className="text-xs text-gray-500">1 Photo</span>
          </div>
          <p className="text-xs text-center text-gray-600">Single</p>
        </div>
        <div className="card p-3 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="w-full h-16 bg-gray-200 rounded mb-2 flex items-center justify-center">
            <span className="text-xs text-gray-500">2 Photos</span>
          </div>
          <p className="text-xs text-center text-gray-600">Double</p>
        </div>
        <div className="card p-3 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="w-full h-16 bg-gray-200 rounded mb-2 flex items-center justify-center">
            <span className="text-xs text-gray-500">4 Photos</span>
          </div>
          <p className="text-xs text-center text-gray-600">Grid</p>
        </div>
        <div className="card p-3 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="w-full h-16 bg-gray-200 rounded mb-2 flex items-center justify-center">
            <span className="text-xs text-gray-500">6 Photos</span>
          </div>
          <p className="text-xs text-center text-gray-600">Collage</p>
        </div>
      </div>
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
