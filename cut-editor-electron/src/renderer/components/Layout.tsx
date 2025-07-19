import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ImageCanvas } from './ImageCanvas';
import { RenderingVerification } from './RenderingVerification';
import { AppConfig } from '@shared/types';

interface LayoutProps {
  appConfig: AppConfig;
}

export const Layout: React.FC<LayoutProps> = ({ appConfig }) => (
  <div className="flex flex-col h-screen bg-gray-50">
    <Header appConfig={appConfig} />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-4">
        <ImageCanvas />
      </main>
    </div>
    {/* Show verification panel in development */}
    {appConfig.isDevelopment && <RenderingVerification />}
  </div>
);
