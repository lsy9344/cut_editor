/**
 * Font Management System
 * Handles font loading and provides font face declarations for text rendering
 */

export interface FontConfig {
  name: string;
  path: string;
  weight?: string;
  style?: string;
}

export const AVAILABLE_FONTS: FontConfig[] = [
  {
    name: 'Korean',
    path: './assets/fonts/korean-font.ttf',
    weight: 'normal',
    style: 'normal',
  },
  {
    name: 'Arial',
    path: 'Arial',
    weight: 'normal',
    style: 'normal',
  },
  {
    name: 'Helvetica',
    path: 'Helvetica',
    weight: 'normal',
    style: 'normal',
  },
];

export const DEFAULT_FONT: FontConfig = AVAILABLE_FONTS[0]!; // Korean font as default

/**
 * Load custom fonts for use in the application
 */
export const loadFonts = async (): Promise<void> => {
  try {
    for (const font of AVAILABLE_FONTS) {
      if (font.path.startsWith('./assets/')) {
        const fontFace = new FontFace(font.name, `url("${font.path}")`, {
          weight: font.weight ?? 'normal',
          style: font.style ?? 'normal',
        });

        await fontFace.load();
        document.fonts.add(fontFace);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load fonts:', error);
  }
};

/**
 * Get font family string for CSS/Canvas usage
 */
export const getFontFamily = (fontName: string): string => {
  const font = AVAILABLE_FONTS.find(f => f.name === fontName);
  return font?.name ?? DEFAULT_FONT.name;
};

/**
 * Check if font is loaded and available
 */
export const isFontLoaded = (fontName: string): boolean => {
  const fontFamily = getFontFamily(fontName);
  return document.fonts.check(`16px ${fontFamily}`);
};

/**
 * Font preloading utility for main process integration
 */
export const preloadFonts = (): void => {
  AVAILABLE_FONTS.forEach(font => {
    if (font.path.startsWith('./assets/')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font.path;
      link.as = 'font';
      link.type = 'font/ttf';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
};
