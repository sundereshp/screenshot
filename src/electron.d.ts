// This file will contain TypeScript type definitions for your Electron API.
// It enables you to define types for the `electron` object on the `window` object.

interface ElectronAPI {
  startTrackingActivity: (taskId: number) => void;
  stopTrackingActivity: () => void;
  onActivity: (callback: (data: { type: string; taskId?: number }) => void) => () => void;
  startMouseTracking: () => void;
  stopMouseTracking: () => void;
  onMouseEvent: (callback: (event: { x: number; y: number }) => void) => () => void;
  onKeyboardEvent: (callback: (event: { keycode: number }) => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
