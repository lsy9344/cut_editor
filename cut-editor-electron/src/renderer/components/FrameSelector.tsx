/**
 * Cut Editor - Frame Selector Component
 * Frame template selection with visual previews and thumbnails
 */

import React, { memo, useCallback, useState } from 'react';
import { FrameSelectorProps, FrameTemplate } from '../../shared/types';

// NOTE: Material-UI 컴포넌트를 사용하기 위해 필요한 import 구문들을 추가했습니다.
import { Typography, Box, useTheme, alpha, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FrameSelector: React.FC<FrameSelectorProps> = memo(
  ({ availableFrames = [], currentFrame, onFrameSelect, isLoading }) => {
    const [hoveredFrame, setHoveredFrame] = useState<string | null>(null);

    // NOTE: MUI 테마의 색상, 그림자 등을 사용하기 위해 useTheme 훅을 추가했습니다.
    const theme = useTheme();

    const handleFrameClick = useCallback(
      (frame: FrameTemplate) => {
        if (!isLoading) {
          onFrameSelect(frame);
        }
      },
      [onFrameSelect, isLoading]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent, frame: FrameTemplate) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleFrameClick(frame);
        }
      },
      [handleFrameClick]
    );

    // Generate SVG preview for frame layout
    const generateFramePreview = useCallback((frame: FrameTemplate) => {
      const { dimensions, slots } = frame;
      const scale = 80 / Math.max(dimensions.width, dimensions.height);
      const scaledWidth = dimensions.width * scale;
      const scaledHeight = dimensions.height * scale;

      return (
        <svg
          width={scaledWidth}
          height={scaledHeight}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          style={{ border: '1px solid #edacb1', borderRadius: '2px' }}
        >
          {/* Background */}
          <rect
            width={dimensions.width}
            height={dimensions.height}
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          {/* Slots */}
          {slots.map(slot => (
            <rect
              key={slot.id}
              x={slot.bounds.x}
              y={slot.bounds.y}
              width={slot.bounds.width}
              height={slot.bounds.height}
              fill="#f3f4f6"
              stroke="#9ca3af"
              strokeWidth="1"
              strokeDasharray="4,2"
            />
          ))}

          {/* Slot numbers */}
          {slots.map((slot, index) => (
            <text
              key={`label-${slot.id}`}
              x={slot.bounds.x + slot.bounds.width / 2}
              y={slot.bounds.y + slot.bounds.height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fontSize: '12px', fill: '#4b5563' }}
            >
              {index + 1}
            </text>
          ))}
        </svg>
      );
    }, []);

    if (isLoading) {
      return (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Frame Layout</h3>
          <div className="grid grid-cols-2 gap-3 gap-y-[200px] justify-items-center">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Frame Layout</h3>
          {currentFrame && (
            <span className="text-xs text-gray-500">
              {currentFrame.slots.length} slots
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 gap-y-[20px] justify-items-center">
          {(availableFrames || []).map(frame => {
            const isSelected = currentFrame?.id === frame.id;
            const isHovered = hoveredFrame === frame.id;

            // Material-UI Button with proper color support
            return (
              <Button
                key={frame.id}
                variant={isSelected ? 'contained' : 'outlined'}
                color={isSelected ? 'primary' : 'success'}
                onClick={(): void => handleFrameClick(frame)}
                onKeyDown={(e): void => handleKeyDown(e, frame)}
                onMouseEnter={(): void => setHoveredFrame(frame.id)}
                onMouseLeave={(): void => setHoveredFrame(null)}
                disabled={isLoading}
                aria-label={`Select ${frame.name} layout with ${frame.slots.length} slots`}
                aria-pressed={isSelected}
                sx={{
                  position: 'relative',
                  padding: 2,
                  borderRadius: 2,
                  borderWidth: 2,
                  transition: 'all 0.2s',
                  textTransform: 'none',
                  backgroundColor: isSelected
                    ? theme.palette.primary.main
                    : theme.palette.background.paper,
                  borderColor: isSelected
                    ? theme.palette.primary.main
                    : theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: isSelected
                      ? theme.palette.primary.dark
                      : alpha(theme.palette.success.main, 0.1),
                    borderColor: isSelected
                      ? theme.palette.primary.dark
                      : theme.palette.success.dark,
                    boxShadow: theme.shadows[2],
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.5)}`,
                  },
                  '&.Mui-disabled': {
                    cursor: 'not-allowed',
                    opacity: 0.5,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}
                  >
                    {generateFramePreview(frame)}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: 'center',
                      color: isSelected ? 'white' : theme.palette.text.primary,
                      fontWeight: 'medium',
                      fontSize: '0.75rem',
                    }}
                  >
                    {frame.name}
                  </Typography>
                </Box>
                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      borderRadius: '50%',
                      padding: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 12 }} />
                  </Box>
                )}
                {isHovered && !isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: alpha(theme.palette.grey[100], 0.5),
                      borderRadius: 2,
                    }}
                  />
                )}
              </Button>
            );
          })}
        </div>

        {(!availableFrames || availableFrames.length === 0) && (
          <div className="text-center py-6 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="mt-2 text-sm">No frame templates available</p>
          </div>
        )}
      </div>
    );
  }
);

FrameSelector.displayName = 'FrameSelector';

export default FrameSelector;
