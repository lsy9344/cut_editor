/**
 * Cut Editor - ActionButtons Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionButtons from '../ActionButtons';

describe('ActionButtons', () => {
  const defaultProps = {
    onReset: jest.fn(),
    onResetSelected: jest.fn(),
    onApplyText: jest.fn(),
    onExport: jest.fn(),
    isLoading: false,
    isExporting: false,
    exportProgress: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all action buttons', () => {
    render(<ActionButtons {...defaultProps} />);

    expect(screen.getByText('Apply Text')).toBeInTheDocument();
    expect(screen.getByText('Download/Export')).toBeInTheDocument();
    expect(screen.getByText('Reset Selected Image')).toBeInTheDocument();
    expect(screen.getByText('Reset All')).toBeInTheDocument();
  });

  it('handles apply text action', () => {
    const onApplyText = jest.fn();
    render(<ActionButtons {...defaultProps} onApplyText={onApplyText} />);

    const applyButton = screen.getByText('Apply Text');
    fireEvent.click(applyButton);

    expect(onApplyText).toHaveBeenCalledTimes(1);
  });

  it('handles export action', () => {
    const onExport = jest.fn();
    render(<ActionButtons {...defaultProps} onExport={onExport} />);

    const exportButton = screen.getByText('Download/Export');
    fireEvent.click(exportButton);

    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it('requires confirmation for reset selected', () => {
    const onResetSelected = jest.fn();
    render(
      <ActionButtons {...defaultProps} onResetSelected={onResetSelected} />
    );

    const resetButton = screen.getByText('Reset Selected Image');

    // First click - shows confirmation
    fireEvent.click(resetButton);
    expect(screen.getByText('Click again to confirm')).toBeInTheDocument();
    expect(onResetSelected).not.toHaveBeenCalled();

    // Second click - executes action
    fireEvent.click(resetButton);
    expect(onResetSelected).toHaveBeenCalledTimes(1);
  });

  it('requires confirmation for reset all', () => {
    const onReset = jest.fn();
    render(<ActionButtons {...defaultProps} onReset={onReset} />);

    const resetButton = screen.getByText('Reset All');

    // First click - shows confirmation
    fireEvent.click(resetButton);
    expect(screen.getByText('Click again to confirm')).toBeInTheDocument();
    expect(onReset).not.toHaveBeenCalled();

    // Second click - executes action
    fireEvent.click(resetButton);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('shows loading state for apply text', () => {
    render(<ActionButtons {...defaultProps} isLoading={true} />);

    expect(screen.getByText('Applying...')).toBeInTheDocument();

    const applyButton = screen.getByText('Applying...');
    expect(applyButton).toBeDisabled();
  });

  it('shows export progress', () => {
    render(
      <ActionButtons {...defaultProps} isExporting={true} exportProgress={75} />
    );

    expect(screen.getByText('Exporting... 75%')).toBeInTheDocument();

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  it('disables buttons when loading', () => {
    render(<ActionButtons {...defaultProps} isLoading={true} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('disables buttons when exporting', () => {
    render(<ActionButtons {...defaultProps} isExporting={true} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('auto-hides confirmation after timeout', async () => {
    jest.useFakeTimers();

    render(<ActionButtons {...defaultProps} />);

    const resetButton = screen.getByText('Reset All');
    fireEvent.click(resetButton);

    expect(screen.getByText('Click again to confirm')).toBeInTheDocument();

    // Fast-forward time
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(
        screen.queryByText('Click again to confirm')
      ).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
