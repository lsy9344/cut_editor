import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import {
  BatchDropResult,
  DropPlanItem,
  FrameData,
  FrameTemplate,
  ImageFile,
  MultiSelectState,
  SelectionMode,
  TextData,
} from '../../shared/types';
import { getFrameTemplate } from '../../shared/data/frameTemplates';

interface FrameState {
  currentFrame?: FrameTemplate;
  frameData?: FrameData;
  selectedSlot?: string;
  isLoading: boolean;
  error?: string;
  multiSelect: MultiSelectState;
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
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_SELECTION_MODE'; payload: SelectionMode }
  | { type: 'TOGGLE_SLOT_SELECTION'; payload: string }
  | { type: 'SET_SELECTED_SLOTS'; payload: string[] }
  | { type: 'CLEAR_SELECTED_SLOTS' }
  | { type: 'SET_DROP_PLAN'; payload: DropPlanItem[] }
  | { type: 'UPDATE_DROP_PLAN_ITEM'; payload: { index: number; item: DropPlanItem } }
  | { type: 'CLEAR_DROP_PLAN' }
  | { type: 'SET_EXECUTING_PLAN'; payload: boolean }
  | { type: 'BATCH_ADD_IMAGES'; payload: { slotIds: string[]; images: ImageFile[] } };

const defaultFrame = getFrameTemplate('2-frame');
const initialState: FrameState = {
  currentFrame: defaultFrame,
  frameData: {
    template: defaultFrame,
    images: {},
    texts: {},
  },
  isLoading: false,
  multiSelect: {
    selectedSlots: [],
    selectionMode: 'single',
    isMultiSelecting: false,
    dropPlan: [],
    isExecutingPlan: false,
  },
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

    case 'SET_SELECTION_MODE':
      return {
        ...state,
        multiSelect: {
          ...state.multiSelect,
          selectionMode: action.payload,
          selectedSlots: action.payload === 'single' ? [] : state.multiSelect.selectedSlots,
        },
      };

    case 'TOGGLE_SLOT_SELECTION': {
      const { selectedSlots, selectionMode } = state.multiSelect;
      const slotId = action.payload;
      let newSelectedSlots: string[];

      if (selectionMode === 'single') {
        newSelectedSlots = selectedSlots.includes(slotId) ? [] : [slotId];
      } else {
        newSelectedSlots = selectedSlots.includes(slotId)
          ? selectedSlots.filter(id => id !== slotId)
          : [...selectedSlots, slotId];
      }

      return {
        ...state,
        multiSelect: {
          ...state.multiSelect,
          selectedSlots: newSelectedSlots,
        },
      };
    }

    case 'SET_SELECTED_SLOTS':
      return {
        ...state,
        multiSelect: {
          ...state.multiSelect,
          selectedSlots: action.payload,
        },
      };

    case 'CLEAR_SELECTED_SLOTS':
      return {
        ...state,
        multiSelect: {
          ...state.multiSelect,
          selectedSlots: [],
        },
      };

    case 'SET_DROP_PLAN':
      return {
        ...state,
        multiSelect: {
          ...state.multiSelect,
          dropPlan: action.payload,
        },
      };

    case 'UPDATE_DROP_PLAN_ITEM': {
      const { index, item } = action.payload;
      const newDropPlan = [...state.multiSelect.dropPlan];
      newDropPlan[index] = item;
      return {
        ...state,
        multiSelect: {
          ...state.multiSelect,
          dropPlan: newDropPlan,
        },
      };
    }

    case 'CLEAR_DROP_PLAN':
      return {
        ...state,
        multiSelect: {
          ...state.multiSelect,
          dropPlan: [],
        },
      };

    case 'SET_EXECUTING_PLAN':
      return {
        ...state,
        multiSelect: {
          ...state.multiSelect,
          isExecutingPlan: action.payload,
        },
      };

    case 'BATCH_ADD_IMAGES': {
      if (!state.frameData) return state;
      const { slotIds, images } = action.payload;
      const newImages = { ...state.frameData.images };

      // Add images to corresponding slots
      slotIds.forEach((slotId, index) => {
        if (images[index]) {
          newImages[slotId] = images[index];
        }
      });

      return {
        ...state,
        frameData: {
          ...state.frameData,
          images: newImages,
        },
      };
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
  // Multi-select functionality
  setSelectionMode: (mode: SelectionMode) => void;
  toggleSlotSelection: (slotId: string) => void;
  setSelectedSlots: (slotIds: string[]) => void;
  clearSelectedSlots: () => void;
  setDropPlan: (plan: DropPlanItem[]) => void;
  updateDropPlanItem: (index: number, item: DropPlanItem) => void;
  clearDropPlan: () => void;
  setExecutingPlan: (executing: boolean) => void;
  batchAddImages: (slotIds: string[], images: ImageFile[]) => void;
  executeBatchDrop: (files: File[], slotIds: string[]) => Promise<BatchDropResult>;
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

  // Multi-select functionality
  const setSelectionMode = (mode: SelectionMode) => {
    dispatch({ type: 'SET_SELECTION_MODE', payload: mode });
  };

  const toggleSlotSelection = (slotId: string) => {
    dispatch({ type: 'TOGGLE_SLOT_SELECTION', payload: slotId });
  };

  const setSelectedSlots = (slotIds: string[]) => {
    dispatch({ type: 'SET_SELECTED_SLOTS', payload: slotIds });
  };

  const clearSelectedSlots = () => {
    dispatch({ type: 'CLEAR_SELECTED_SLOTS' });
  };

  const setDropPlan = (plan: DropPlanItem[]) => {
    dispatch({ type: 'SET_DROP_PLAN', payload: plan });
  };

  const updateDropPlanItem = (index: number, item: DropPlanItem) => {
    dispatch({ type: 'UPDATE_DROP_PLAN_ITEM', payload: { index, item } });
  };

  const clearDropPlan = () => {
    dispatch({ type: 'CLEAR_DROP_PLAN' });
  };

  const setExecutingPlan = (executing: boolean) => {
    dispatch({ type: 'SET_EXECUTING_PLAN', payload: executing });
  };

  const batchAddImages = (slotIds: string[], images: ImageFile[]) => {
    dispatch({ type: 'BATCH_ADD_IMAGES', payload: { slotIds, images } });
  };

  const executeBatchDrop = (files: File[], slotIds: string[]): Promise<BatchDropResult> =>
    new Promise(resolve => {
      const result: BatchDropResult = {
        success: true,
        completed: 0,
        total: Math.min(files.length, slotIds.length),
        errors: [],
      };

      setExecutingPlan(true);

      try {
        const processedImages: ImageFile[] = [];
        const validSlotIds: string[] = [];

        // Process each file
        for (let i = 0; i < Math.min(files.length, slotIds.length); i++) {
          const file = files[i];
          const slotId = slotIds[i];

          if (!file || !slotId) {
            continue;
          }

          try {
            // Convert file to ImageFile format
            const imageFile: ImageFile = {
              name: file.name,
              path: file.name, // In browser environment, use name as path
              data: URL.createObjectURL(file),
              size: file.size,
            };

            processedImages.push(imageFile);
            validSlotIds.push(slotId);
            result.completed++;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            result.errors.push({
              slotId,
              error: errorMessage,
            });
            result.success = false;
          }
        }

        // Batch add all successfully processed images
        if (processedImages.length > 0) {
          batchAddImages(validSlotIds, processedImages);
        }
      } catch (error) {
        result.success = false;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push({
          slotId: 'batch',
          error: errorMessage,
        });
      } finally {
        setExecutingPlan(false);
      }

      resolve(result);
    });

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
    setSelectionMode,
    toggleSlotSelection,
    setSelectedSlots,
    clearSelectedSlots,
    setDropPlan,
    updateDropPlanItem,
    clearDropPlan,
    setExecutingPlan,
    batchAddImages,
    executeBatchDrop,
  };

  return <FrameContext.Provider value={value}>{children}</FrameContext.Provider>;
};
