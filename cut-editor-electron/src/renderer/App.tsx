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
  FrameSelector,
  ImageUploader,
  TextEditor,
  ActionButtons,
  StatusDisplay,
  ErrorBoundary,
} from './components';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue-600
      light: '#3b82f6', // Blue-500
      dark: '#1d4ed8', // Blue-700
    },
    secondary: {
      main: '#7c3aed', // Violet-600
      light: '#8b5cf6', // Violet-500
      dark: '#6d28d9', // Violet-700
    },
  },
  typography: {
    fontFamily:
      '"-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

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

        <div className="space-y-6">
          <StatusDisplay
            error={state.uiState.error}
            loadingMessage={state.uiState.loadingMessage}
            isLoading={state.uiState.isLoading}
            isExporting={state.uiState.isExporting}
            exportProgress={state.uiState.exportProgress}
            onClearError={(): void => actions.setError(null)}
          />
          <FrameSelector
            availableFrames={state.availableFrames}
            currentFrame={state.currentFrame}
            onFrameSelect={actions.selectFrame}
            isLoading={state.uiState.isLoading}
          />
          <ImageUploader
            selectedSlotId={state.uiState.selectedSlotId}
            onImageUpload={async (
              slotId: string,
              file: File
            ): Promise<void> => {
              try {
                actions.setLoading(true, 'Loading image...');

                // Create HTMLImageElement from file using object URL
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);

                await new Promise<void>((resolve, reject) => {
                  img.onload = (): void => {
                    // Clean up object URL after loading
                    URL.revokeObjectURL(objectUrl);
                    actions.loadImageToSlot(slotId, file, img);
                    resolve();
                  };

                  img.onerror = (): void => {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error('Failed to load image'));
                  };

                  img.src = objectUrl;
                });

                actions.setLoading(false);
              } catch (error) {
                actions.setLoading(false);
                actions.setError(
                  error instanceof Error
                    ? error.message
                    : 'Failed to load image'
                );
              }
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
            onApplyText={(): void => {
              // Apply text functionality will be implemented in Phase 3
            }}
            onExport={(): void => {
              // Export functionality will be implemented in Phase 3
            }}
            isLoading={state.uiState.isLoading}
            isExporting={state.uiState.isExporting}
            exportProgress={state.uiState.exportProgress}
          />
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

// Root App component with Context Provider
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
