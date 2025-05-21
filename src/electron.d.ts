// Type definitions for the Electron API exposed by the preload script

interface ElectronAPI {
  quit: () => void;
  // Add other Electron APIs you'll be using here
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {}; // This file needs to be a module
