/**
 * Cut Editor - FrameSelector Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FrameSelector from '../FrameSelector';
import { FrameTemplate } from '../../../shared/types';

const mockFrames: FrameTemplate[] = [
  {
    id: 'horizontal_2',
    type: 'horizontal_2',
    name: '2 Panel Horizontal',
    dimensions: { width: 800, height: 400 },
    slots: [
      {
        id: 'slot_1',
        position: { x: 0, y: 0 },
        size: { width: 400, height: 400 },
        bounds: { x: 0, y: 0, width: 400, height: 400 },
      },
      {
        id: 'slot_2',
        position: { x: 400, y: 0 },
        size: { width: 400, height: 400 },
        bounds: { x: 400, y: 0, width: 400, height: 400 },
      },
    ],
  },
  {
    id: 'vertical_2',
    type: 'vertical_2',
    name: '2 Panel Vertical',
    dimensions: { width: 400, height: 800 },
    slots: [
      {
        id: 'slot_1',
        position: { x: 0, y: 0 },
        size: { width: 400, height: 400 },
        bounds: { x: 0, y: 0, width: 400, height: 400 },
      },
      {
        id: 'slot_2',
        position: { x: 0, y: 400 },
        size: { width: 400, height: 400 },
        bounds: { x: 0, y: 400, width: 400, height: 400 },
      },
    ],
  },
];

describe('FrameSelector', () => {
  const defaultProps = {
    availableFrames: mockFrames,
    currentFrame: null,
    onFrameSelect: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders frame templates', () => {
    render(<FrameSelector {...defaultProps} />);

    expect(screen.getByText('2 Panel Horizontal')).toBeInTheDocument();
    expect(screen.getByText('2 Panel Vertical')).toBeInTheDocument();
  });

  it('displays loading skeleton when loading', () => {
    render(<FrameSelector {...defaultProps} isLoading={true} />);

    expect(screen.getByText('Frame Layout')).toBeInTheDocument();
    // Loading skeleton should be rendered (gray boxes)
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('handles frame selection', () => {
    const onFrameSelect = jest.fn();
    render(<FrameSelector {...defaultProps} onFrameSelect={onFrameSelect} />);

    const frameButton = screen.getByLabelText(
      'Select 2 Panel Horizontal layout with 2 slots'
    );
    fireEvent.click(frameButton);

    expect(onFrameSelect).toHaveBeenCalledWith(mockFrames[0]);
  });

  it('shows selected frame with visual indicator', () => {
    render(
      <FrameSelector {...defaultProps} currentFrame={mockFrames[0] ?? null} />
    );

    const frameButton = screen.getByLabelText(
      'Select 2 Panel Horizontal layout with 2 slots'
    );
    expect(frameButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports keyboard navigation', () => {
    const onFrameSelect = jest.fn();
    render(<FrameSelector {...defaultProps} onFrameSelect={onFrameSelect} />);

    const frameButton = screen.getByLabelText(
      'Select 2 Panel Horizontal layout with 2 slots'
    );
    fireEvent.keyDown(frameButton, { key: 'Enter' });

    expect(onFrameSelect).toHaveBeenCalledWith(mockFrames[0]);
  });

  it('displays slot count for selected frame', () => {
    render(
      <FrameSelector {...defaultProps} currentFrame={mockFrames[0] ?? null} />
    );

    expect(screen.getByText('2 slots')).toBeInTheDocument();
  });

  it('shows empty state when no frames available', () => {
    render(<FrameSelector {...defaultProps} availableFrames={[]} />);

    expect(
      screen.getByText('No frame templates available')
    ).toBeInTheDocument();
  });

  it('disables interaction when loading', () => {
    const onFrameSelect = jest.fn();
    render(
      <FrameSelector
        {...defaultProps}
        onFrameSelect={onFrameSelect}
        isLoading={true}
      />
    );

    // Should not find interactive elements when loading
    const frameButtons = screen.queryAllByRole('button');
    expect(frameButtons).toHaveLength(0);
  });
});
