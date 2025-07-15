import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { AppConfig } from '@shared/types';
import { FrameProvider } from './context/FrameContext';

export const App: React.FC = () => {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Debug: Check if electronAPI is available
        if (typeof window.electronAPI === 'undefined') {
          setDebugInfo('electronAPI is not available');
          setIsLoading(false);
          return;
        }

        setDebugInfo('electronAPI available, calling getAppConfig...');
        const config = (await window.electronAPI.getAppConfig()) as AppConfig;
        setAppConfig(config);
        setDebugInfo('App config loaded successfully');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize app:', error);
        setDebugInfo(`Error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!appConfig) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to Initialize App</h1>
          <p className="text-gray-600 mb-4">
            Unable to connect to the main process. Please try restarting the application.
          </p>
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-left">
              <strong>Debug info:</strong> {debugInfo}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <FrameProvider>
      <Layout appConfig={appConfig} />
    </FrameProvider>
  );
};
