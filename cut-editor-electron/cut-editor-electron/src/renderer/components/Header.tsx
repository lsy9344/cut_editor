import React from 'react';
import { AppConfig } from '@shared/types';

interface HeaderProps {
  appConfig: AppConfig;
}

export const Header: React.FC<HeaderProps> = ({ appConfig }) => {
  const handleMinimize = () => {
    void window.electronAPI.minimizeWindow();
  };

  const handleMaximize = () => {
    void window.electronAPI.maximizeWindow();
  };

  const handleClose = () => {
    void window.electronAPI.closeWindow();
  };

  return (
    <header className="toolbar shadow-sm">
      <div className="flex items-center flex-1">
        <h1 className="text-lg font-semibold text-gray-900">{appConfig.appName}</h1>
        {appConfig.isDevelopment && (
          <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">DEV</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={handleMinimize} className="btn btn-outline text-xs px-2 py-1">
          New
        </button>
        <button onClick={handleMaximize} className="btn btn-outline text-xs px-2 py-1">
          Open
        </button>
        <button onClick={handleClose} className="btn btn-primary text-xs px-2 py-1">
          Export
        </button>
      </div>

      <div className="flex items-center space-x-1 ml-4">
        <button
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors"
          title="Minimize"
        />
        <button
          onClick={handleMaximize}
          className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors"
          title="Maximize"
        />
        <button
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors"
          title="Close"
        />
      </div>
    </header>
  );
};
