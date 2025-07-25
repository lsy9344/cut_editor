/**
 * Cut Editor - Electron API Type Declarations
 * Type definitions for APIs exposed to the renderer process
 */

import { IpcApi, FileFilter } from '../shared/types';

declare global {
  interface Window {
    electronAPI: IpcApi;
    fileAPI: {
      selectSaveLocation: (
        defaultName: string,
        filters: FileFilter[]
      ) => Promise<string | null>;
    };
  }
}

export {};
