/**
 * Cut Editor - Layout Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../Layout';

// Mock child components for testing
const MockImageCanvas = (): React.ReactElement => (
  <div data-testid="image-canvas">Image Canvas</div>
);
MockImageCanvas.displayName = 'ImageCanvas';

const MockSidebar = (): React.ReactElement => (
  <div data-testid="sidebar">Sidebar Content</div>
);
MockSidebar.displayName = 'Sidebar';

describe('Layout Component', () => {
  it('renders with children', () => {
    render(
      <Layout>
        <MockImageCanvas />
        <MockSidebar />
      </Layout>
    );

    expect(screen.getByTestId('image-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('applies correct CSS grid classes', () => {
    const { container } = render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-3');
  });

  it('has correct canvas container structure', () => {
    render(
      <Layout>
        <MockImageCanvas />
      </Layout>
    );

    const canvasContainer = screen.getByTestId('image-canvas').parentElement;
    expect(canvasContainer).toHaveClass('w-full', 'h-full', 'relative');
  });

  it('separates ImageCanvas from other children', () => {
    render(
      <Layout>
        <MockImageCanvas />
        <MockSidebar />
      </Layout>
    );

    // ImageCanvas should be in the left column
    const imageCanvas = screen.getByTestId('image-canvas');
    expect(imageCanvas.closest('.lg\\:col-span-2')).toBeInTheDocument();

    // Other content should be in the right column
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.closest('.lg\\:col-span-2')).not.toBeInTheDocument();
  });
});
