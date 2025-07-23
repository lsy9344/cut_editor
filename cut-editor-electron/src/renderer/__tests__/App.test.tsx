/**
 * Cut Editor - App Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders the Cut Editor title', () => {
    render(<App />);

    const titleElement = screen.getByText('Cut Editor');
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the header with version', () => {
    render(<App />);

    expect(screen.getByText('v2.0.0')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('renders sidebar control sections', () => {
    render(<App />);

    expect(screen.getByText('Frame Layout')).toBeInTheDocument();
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText('Text Settings')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders empty canvas state', () => {
    render(<App />);

    expect(screen.getByText('No Frame Selected')).toBeInTheDocument();
  });
});
