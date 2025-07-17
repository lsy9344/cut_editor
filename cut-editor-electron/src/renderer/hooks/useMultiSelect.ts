import { useCallback, useEffect } from 'react';
import { useFrame } from '../context/FrameContext';
import { SelectionMode } from '../../shared/types';

export interface UseMultiSelectReturn {
  selectedSlots: string[];
  selectionMode: SelectionMode;
  isMultiSelecting: boolean;
  toggleSlotSelection: (slotId: string) => void;
  setSelectionMode: (mode: SelectionMode) => void;
  clearSelection: () => void;
  selectAll: () => void;
  isSlotSelected: (slotId: string) => boolean;
  getSelectedCount: () => number;
}

export const useMultiSelect = (): UseMultiSelectReturn => {
  const { state, toggleSlotSelection, setSelectionMode, clearSelectedSlots, setSelectedSlots } =
    useFrame();

  const { multiSelect, currentFrame } = state;

  const clearSelection = useCallback(() => {
    clearSelectedSlots();
  }, [clearSelectedSlots]);

  const selectAll = useCallback(() => {
    if (currentFrame && multiSelect.selectionMode === 'multi') {
      const allSlotIds = currentFrame.slots.map(slot => slot.id);
      setSelectedSlots(allSlotIds);
    }
  }, [currentFrame, multiSelect.selectionMode, setSelectedSlots]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+A to select all slots
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault();
        selectAll();
      }
      // Escape to clear selection
      if (event.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, selectAll]);

  const isSlotSelected = useCallback(
    (slotId: string): boolean => multiSelect.selectedSlots.includes(slotId),
    [multiSelect.selectedSlots],
  );

  const getSelectedCount = useCallback(
    (): number => multiSelect.selectedSlots.length,
    [multiSelect.selectedSlots],
  );

  const handleToggleSlotSelection = useCallback(
    (slotId: string) => {
      toggleSlotSelection(slotId);
    },
    [toggleSlotSelection],
  );

  const handleSetSelectionMode = useCallback(
    (mode: SelectionMode) => {
      setSelectionMode(mode);
    },
    [setSelectionMode],
  );

  return {
    selectedSlots: multiSelect.selectedSlots,
    selectionMode: multiSelect.selectionMode,
    isMultiSelecting: multiSelect.isMultiSelecting,
    toggleSlotSelection: handleToggleSlotSelection,
    setSelectionMode: handleSetSelectionMode,
    clearSelection,
    selectAll,
    isSlotSelected,
    getSelectedCount,
  };
};
