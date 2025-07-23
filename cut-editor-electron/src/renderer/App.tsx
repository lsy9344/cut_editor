/**
 * Cut Editor - Main React Application Component
 * This is the root component of the Cut Editor application.
 */

import React from 'react';
import { AppProvider, useAppState, useAppActions } from './context/AppContext';
import Header from './components/Header';
import Layout from './components/Layout';
import ImageCanvas from './components/ImageCanvas';

// Main app content component (wrapped by AppProvider)
const AppContent: React.FC = () => {
  const state = useAppState();
  const actions = useAppActions();

  return (
    <>
      <Header title="Cut Editor" version="1.0.0" />
      <Layout>
        <ImageCanvas
          frame={state.currentFrame}
          imageSlots={state.imageSlots}
          selectedSlotId={state.uiState.selectedSlotId}
          onSlotClick={actions.selectSlot}
          onImagePositionChange={actions.updateImagePosition}
          onImageScaleChange={actions.updateImageScale}
        />

        {/* Placeholder for sidebar components */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Frame Templates
            </h3>
            <p className="text-sm text-gray-600">
              Frame selector will be implemented here
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Image Upload
            </h3>
            <p className="text-sm text-gray-600">
              Image uploader will be implemented here
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Text Editor
            </h3>
            <p className="text-sm text-gray-600">
              Text editor will be implemented here
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Controls
            </h3>
            <p className="text-sm text-gray-600">
              Scale and action controls will be implemented here
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

// Root App component with Context Provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
