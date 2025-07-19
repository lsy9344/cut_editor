import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { AppConfig } from '@shared/types';
import { FrameProvider } from './context/FrameContext';

export const App: React.FC = () => {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    console.log('🔄 App useEffect started');
    
    const initializeApp = async () => {
      try {
        console.log('🚀 initializeApp called');
        
        // Debug: Check if electronAPI is available
        console.log('🔍 Checking electronAPI availability...');
        console.log('window.electronAPI:', window.electronAPI);
        
        if (typeof window.electronAPI === 'undefined') {
          // If electronAPI is not available, use fallback config
          console.log('⚠️ electronAPI not available - using fallback config');
          setDebugInfo('electronAPI not available - using fallback config');
          const fallbackConfig = {
            isDevelopment: true,
            appName: 'Cut Editor',
            appVersion: '1.0.0',
          };
          console.log('📋 Setting fallback config:', fallbackConfig);
          setAppConfig(fallbackConfig);
          console.log('✅ About to set isLoading to false');
          setIsLoading(false);
          return;
        }

        console.log('✅ electronAPI is available');
        setDebugInfo('electronAPI available, calling getAppConfig...');

        // Add timeout to prevent hanging - reduced to 1 second for faster fallback
        console.log('📞 Calling getAppConfig...');
        const configPromise = window.electronAPI.getAppConfig();
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('IPC timeout after 1 second')), 1000);
        });

        const config = (await Promise.race([configPromise, timeoutPromise])) as AppConfig;
        console.log('📋 Received config from IPC:', config);
        setAppConfig(config);
        setDebugInfo('App config loaded successfully via IPC');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Failed to initialize app:', error);
        const errorMsg = error instanceof Error ? error.message : String(error);

        // If IPC fails, use fallback config and continue anyway
        console.log('🔄 Using fallback config due to error');
        setDebugInfo(`IPC failed, using fallback: ${errorMsg}`);
        const fallbackConfig = {
          isDevelopment: true,
          appName: 'Cut Editor',
          appVersion: '1.0.0',
        };
        console.log('📋 Setting fallback config after error:', fallbackConfig);
        setAppConfig(fallbackConfig);

        // Don't set error state, just continue with fallback
      } finally {
        console.log('🏁 Finally block: setting isLoading to false');
        setIsLoading(false);
      }
    };

    console.log('⚡ About to call initializeApp');
    void initializeApp();
  }, []);

  console.log('🎯 App render - isLoading:', isLoading, 'appConfig:', appConfig);

  if (isLoading) {
    console.log('📱 Rendering loading screen');
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"
            role="status"
          ></div>
          <p className="text-gray-600 text-sm">Loading Cut Editor...</p>
          {debugInfo && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-500 max-w-md">
              {debugInfo}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!appConfig) {
    console.log('❌ App config is null - rendering error screen');
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

  console.log('✅ App config available - rendering main layout');
  try {
    return (
      <FrameProvider>
        <Layout appConfig={appConfig} />
      </FrameProvider>
    );
  } catch (error) {
    console.error('❌ Error rendering Layout:', error);
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Layout Rendering Error</h1>
          <p className="text-gray-600 mb-4">
            Error: {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    );
  }
};
