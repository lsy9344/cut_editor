import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { AppConfig } from '@shared/types';
import { FrameProvider } from './context/FrameContext';

export const App: React.FC = () => {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Attempting to get app config...'); // 로그 추가
        const config = (await window.electronAPI.getAppConfig()) as AppConfig;
        console.log('App config received:', config); // 로그 추가
        setAppConfig(config);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
        console.log('isLoading set to false.'); // 로그 추가
      }
    };

    void initializeApp();
  }, []);

  if (isLoading) {
    console.log('App is loading, rendering spinner.'); // 로그 추가
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600" role="status"></div>
      </div>
    );
  }

  if (!appConfig) {
    console.log('App config is null, rendering error message.'); // 로그 추가
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to Initialize App</h1>
          <p className="text-gray-600">
            Unable to connect to the main process. Please try restarting the application.
          </p>
        </div>
      </div>
    );
  }

  console.log('App is ready, rendering layout.'); // 로그 추가
  return (
    <FrameProvider>
      <Layout appConfig={appConfig} />
    </FrameProvider>
  );
};
