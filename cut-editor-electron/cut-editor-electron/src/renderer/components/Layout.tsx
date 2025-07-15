import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
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
        <Canvas />
      </main>
    </div>
  </div>
);
