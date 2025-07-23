/**
 * Cut Editor - Frame Template Data
 * Predefined frame templates with slot configurations
 */

import { FrameTemplate } from '../types';

export const FRAME_TEMPLATES: FrameTemplate[] = [
  // 2-Panel Frames
  {
    id: 'horizontal_2',
    type: 'horizontal_2',
    name: '2 Panel Horizontal',
    imagePath: '/assets/frames/horizontal_2.png',
    dimensions: { width: 800, height: 400 },
    slots: [
      {
        id: 'slot_1',
        position: { x: 0, y: 0 },
        size: { width: 400, height: 400 },
        bounds: { x: 0, y: 0, width: 400, height: 400 },
      },
      {
        id: 'slot_2',
        position: { x: 400, y: 0 },
        size: { width: 400, height: 400 },
        bounds: { x: 400, y: 0, width: 400, height: 400 },
      },
    ],
  },
  {
    id: 'vertical_2',
    type: 'vertical_2',
    name: '2 Panel Vertical',
    imagePath: '/assets/frames/vertical_2.png',
    dimensions: { width: 400, height: 800 },
    slots: [
      {
        id: 'slot_1',
        position: { x: 0, y: 0 },
        size: { width: 400, height: 400 },
        bounds: { x: 0, y: 0, width: 400, height: 400 },
      },
      {
        id: 'slot_2',
        position: { x: 0, y: 400 },
        size: { width: 400, height: 400 },
        bounds: { x: 0, y: 400, width: 400, height: 400 },
      },
    ],
  },

  // 4-Panel Frames
  {
    id: 'horizontal_4',
    type: 'horizontal_4',
    name: '4 Panel Horizontal',
    imagePath: '/assets/frames/horizontal_4.png',
    dimensions: { width: 800, height: 400 },
    slots: [
      {
        id: 'slot_1',
        position: { x: 0, y: 0 },
        size: { width: 200, height: 200 },
        bounds: { x: 0, y: 0, width: 200, height: 200 },
      },
      {
        id: 'slot_2',
        position: { x: 200, y: 0 },
        size: { width: 200, height: 200 },
        bounds: { x: 200, y: 0, width: 200, height: 200 },
      },
      {
        id: 'slot_3',
        position: { x: 0, y: 200 },
        size: { width: 200, height: 200 },
        bounds: { x: 0, y: 200, width: 200, height: 200 },
      },
      {
        id: 'slot_4',
        position: { x: 200, y: 200 },
        size: { width: 200, height: 200 },
        bounds: { x: 200, y: 200, width: 200, height: 200 },
      },
    ],
  },
  {
    id: 'vertical_4',
    type: 'vertical_4',
    name: '4 Panel Vertical',
    imagePath: '/assets/frames/vertical_4.png',
    dimensions: { width: 400, height: 800 },
    slots: [
      {
        id: 'slot_1',
        position: { x: 0, y: 0 },
        size: { width: 400, height: 200 },
        bounds: { x: 0, y: 0, width: 400, height: 200 },
      },
      {
        id: 'slot_2',
        position: { x: 0, y: 200 },
        size: { width: 400, height: 200 },
        bounds: { x: 0, y: 200, width: 400, height: 200 },
      },
      {
        id: 'slot_3',
        position: { x: 0, y: 400 },
        size: { width: 400, height: 200 },
        bounds: { x: 0, y: 400, width: 400, height: 200 },
      },
      {
        id: 'slot_4',
        position: { x: 0, y: 600 },
        size: { width: 400, height: 200 },
        bounds: { x: 0, y: 600, width: 400, height: 200 },
      },
    ],
  },

  // 6-Panel Frames
  {
    id: 'horizontal_6',
    type: 'horizontal_6',
    name: '6 Panel Horizontal',
    imagePath: '/assets/frames/horizontal_6.png',
    dimensions: { width: 900, height: 600 },
    slots: [
      {
        id: 'slot_1',
        position: { x: 0, y: 0 },
        size: { width: 300, height: 200 },
        bounds: { x: 0, y: 0, width: 300, height: 200 },
      },
      {
        id: 'slot_2',
        position: { x: 300, y: 0 },
        size: { width: 300, height: 200 },
        bounds: { x: 300, y: 0, width: 300, height: 200 },
      },
      {
        id: 'slot_3',
        position: { x: 600, y: 0 },
        size: { width: 300, height: 200 },
        bounds: { x: 600, y: 0, width: 300, height: 200 },
      },
      {
        id: 'slot_4',
        position: { x: 0, y: 200 },
        size: { width: 300, height: 200 },
        bounds: { x: 0, y: 200, width: 300, height: 200 },
      },
      {
        id: 'slot_5',
        position: { x: 300, y: 200 },
        size: { width: 300, height: 200 },
        bounds: { x: 300, y: 200, width: 300, height: 200 },
      },
      {
        id: 'slot_6',
        position: { x: 600, y: 200 },
        size: { width: 300, height: 200 },
        bounds: { x: 600, y: 200, width: 300, height: 200 },
      },
    ],
  },
  {
    id: 'vertical_6',
    type: 'vertical_6',
    name: '6 Panel Vertical',
    imagePath: '/assets/frames/vertical_6.png',
    dimensions: { width: 600, height: 900 },
    slots: [
      {
        id: 'slot_1',
        position: { x: 0, y: 0 },
        size: { width: 200, height: 150 },
        bounds: { x: 0, y: 0, width: 200, height: 150 },
      },
      {
        id: 'slot_2',
        position: { x: 200, y: 0 },
        size: { width: 200, height: 150 },
        bounds: { x: 200, y: 0, width: 200, height: 150 },
      },
      {
        id: 'slot_3',
        position: { x: 400, y: 0 },
        size: { width: 200, height: 150 },
        bounds: { x: 400, y: 0, width: 200, height: 150 },
      },
      {
        id: 'slot_4',
        position: { x: 0, y: 150 },
        size: { width: 200, height: 150 },
        bounds: { x: 0, y: 150, width: 200, height: 150 },
      },
      {
        id: 'slot_5',
        position: { x: 200, y: 150 },
        size: { width: 200, height: 150 },
        bounds: { x: 200, y: 150, width: 200, height: 150 },
      },
      {
        id: 'slot_6',
        position: { x: 400, y: 150 },
        size: { width: 200, height: 150 },
        bounds: { x: 400, y: 150, width: 200, height: 150 },
      },
    ],
  },

  // 9-Panel Frames
  {
    id: 'horizontal_9',
    type: 'horizontal_9',
    name: '9 Panel Horizontal',
    imagePath: '/assets/frames/horizontal_9.png',
    dimensions: { width: 900, height: 600 },
    slots: [
      {
        id: 'slot_1',
        position: { x: 0, y: 0 },
        size: { width: 300, height: 200 },
        bounds: { x: 0, y: 0, width: 300, height: 200 },
      },
      {
        id: 'slot_2',
        position: { x: 300, y: 0 },
        size: { width: 300, height: 200 },
        bounds: { x: 300, y: 0, width: 300, height: 200 },
      },
      {
        id: 'slot_3',
        position: { x: 600, y: 0 },
        size: { width: 300, height: 200 },
        bounds: { x: 600, y: 0, width: 300, height: 200 },
      },
      {
        id: 'slot_4',
        position: { x: 0, y: 200 },
        size: { width: 300, height: 200 },
        bounds: { x: 0, y: 200, width: 300, height: 200 },
      },
      {
        id: 'slot_5',
        position: { x: 300, y: 200 },
        size: { width: 300, height: 200 },
        bounds: { x: 300, y: 200, width: 300, height: 200 },
      },
      {
        id: 'slot_6',
        position: { x: 600, y: 200 },
        size: { width: 300, height: 200 },
        bounds: { x: 600, y: 200, width: 300, height: 200 },
      },
      {
        id: 'slot_7',
        position: { x: 0, y: 400 },
        size: { width: 300, height: 200 },
        bounds: { x: 0, y: 400, width: 300, height: 200 },
      },
      {
        id: 'slot_8',
        position: { x: 300, y: 400 },
        size: { width: 300, height: 200 },
        bounds: { x: 300, y: 400, width: 300, height: 200 },
      },
      {
        id: 'slot_9',
        position: { x: 600, y: 400 },
        size: { width: 300, height: 200 },
        bounds: { x: 600, y: 400, width: 300, height: 200 },
      },
    ],
  },
  {
    id: 'vertical_9',
    type: 'vertical_9',
    name: '9 Panel Vertical',
    imagePath: '/assets/frames/vertical_9.png',
    dimensions: { width: 600, height: 900 },
    slots: [
      {
        id: 'slot_1',
        position: { x: 0, y: 0 },
        size: { width: 200, height: 100 },
        bounds: { x: 0, y: 0, width: 200, height: 100 },
      },
      {
        id: 'slot_2',
        position: { x: 200, y: 0 },
        size: { width: 200, height: 100 },
        bounds: { x: 200, y: 0, width: 200, height: 100 },
      },
      {
        id: 'slot_3',
        position: { x: 400, y: 0 },
        size: { width: 200, height: 100 },
        bounds: { x: 400, y: 0, width: 200, height: 100 },
      },
      {
        id: 'slot_4',
        position: { x: 0, y: 100 },
        size: { width: 200, height: 100 },
        bounds: { x: 0, y: 100, width: 200, height: 100 },
      },
      {
        id: 'slot_5',
        position: { x: 200, y: 100 },
        size: { width: 200, height: 100 },
        bounds: { x: 200, y: 100, width: 200, height: 100 },
      },
      {
        id: 'slot_6',
        position: { x: 400, y: 100 },
        size: { width: 200, height: 100 },
        bounds: { x: 400, y: 100, width: 200, height: 100 },
      },
      {
        id: 'slot_7',
        position: { x: 0, y: 200 },
        size: { width: 200, height: 100 },
        bounds: { x: 0, y: 200, width: 200, height: 100 },
      },
      {
        id: 'slot_8',
        position: { x: 200, y: 200 },
        size: { width: 200, height: 100 },
        bounds: { x: 200, y: 200, width: 200, height: 100 },
      },
      {
        id: 'slot_9',
        position: { x: 400, y: 200 },
        size: { width: 200, height: 100 },
        bounds: { x: 400, y: 200, width: 200, height: 100 },
      },
    ],
  },
];
