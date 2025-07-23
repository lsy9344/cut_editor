/**
 * Cut Editor - Header Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

describe('Header Component', () => {
  const defaultProps = {
    title: 'Test App',
    version: '1.0.0',
  };

  it('renders header with title and version', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('displays ready status indicator', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<Header {...defaultProps} />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'bg-white',
      'border-b',
      'border-gray-200',
      'shadow-sm'
    );
  });

  it('renders version badge with correct styling', () => {
    render(<Header {...defaultProps} />);

    const versionBadge = screen.getByText('v1.0.0');
    expect(versionBadge).toHaveClass('bg-blue-100', 'text-blue-800');
  });
});
