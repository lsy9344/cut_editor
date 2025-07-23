/**
 * Cut Editor - Sidebar Component
 * Container component for the control panel with collapsible sections
 */

import React, { memo } from 'react';
import { SidebarProps } from '../../shared/types';

const Sidebar: React.FC<SidebarProps> = memo(({ children, className = '' }) => {
  return (
    <div
      className={`h-full flex flex-col bg-gray-50 ${className}`}
      role="complementary"
      aria-label="Control panel"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;