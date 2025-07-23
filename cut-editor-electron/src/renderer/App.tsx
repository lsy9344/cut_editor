/**
 * Cut Editor - Main React Application Component
 * This is the root component of the Cut Editor application.
 */

import React from 'react';
import { AppProvider, useAppState, useAppActions } from './context/AppContext';
import {
  Header,
  Layout,
  ImageCanvas,
  Sidebar,
  FrameSelector,
  ImageUploader,
  TextEditor,
  ActionButtons,
  StatusDisplay,
  ErrorBoundary,
} from './components';

// Main app content component (wrapped by AppProvider)
const AppContent: React.FC = () => {
  const state = useAppState();
  const actions = useAppActions();

  return (
    <ErrorBoundary>
      <Header title="Cut Editor" version="2.0.0" />
      <Layout>
        <ImageCanvas
          frame={state.currentFrame}
          imageSlots={state.imageSlots}
          selectedSlotId={state.uiState.selectedSlotId}
          onSlotClick={actions.selectSlot}
          onImagePositionChange={actions.updateImagePosition}
          onImageScaleChange={actions.updateImageScale}
        />

        <Sidebar>
          <div className="space-y-6">
            <StatusDisplay
              error={state.uiState.error}
              loadingMessage={state.uiState.loadingMessage}
              isLoading={state.uiState.isLoading}
              isExporting={state.uiState.isExporting}
              exportProgress={state.uiState.exportProgress}
              onClearError={() => actions.setError(null)}
            />
            <FrameSelector
              availableFrames={state.availableFrames}
              currentFrame={state.currentFrame}
              onFrameSelect={actions.selectFrame}
              isLoading={state.uiState.isLoading}
            />
            <ImageUploader
              selectedSlotId={state.uiState.selectedSlotId}
              onImageUpload={(slotId: string, file: File) => {
                // Create HTMLImageElement from File
                const img = new Image();
                img.onload = () => {
                  actions.loadImageToSlot(slotId, file, img);
                };
                img.src = URL.createObjectURL(file);
              }}
              isLoading={state.uiState.isLoading}
            />
            <TextEditor
              textSettings={state.textSettings}
              onTextUpdate={actions.updateTextSettings}
              isLoading={state.uiState.isLoading}
            />
            <ActionButtons
              onReset={actions.resetAll}
              onResetSelected={actions.resetSelectedImage}
              onApplyText={() => {
                // Apply text functionality will be implemented in Phase 3
                console.log('Apply text clicked');
              }}
              onExport={() => {
                // Export functionality will be implemented in Phase 3
                console.log('Export clicked');
              }}
              isLoading={state.uiState.isLoading}
              isExporting={state.uiState.isExporting}
              exportProgress={state.uiState.exportProgress}
            />
          </div>
        </Sidebar>
      </Layout>
    </ErrorBoundary>
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
