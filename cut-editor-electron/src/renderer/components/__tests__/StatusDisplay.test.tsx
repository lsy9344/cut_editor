/**
 * Cut Editor - StatusDisplay Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusDisplay from '../StatusDisplay';

describe('StatusDisplay', () => {
  const defaultProps = {
    error: null,
    loadingMessage: null,
    isLoading: false,
    isExporting: false,
    exportProgress: 0,
    onClearError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when no status to display', () => {
    const { container } = render(<StatusDisplay {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays error message', () => {
    render(
      <StatusDisplay
        {...defaultProps}
        error="Test error message"
      />
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('allows error dismissal via button', () => {
    const onClearError = jest.fn();
    render(
      <StatusDisplay
        {...defaultProps}
        error="Test error"
        onClearError={onClearError}
      />
    );

    const dismissButton = screen.getByLabelText('Dismiss error');
    fireEvent.click(dismissButton);

    expect(onClearError).toHaveBeenCalledTimes(1);
  });

  it('displays loading state', () => {
    render(
      <StatusDisplay
        {...defaultProps}
        isLoading={true}
        loadingMessage="Processing..."
      />
    );

    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('displays default loading message when none provided', () => {
    render(
      <StatusDisplay
        {...defaultProps}
        isLoading={true}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays export progress', () => {
    render(
      <StatusDisplay
        {...defaultProps}
        isExporting={true}
        exportProgress={45}
      />
    );

    expect(screen.getByText('Exporting... 45%')).toBeInTheDocument();
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '45');
  });

  it('supports keyboard dismissal with Escape key', () => {
    const onClearError = jest.fn();
    render(
      <StatusDisplay
        {...defaultProps}
        error="Test error"
        onClearError={onClearError}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClearError).toHaveBeenCalledTimes(1);
  });
});