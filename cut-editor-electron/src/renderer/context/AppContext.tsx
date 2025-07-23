/**
 * Cut Editor - Application Context and State Management
 * Global state management using React Context API with useReducer
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import {
  AppState,
  AppAction,
  FrameTemplate,
  ImageSlot,
  TextSettings,
  ExportSettings,
  DEFAULT_TEXT_SETTINGS,
  DEFAULT_EXPORT_SETTINGS,
  INITIAL_UI_STATE,
} from '../../shared/types';
import { FRAME_TEMPLATES } from '../../shared/constants/frameTemplates';

// Initial application state
const initialState: AppState = {
  currentFrame: null,
  availableFrames: FRAME_TEMPLATES,
  imageSlots: {},
  textSettings: DEFAULT_TEXT_SETTINGS,
  exportSettings: DEFAULT_EXPORT_SETTINGS,
  uiState: INITIAL_UI_STATE,
};

// State reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_FRAME':
      return {
        ...state,
        currentFrame: action.payload,
        imageSlots: {}, // Clear all image slots when switching frames
        uiState: {
          ...state.uiState,
          selectedSlotId: null,
          error: null,
        },
      };

    case 'LOAD_IMAGE_TO_SLOT': {
      const { slotId, file, image } = action.payload;
      const newImageSlot: ImageSlot = {
        id: `${slotId}_${Date.now()}`,
        slotId,
        image,
        originalFile: file,
        scale: 1.0, // 100% scale initially
        position: { x: 0, y: 0 }, // Centered initially
        bounds: { width: image.width, height: image.height },
        isSelected: true,
      };

      // Deselect all other slots
      const updatedSlots = Object.keys(state.imageSlots).reduce(
        (acc, key) => ({
          ...acc,
          [key]: { ...state.imageSlots[key], isSelected: false },
        }),
        {}
      );

      return {
        ...state,
        imageSlots: {
          ...updatedSlots,
          [slotId]: newImageSlot,
        },
        uiState: {
          ...state.uiState,
          selectedSlotId: slotId,
          error: null,
        },
      };
    }

    case 'UPDATE_IMAGE_POSITION': {
      const { slotId, x, y } = action.payload;
      const imageSlot = state.imageSlots[slotId];
      if (!imageSlot) return state;

      return {
        ...state,
        imageSlots: {
          ...state.imageSlots,
          [slotId]: {
            ...imageSlot,
            position: { x, y },
          },
        },
      };
    }

    case 'UPDATE_IMAGE_SCALE': {
      const { slotId, scale } = action.payload;
      const imageSlot = state.imageSlots[slotId];
      if (!imageSlot) return state;

      // Clamp scale between 0.1 and 5.0
      const clampedScale = Math.max(0.1, Math.min(5.0, scale));

      return {
        ...state,
        imageSlots: {
          ...state.imageSlots,
          [slotId]: {
            ...imageSlot,
            scale: clampedScale,
          },
        },
      };
    }

    case 'SELECT_SLOT': {
      const selectedSlotId = action.payload;

      // Update selection state for all slots
      const updatedSlots = Object.keys(state.imageSlots).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...state.imageSlots[key],
            isSelected: key === selectedSlotId,
          },
        }),
        {}
      );

      return {
        ...state,
        imageSlots: updatedSlots,
        uiState: {
          ...state.uiState,
          selectedSlotId,
        },
      };
    }

    case 'UPDATE_TEXT_SETTINGS':
      return {
        ...state,
        textSettings: {
          ...state.textSettings,
          ...action.payload,
        },
      };

    case 'UPDATE_EXPORT_SETTINGS':
      return {
        ...state,
        exportSettings: {
          ...state.exportSettings,
          ...action.payload,
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          isLoading: action.payload.isLoading,
          loadingMessage: action.payload.message ?? null,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          error: action.payload,
          isLoading: false,
        },
      };

    case 'SET_EXPORT_PROGRESS':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          isExporting: action.payload.isExporting,
          exportProgress: action.payload.progress,
        },
      };

    case 'RESET_ALL':
      return {
        ...initialState,
        availableFrames: state.availableFrames, // Keep available frames
      };

    case 'RESET_SELECTED_IMAGE': {
      const { selectedSlotId } = state.uiState;
      if (!selectedSlotId || !state.imageSlots[selectedSlotId]) {
        return state;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [selectedSlotId]: _, ...remainingSlots } = state.imageSlots;

      return {
        ...state,
        imageSlots: remainingSlots,
        uiState: {
          ...state.uiState,
          selectedSlotId: null,
        },
      };
    }

    default:
      return state;
  }
}

// Context types
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context provider component
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Custom hooks for specific state and actions
export const useAppState = (): AppState => {
  const { state } = useAppContext();
  return state;
};

export const useAppActions = (): {
  selectFrame: (frame: FrameTemplate) => void;
  loadImageToSlot: (
    slotId: string,
    file: File,
    image: HTMLImageElement
  ) => void;
  updateImagePosition: (slotId: string, x: number, y: number) => void;
  updateImageScale: (slotId: string, scale: number) => void;
  selectSlot: (slotId: string | null) => void;
  updateTextSettings: (settings: Partial<TextSettings>) => void;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  setExportProgress: (isExporting: boolean, progress: number) => void;
  resetAll: () => void;
  resetSelectedImage: () => void;
} => {
  const { dispatch } = useAppContext();

  return {
    selectFrame: useCallback(
      (frame: FrameTemplate) =>
        dispatch({ type: 'SELECT_FRAME', payload: frame }),
      [dispatch]
    ),

    loadImageToSlot: useCallback(
      (slotId: string, file: File, image: HTMLImageElement) =>
        dispatch({
          type: 'LOAD_IMAGE_TO_SLOT',
          payload: { slotId, file, image },
        }),
      [dispatch]
    ),

    updateImagePosition: useCallback(
      (slotId: string, x: number, y: number) =>
        dispatch({ type: 'UPDATE_IMAGE_POSITION', payload: { slotId, x, y } }),
      [dispatch]
    ),

    updateImageScale: useCallback(
      (slotId: string, scale: number) =>
        dispatch({ type: 'UPDATE_IMAGE_SCALE', payload: { slotId, scale } }),
      [dispatch]
    ),

    selectSlot: useCallback(
      (slotId: string | null) =>
        dispatch({ type: 'SELECT_SLOT', payload: slotId }),
      [dispatch]
    ),

    updateTextSettings: useCallback(
      (settings: Partial<TextSettings>) =>
        dispatch({ type: 'UPDATE_TEXT_SETTINGS', payload: settings }),
      [dispatch]
    ),

    updateExportSettings: useCallback(
      (settings: Partial<ExportSettings>) =>
        dispatch({ type: 'UPDATE_EXPORT_SETTINGS', payload: settings }),
      [dispatch]
    ),

    setLoading: useCallback(
      (isLoading: boolean, message?: string) =>
        dispatch({
          type: 'SET_LOADING',
          payload:
            message !== undefined ? { isLoading, message } : { isLoading },
        }),
      [dispatch]
    ),

    setError: useCallback(
      (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
      [dispatch]
    ),

    setExportProgress: useCallback(
      (isExporting: boolean, progress: number) =>
        dispatch({
          type: 'SET_EXPORT_PROGRESS',
          payload: { isExporting, progress },
        }),
      [dispatch]
    ),

    resetAll: useCallback(() => dispatch({ type: 'RESET_ALL' }), [dispatch]),

    resetSelectedImage: useCallback(
      () => dispatch({ type: 'RESET_SELECTED_IMAGE' }),
      [dispatch]
    ),
  };
};
