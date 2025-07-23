/**
 * Cut Editor - Layout Component
 * Main application layout with responsive CSS Grid (2-column)
 */

import React, { memo, Children, ReactElement } from 'react';
import { LayoutProps } from '../../shared/types';

const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  // Helper function to check if a child is ImageCanvas
  const isImageCanvas = (child: ReactElement): boolean => {
    return (
      (child?.type as { displayName?: string })?.displayName === 'ImageCanvas'
    );
  };

  // Filter children into ImageCanvas and others
  const childrenArray = Children.toArray(children) as ReactElement[];
  const imageCanvasChild = childrenArray.find(isImageCanvas);
  const sidebarChildren = childrenArray.filter(child => !isImageCanvas(child));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex flex-col">
        {/* Main content area with CSS Grid */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden">
          {/* Left side - Canvas area (2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-white border-r border-gray-200 flex flex-col">
            <div className="flex-1 overflow-hidden">
              {/* Canvas will be rendered here */}
              <div id="canvas-container" className="w-full h-full relative">
                {imageCanvasChild}
              </div>
            </div>
          </div>

          {/* Right side - Controls and sidebar (1/3 width on large screens) */}
          <div className="bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {/* Sidebar content will be rendered here */}
                {sidebarChildren}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
