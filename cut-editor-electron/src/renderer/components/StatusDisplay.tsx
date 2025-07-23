/**
 * Cut Editor - Status Display Component
 * Displays error messages, loading states, and progress feedback
 */

import React, { memo, useEffect, useCallback } from 'react';
import { StatusDisplayProps } from '../../shared/types';

const StatusDisplay: React.FC<StatusDisplayProps> = memo(({
  error,
  loadingMessage,
  isLoading,
  isExporting,
  exportProgress,
  onClearError,
}) => {
  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [error, onClearError]);

  // Handle escape key to dismiss error
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && error) {
        onClearError();
      }
    },
    [error, onClearError]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Don't render if nothing to show
  if (!error && !isLoading && !isExporting && !loadingMessage) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Error Display */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 rounded-md p-3 relative"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  onClick={onClearError}
                  aria-label="Dismiss error"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(isLoading || loadingMessage) && (
        <div
          className="bg-blue-50 border border-blue-200 rounded-md p-3"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
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
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-blue-800">
                {loadingMessage ?? 'Loading...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Progress */}
      {isExporting && (
        <div
          className="bg-green-50 border border-green-200 rounded-md p-3"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <div className="text-sm font-medium text-green-800">
                Exporting... {Math.round(exportProgress)}%
              </div>
              <div className="mt-2">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

StatusDisplay.displayName = 'StatusDisplay';

export default StatusDisplay;