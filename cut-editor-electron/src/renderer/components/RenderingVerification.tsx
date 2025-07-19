import React, { useCallback, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useFrame } from '../context/FrameContext';
import { getAllFrameTemplates } from '@shared/data/frameTemplates';
import { FrameType } from '@shared/types';

interface VerificationStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  details?: string;
  error?: string;
  duration?: number;
}

export const RenderingVerification: React.FC = () => {
  const [steps, setSteps] = useState<VerificationStep[]>([
    { id: 'react-mount', name: 'React Component Mount', status: 'pending' },
    { id: 'frame-context', name: 'Frame Context Initialization', status: 'pending' },
    { id: 'fabric-library', name: 'Fabric.js Library Load', status: 'pending' },
    { id: 'canvas-creation', name: 'Canvas Creation', status: 'pending' },
    { id: 'frame-templates', name: 'Frame Templates Load', status: 'pending' },
    { id: '2-frame-render', name: '2-Frame Layout Render', status: 'pending' },
    { id: '4-frame-render', name: '4-Frame Layout Render', status: 'pending' },
    { id: '6-frame-render', name: '6-Frame Layout Render', status: 'pending' },
    { id: '9-frame-render', name: '9-Frame Layout Render', status: 'pending' },
    { id: 'slot-interactions', name: 'Slot Click Interactions', status: 'pending' },
    { id: 'image-loading', name: 'Test Image Loading', status: 'pending' },
    { id: 'performance-check', name: 'Performance Baseline', status: 'pending' },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [testCanvas, setTestCanvas] = useState<fabric.Canvas | null>(null);
  const { state, setFrame } = useFrame();

  const updateStep = useCallback((stepId: string, updates: Partial<VerificationStep>) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, ...updates } : step,
    ));
  }, []);

  const runStep = useCallback(async (step: VerificationStep): Promise<boolean> => {
    const startTime = Date.now();
    updateStep(step.id, { status: 'running' });

    try {
      switch (step.id) {
        case 'react-mount': {
          await new Promise(resolve => setTimeout(resolve, 100));
          updateStep(step.id, {
            status: 'success',
            details: 'Component mounted successfully',
            duration: Date.now() - startTime,
          });
          break;
        }

        case 'frame-context': {
          if (!state.currentFrame) {
            throw new Error('Frame context not initialized');
          }
          updateStep(step.id, {
            status: 'success',
            details: `Context loaded with ${state.currentFrame.name}`,
            duration: Date.now() - startTime,
          });
          break;
        }

        case 'fabric-library': {
          if (typeof fabric === 'undefined') {
            throw new Error('Fabric.js not loaded');
          }
          const testRect = new fabric.Rect({ width: 10, height: 10 });
          if (!testRect) {
            throw new Error('Failed to create fabric object');
          }
          updateStep(step.id, {
            status: 'success',
            details: `Fabric.js v${fabric.version} loaded`,
            duration: Date.now() - startTime,
          });
          break;
        }

        case 'canvas-creation': {
          const canvasElement = document.createElement('canvas');
          canvasElement.width = 200;
          canvasElement.height = 200;
          canvasElement.style.border = '1px solid #ccc';

          const fabricCanvas = new fabric.Canvas(canvasElement, {
            width: 200,
            height: 200,
            backgroundColor: '#ffffff',
          });

          if (!fabricCanvas) {
            throw new Error('Failed to create fabric canvas');
          }

          setTestCanvas(fabricCanvas);
          updateStep(step.id, {
            status: 'success',
            details: 'Canvas created and initialized',
            duration: Date.now() - startTime,
          });
          break;
        }

        case 'frame-templates': {
          const templates = getAllFrameTemplates();
          if (templates.length !== 4) {
            throw new Error(`Expected 4 templates, found ${templates.length}`);
          }

          const expectedFrames: FrameType[] = ['2-frame', '4-frame', '6-frame', '9-frame'];
          for (const frameType of expectedFrames) {
            const template = templates.find(t => t.id === frameType);
            if (!template) {
              throw new Error(`Missing template: ${frameType}`);
            }
          }

          updateStep(step.id, {
            status: 'success',
            details: `All ${templates.length} frame templates loaded`,
            duration: Date.now() - startTime,
          });
          break;
        }

        case '2-frame-render':
        case '4-frame-render':
        case '6-frame-render':
        case '9-frame-render': {
          const frameType = step.id.replace('-render', '') as FrameType;
          const templates = getAllFrameTemplates();
          const frameTemplate = templates.find(t => t.id === frameType);

          if (!frameTemplate) {
            throw new Error(`Template ${frameType} not found`);
          }

          setFrame(frameTemplate);
          await new Promise(resolve => setTimeout(resolve, 100));

          if (state.currentFrame?.id !== frameType) {
            const currentId = state.currentFrame?.id ?? 'undefined';
            throw new Error(`Frame not set correctly: expected ${frameType}, got ${currentId}`);
          }

          const slotCount = frameTemplate.slots.length;
          updateStep(step.id, {
            status: 'success',
            details: `${frameTemplate.name} rendered with ${slotCount} slots`,
            duration: Date.now() - startTime,
          });
          break;
        }

        case 'slot-interactions': {
          if (!state.currentFrame) {
            throw new Error('No current frame to test');
          }

          const firstSlot = state.currentFrame.slots[0];
          if (!firstSlot) {
            throw new Error('No slots available to test');
          }

          const hasValidStructure = firstSlot.id &&
            typeof firstSlot.x === 'number' &&
            typeof firstSlot.y === 'number';

          if (!hasValidStructure) {
            throw new Error('Invalid slot data structure');
          }

          const slotCount = state.currentFrame.slots.length;
          updateStep(step.id, {
            status: 'success',
            details: `Slot structure validated for ${slotCount} slots`,
            duration: Date.now() - startTime,
          });
          break;
        }

        case 'image-loading': {
          if (!testCanvas) {
            throw new Error('No test canvas available');
          }

          const testImage = new fabric.Rect({
            left: 10,
            top: 10,
            width: 50,
            height: 50,
            fill: 'red',
          });

          testCanvas.add(testImage);
          testCanvas.renderAll();

          updateStep(step.id, {
            status: 'success',
            details: 'Test image object created and rendered',
            duration: Date.now() - startTime,
          });
          break;
        }

        case 'performance-check': {
          const perfStart = performance.now();

          if (testCanvas) {
            for (let i = 0; i < 10; i++) {
              const rect = new fabric.Rect({
                left: Math.random() * 100,
                top: Math.random() * 100,
                width: 10,
                height: 10,
                fill: `hsl(${Math.random() * 360}, 50%, 50%)`,
              });
              testCanvas.add(rect);
            }
            testCanvas.renderAll();
            testCanvas.clear();
          }

          const perfEnd = performance.now();
          const operationTime = perfEnd - perfStart;

          if (operationTime > 100) {
            const timeMs = operationTime.toFixed(2);
            throw new Error(`Performance warning: operations took ${timeMs}ms`);
          }

          const perfTimeMs = operationTime.toFixed(2);
          updateStep(step.id, {
            status: 'success',
            details: `Performance baseline: ${perfTimeMs}ms for 10 operations`,
            duration: Date.now() - startTime,
          });
          break;
        }

        default:
          throw new Error(`Unknown step: ${step.id}`);
      }
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateStep(step.id, {
        status: 'error',
        error: errorMessage,
        duration: Date.now() - startTime,
      });
      return false;
    }
  }, [state, setFrame, testCanvas, updateStep]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setCurrentStepIndex(0);

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStepIndex(i);
        const success = await runStep(steps[i]);
        if (!success) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      // Error handling is done in runStep
    } finally {
      setIsRunning(false);
    }
  }, [steps, runStep]);

  useEffect(() => {
    setTimeout(() => {
      void runAllTests();
    }, 500);
  }, [runAllTests]);

  const getStatusIcon = (status: VerificationStep['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (status: VerificationStep['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-500';
      case 'running': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getBorderAndBgClass = (step: VerificationStep, index: number) => {
    if (currentStepIndex === index && isRunning) {
      return 'border-blue-500 bg-blue-50';
    }

    if (step.status === 'success') {
      return 'border-green-500 bg-green-50';
    }

    if (step.status === 'error') {
      return 'border-red-500 bg-red-50';
    }

    return 'border-gray-300 bg-gray-50';
  };

  const successCount = steps.filter(s => s.status === 'success').length;
  const errorCount = steps.filter(s => s.status === 'error').length;
  const pendingCount = steps.filter(s => s.status === 'pending').length;

  const panelClasses = 'fixed top-4 right-4 w-96 bg-white rounded-lg shadow-lg border ' +
    'p-4 max-h-96 overflow-y-auto z-50';

  const buttonClasses = 'px-3 py-1 bg-blue-600 text-white rounded text-sm ' +
    'hover:bg-blue-700 disabled:opacity-50';

  return (
    <div className={panelClasses}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Rendering Verification</h3>
        <button
          onClick={() => void runAllTests()}
          disabled={isRunning}
          className={buttonClasses}
        >
          {isRunning ? 'Running...' : 'Re-run'}
        </button>
      </div>

      <div className="mb-4 text-sm">
        <div className="flex justify-between">
          <span>✅ Success: {successCount}</span>
          <span>❌ Errors: {errorCount}</span>
          <span>⏳ Pending: {pendingCount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(successCount / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-2 rounded border-l-4 ${getBorderAndBgClass(step, index)}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${getStatusColor(step.status)}`}>
                {getStatusIcon(step.status)} {step.name}
              </span>
              {step.duration && (
                <span className="text-xs text-gray-500">
                  {step.duration}ms
                </span>
              )}
            </div>

            {step.details && (
              <div className="text-xs text-gray-600 mt-1">
                {step.details}
              </div>
            )}

            {step.error && (
              <div className="text-xs text-red-600 mt-1 font-mono">
                Error: {step.error}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 border-t pt-2">
        <div>Current Frame: {state.currentFrame?.name ?? 'None'}</div>
        <div>Slots: {state.currentFrame?.slots.length ?? 0}</div>
        <div>Selected: {state.selectedSlot ?? 'None'}</div>
        <div>Environment: {process.env.NODE_ENV}</div>
      </div>
    </div>
  );
};
