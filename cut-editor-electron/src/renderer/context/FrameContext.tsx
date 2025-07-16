import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { FrameData, FrameTemplate, ImageFile, TextData } from '../../shared/types';
import { getFrameTemplate } from '../../shared/data/frameTemplates';

interface FrameState {
  currentFrame?: FrameTemplate;
  frameData?: FrameData;
  selectedSlot?: string;
  isLoading: boolean;
  error?: string;
}

type FrameAction =
  | { type: 'SET_FRAME'; payload: FrameTemplate }
  | { type: 'ADD_IMAGE_TO_SLOT'; payload: { slotId: string; image: ImageFile } }
  | { type: 'REMOVE_IMAGE_FROM_SLOT'; payload: string }
  | { type: 'ADD_TEXT_TO_SLOT'; payload: { slotId: string; text: TextData } }
  | { type: 'UPDATE_TEXT'; payload: { slotId: string; text: TextData } }
  | { type: 'REMOVE_TEXT_FROM_SLOT'; payload: string }
  | { type: 'SET_SELECTED_SLOT'; payload: string }
  | { type: 'CLEAR_SELECTED_SLOT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const defaultFrame = getFrameTemplate('2-frame');
const initialState: FrameState = {
  currentFrame: defaultFrame,
  frameData: {
    template: defaultFrame,
    images: {},
    texts: {},
  },
  isLoading: false,
};

const frameReducer = (state: FrameState, action: FrameAction): FrameState => {
  switch (action.type) {
    case 'SET_FRAME':
      return {
        ...state,
        currentFrame: action.payload,
        frameData: {
          template: action.payload,
          images: {},
          texts: {},
        },
      };

    case 'ADD_IMAGE_TO_SLOT':
      if (!state.frameData) return state;
      return {
        ...state,
        frameData: {
          ...state.frameData,
          images: {
            ...state.frameData.images,
            [action.payload.slotId]: action.payload.image,
          },
        },
      };

    case 'REMOVE_IMAGE_FROM_SLOT': {
      if (!state.frameData) return state;
      const newImages = { ...state.frameData.images };
      delete newImages[action.payload];
      return {
        ...state,
        frameData: {
          ...state.frameData,
          images: newImages,
        },
      };
    }

    case 'ADD_TEXT_TO_SLOT':
      if (!state.frameData) return state;
      return {
        ...state,
        frameData: {
          ...state.frameData,
          texts: {
            ...state.frameData.texts,
            [action.payload.slotId]: action.payload.text,
          },
        },
      };

    case 'UPDATE_TEXT':
      if (!state.frameData) return state;
      return {
        ...state,
        frameData: {
          ...state.frameData,
          texts: {
            ...state.frameData.texts,
            [action.payload.slotId]: action.payload.text,
          },
        },
      };

    case 'REMOVE_TEXT_FROM_SLOT': {
      if (!state.frameData) return state;
      const newTexts = { ...state.frameData.texts };
      delete newTexts[action.payload];
      return {
        ...state,
        frameData: {
          ...state.frameData,
          texts: newTexts,
        },
      };
    }

    case 'SET_SELECTED_SLOT':
      return {
        ...state,
        selectedSlot: action.payload,
      };

    case 'CLEAR_SELECTED_SLOT': {
      const newState = { ...state };
      delete newState.selectedSlot;
      return newState;
    }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_ERROR': {
      const newState = { ...state };
      delete newState.error;
      return newState;
    }

    default:
      return state;
  }
};

interface FrameContextType {
  state: FrameState;
  setFrame: (frame: FrameTemplate) => void;
  addImageToSlot: (slotId: string, image: ImageFile) => void;
  removeImageFromSlot: (slotId: string) => void;
  addTextToSlot: (slotId: string, text: TextData) => void;
  updateText: (slotId: string, text: TextData) => void;
  removeTextFromSlot: (slotId: string) => void;
  setSelectedSlot: (slotId: string) => void;
  clearSelectedSlot: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

const FrameContext = createContext<FrameContextType | undefined>(undefined);

export const useFrame = () => {
  const context = useContext(FrameContext);
  if (!context) {
    throw new Error('useFrame must be used within a FrameProvider');
  }
  return context;
};

interface FrameProviderProps {
  children: ReactNode;
}

export const FrameProvider: React.FC<FrameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(frameReducer, initialState);

  const setFrame = (frame: FrameTemplate) => {
    dispatch({ type: 'SET_FRAME', payload: frame });
  };

  const addImageToSlot = (slotId: string, image: ImageFile) => {
    dispatch({ type: 'ADD_IMAGE_TO_SLOT', payload: { slotId, image } });
  };

  const removeImageFromSlot = (slotId: string) => {
    dispatch({ type: 'REMOVE_IMAGE_FROM_SLOT', payload: slotId });
  };

  const addTextToSlot = (slotId: string, text: TextData) => {
    dispatch({ type: 'ADD_TEXT_TO_SLOT', payload: { slotId, text } });
  };

  const updateText = (slotId: string, text: TextData) => {
    dispatch({ type: 'UPDATE_TEXT', payload: { slotId, text } });
  };

  const removeTextFromSlot = (slotId: string) => {
    dispatch({ type: 'REMOVE_TEXT_FROM_SLOT', payload: slotId });
  };

  const setSelectedSlot = (slotId: string) => {
    dispatch({ type: 'SET_SELECTED_SLOT', payload: slotId });
  };

  const clearSelectedSlot = () => {
    dispatch({ type: 'CLEAR_SELECTED_SLOT' });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: FrameContextType = {
    state,
    setFrame,
    addImageToSlot,
    removeImageFromSlot,
    addTextToSlot,
    updateText,
    removeTextFromSlot,
    setSelectedSlot,
    clearSelectedSlot,
    setLoading,
    setError,
    clearError,
  };

  return <FrameContext.Provider value={value}>{children}</FrameContext.Provider>;
};
