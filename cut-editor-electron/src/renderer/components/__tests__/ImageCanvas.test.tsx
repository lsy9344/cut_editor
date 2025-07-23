/**
 * Cut Editor - ImageCanvas Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageCanvas from '../ImageCanvas';
import { FrameTemplate, ImageSlot } from '../../../shared/types';

// Mock frame template for testing
const mockFrame: FrameTemplate = {
  id: 'test-frame',
  type: 'horizontal_2',
  name: 'Test Frame',
  imagePath: '/test/frame.png',
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

    // Check that slots are rendered (they should have "Add Image" text)
    const addImageElements = screen.getAllByText('Add Image');
    expect(addImageElements).toHaveLength(2); // Two slots in mock frame
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

    const slotElements = screen.getAllByRole('button');
    if (slotElements[0]) {
      fireEvent.click(slotElements[0]);
    }

    expect(onSlotClick).toHaveBeenCalledWith('slot-1');
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

    const slotElements = screen.getAllByRole('button');
    if (slotElements[0]) {
      fireEvent.keyDown(slotElements[0], { key: 'Enter' });
    }

    expect(onSlotClick).toHaveBeenCalledWith('slot-1');
  });

  it('highlights selected slot', () => {
    render(
      <ImageCanvas
        {...defaultProps}
        frame={mockFrame}
        selectedSlotId="slot-1"
      />
    );

    const slotElements = screen.getAllByRole('button');
    expect(slotElements[0]).toHaveClass('border-blue-500');
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

    const imageElement = screen.getByAltText('Loaded content');
    expect(imageElement).toBeInTheDocument();
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

    // Selection indicator should be present (blue dot)
    const selectedSlot = screen.getAllByRole('button')[0];
    if (selectedSlot) {
      const indicator = selectedSlot.querySelector('.bg-blue-500.rounded-full');
      expect(indicator).toBeInTheDocument();
    }
  });
});
