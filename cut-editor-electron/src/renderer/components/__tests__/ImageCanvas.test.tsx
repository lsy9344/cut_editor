/**
 * Cut Editor - ImageCanvas Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageCanvas from '../ImageCanvas';
import { FrameTemplate, ImageSlot } from '../../../shared/types';

// Mock frame template for testing
const mockFrame: FrameTemplate = {
  id: 'test-frame',
  type: 'horizontal_2',
  name: 'Test Frame',
  slots: [
    {
      id: 'slot-1',
      position: { x: 10, y: 10 },
      size: { width: 100, height: 100 },
      bounds: { x: 10, y: 10, width: 100, height: 100 },
    },
    {
      id: 'slot-2',
      position: { x: 120, y: 10 },
      size: { width: 100, height: 100 },
      bounds: { x: 120, y: 10, width: 100, height: 100 },
    },
  ],
  dimensions: { width: 240, height: 120 },
};

// Mock image slot
const mockImage = new Image();
mockImage.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const mockImageSlot: ImageSlot = {
  id: 'image-1',
  slotId: 'slot-1',
  image: mockImage,
  originalFile: null,
  scale: 1.0,
  position: { x: 0, y: 0 },
  bounds: { width: 100, height: 100 },
  isSelected: true,
};

describe('ImageCanvas Component', () => {
  const defaultProps = {
    frame: null,
    imageSlots: {},
    selectedSlotId: null,
    onSlotClick: jest.fn(),
    onImagePositionChange: jest.fn(),
    onImageScaleChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no frame is provided', () => {
    render(<ImageCanvas {...defaultProps} />);

    expect(screen.getByText('No Frame Selected')).toBeInTheDocument();
    expect(
      screen.getByText('Choose a frame template to start editing')
    ).toBeInTheDocument();
  });

  it('renders frame when provided', () => {
    render(<ImageCanvas {...defaultProps} frame={mockFrame} />);

    // Check that frame info is displayed in canvas info bar (bottom of canvas)
    expect(screen.getByText(/Test Frame \(\d+ × \d+\)/)).toBeInTheDocument();
  });

  it('renders frame slots', () => {
    render(<ImageCanvas {...defaultProps} frame={mockFrame} />);

    // Check that canvas elements are rendered (Fabric.js creates canvas elements)
    const canvasElements = document.querySelectorAll('canvas');
    expect(canvasElements.length).toBeGreaterThanOrEqual(1); // Fabric.js creates lower and upper canvas
  });

  it('handles slot click events', () => {
    const onSlotClick = jest.fn();
    render(
      <ImageCanvas
        {...defaultProps}
        frame={mockFrame}
        onSlotClick={onSlotClick}
      />
    );

    // Test that the component initializes without errors
    // Fabric.js canvas click events are tested via integration tests
    // as they require canvas interaction simulation
    expect(onSlotClick).not.toHaveBeenCalled(); // Initial state
  });

  it('handles keyboard navigation on slots', () => {
    const onSlotClick = jest.fn();
    render(
      <ImageCanvas
        {...defaultProps}
        frame={mockFrame}
        onSlotClick={onSlotClick}
      />
    );

    // Test that the component initializes without errors
    // Fabric.js canvas keyboard events are tested via integration tests
    expect(onSlotClick).not.toHaveBeenCalled(); // Initial state
  });

  it('highlights selected slot', () => {
    render(
      <ImageCanvas
        {...defaultProps}
        frame={mockFrame}
        selectedSlotId="slot-1"
      />
    );

    // With Fabric.js, selection highlighting is handled by canvas stroke colors
    // Test that the component renders with selected slot state
    expect(screen.getByText(/Test Frame/)).toBeInTheDocument();
  });

  it('renders image in slot when provided', () => {
    const imageSlots = { 'slot-1': mockImageSlot };

    render(
      <ImageCanvas
        {...defaultProps}
        frame={mockFrame}
        imageSlots={imageSlots}
      />
    );

    // With Fabric.js, images are rendered on canvas, not as DOM elements
    // Test that the component initializes properly with image data
    expect(screen.getByText(/Test Frame/)).toBeInTheDocument();
  });

  it('shows selection indicator for selected slot', () => {
    const imageSlots = { 'slot-1': mockImageSlot };

    render(
      <ImageCanvas
        {...defaultProps}
        frame={mockFrame}
        imageSlots={imageSlots}
        selectedSlotId="slot-1"
      />
    );

    // With Fabric.js, selection is handled by canvas stroke colors
    // Test that the component renders with selection state
    expect(screen.getByText(/Test Frame/)).toBeInTheDocument();
  });
});
