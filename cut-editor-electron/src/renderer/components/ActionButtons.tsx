/**
 * Cut Editor - Action Buttons Component
 * Reset, Apply Text, and Export functionality buttons
 */

import React, { memo, useCallback, useState } from 'react';
import { ActionButtonsProps } from '../../shared/types';

const ActionButtons: React.FC<ActionButtonsProps> = memo(({
  onReset,
  onResetSelected,
  onApplyText,
  onExport,
  isLoading,
  isExporting,
  exportProgress,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetSelectedConfirm, setShowResetSelectedConfirm] = useState(false);

  // Handle reset all with confirmation
  const handleResetAll = useCallback(() => {
    if (showResetConfirm) {
      onReset();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  }, [onReset, showResetConfirm]);

  // Handle reset selected with confirmation
  const handleResetSelected = useCallback(() => {
    if (showResetSelectedConfirm) {
      onResetSelected();
      setShowResetSelectedConfirm(false);
    } else {
      setShowResetSelectedConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowResetSelectedConfirm(false), 3000);
    }
  }, [onResetSelected, showResetSelectedConfirm]);

  // Handle apply text
  const handleApplyText = useCallback(() => {
    onApplyText();
  }, [onApplyText]);

  // Handle export
  const handleExport = useCallback(() => {
    if (!isExporting) {
      onExport();
    }
  }, [onExport, isExporting]);

  const isDisabled = isLoading || isExporting;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Actions</h3>

      <div className="space-y-3">
        {/* Apply Text Button */}
        <button
          type="button"
          onClick={handleApplyText}
          disabled={isDisabled}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Applying...
            </>
          ) : (
            <>
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
              Apply Text
            </>
          )}
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={handleExport}
          disabled={isDisabled}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Exporting... {Math.round(exportProgress)}%
            </>
          ) : (
            <>
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download/Export
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gray-50 px-2 text-gray-500">Reset Options</span>
          </div>
        </div>

        {/* Reset Selected Button */}
        <button
          type="button"
          onClick={handleResetSelected}
          disabled={isDisabled}
          className={`w-full flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            showResetSelectedConfirm
              ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500'
          }`}
        >
          {showResetSelectedConfirm ? (
            <>
              <svg
                className="-ml-1 mr-2 h-4 w-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              Click again to confirm
            </>
          ) : (
            <>
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Reset Selected Image
            </>
          )}
        </button>

        {/* Reset All Button */}
        <button
          type="button"
          onClick={handleResetAll}
          disabled={isDisabled}
          className={`w-full flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            showResetConfirm
              ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500'
          }`}
        >
          {showResetConfirm ? (
            <>
              <svg
                className="-ml-1 mr-2 h-4 w-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              Click again to confirm
            </>
          ) : (
            <>
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset All
            </>
          )}
        </button>

        {/* Export Progress Bar (when exporting) */}
        {isExporting && (
          <div className="mt-3">
            <div className="bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${exportProgress}%` }}
                role="progressbar"
                aria-valuenow={exportProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Export progress: ${Math.round(exportProgress)}% complete`}
              />
            </div>
            <div className="text-center text-xs text-gray-600 mt-1">
              {Math.round(exportProgress)}% complete
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;