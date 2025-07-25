// Type definitions for Fabric.js v6.x
// The @types/fabric package is for v5.x and incompatible with v6.x

declare module 'fabric' {
  export class Canvas {
    constructor(element: string | HTMLCanvasElement, options?: CanvasOptions);
    add(object: FabricObject): Canvas;
    remove(object: FabricObject): Canvas;
    clear(): Canvas;
    dispose(): void;
    getObjects(): FabricObject[];
    renderAll(): void;
    on(
      eventName: 'selection:created',
      handler: (e: SelectionEvent) => void
    ): void;
    on(eventName: 'selection:cleared', handler: () => void): void;
    on(eventName: 'object:moving', handler: (e: ObjectEvent) => void): void;
    on(eventName: 'object:scaling', handler: (e: ObjectEvent) => void): void;
    on(eventName: string, handler: (e: unknown) => void): void;
    off(eventName?: string, handler?: (e: unknown) => void): void;
    getZoom(): number;
    zoomToPoint(point: { x: number; y: number }, zoom: number): void;
    getPointer(event: Event): { x: number; y: number };
    width: number;
    height: number;
  }

  export abstract class FabricObject {
    get(property: 'id'): string;
    get(property: 'left'): number | undefined;
    get(property: 'top'): number | undefined;
    get(property: 'width'): number | undefined;
    get(property: 'height'): number | undefined;
    get(property: 'scaleX'): number | undefined;
    get(property: 'scaleY'): number | undefined;
    get(property: string): unknown;
    set(property: string | object, value?: unknown): FabricObject;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
  }

  export class Rect extends FabricObject {
    constructor(options?: RectOptions);
  }

  export class FabricImage extends FabricObject {
    constructor(element: HTMLImageElement | string, options?: ImageOptions);
    static fromURL(url: string, options?: ImageOptions): Promise<FabricImage>;
    static fromElement(
      element: HTMLImageElement,
      options?: ImageOptions
    ): Promise<FabricImage>;
  }

  export class Image extends FabricObject {
    constructor(element: HTMLImageElement | string, options?: ImageOptions);
    static fromURL(url: string, options?: ImageOptions): Promise<Image>;
    static fromElement(
      element: HTMLImageElement,
      options?: ImageOptions
    ): Promise<Image>;
  }

  interface CanvasOptions {
    width?: number;
    height?: number;
    selection?: boolean;
    preserveObjectStacking?: boolean;
    imageSmoothingEnabled?: boolean;
    allowTouchScrolling?: boolean;
    centeredScaling?: boolean;
    centeredRotation?: boolean;
  }

  interface RectOptions {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    selectable?: boolean;
  }

  interface ImageOptions {
    left?: number;
    top?: number;
    scaleX?: number;
    scaleY?: number;
    selectable?: boolean;
  }

  interface SelectionEvent {
    selected?: FabricObject[];
  }

  interface ObjectEvent {
    target: FabricObject;
  }
}
