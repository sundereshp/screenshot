import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  onActivity: (callback: (data: { type: string; taskId?: number }) => void) => {
    const handler = (_: Electron.IpcRendererEvent, data: { type: string; taskId?: number }) => callback(data);
    ipcRenderer.on('activity-update', handler);
    return () => {
      ipcRenderer.removeListener('activity-update', handler);
    };
  },
  
  // For keyboard and mouse events
  onKeyboardEvent: (callback: (event: { keycode: number }) => void) => {
    const handler = (_: Electron.IpcRendererEvent, event: { keycode: number }) => callback(event);
    ipcRenderer.on('keyboard-event', handler);
    return () => {
      ipcRenderer.removeListener('keyboard-event', handler);
    };
  },
  
  onMouseEvent: (callback: (event: { x: number; y: number }) => void) => {
    const handler = (_: Electron.IpcRendererEvent, event: { x: number; y: number }) => callback(event);
    ipcRenderer.on('mouse-event', handler);
    return () => {
      ipcRenderer.removeListener('mouse-event', handler);
    };
  },
  
  // For controlling mouse tracking
  startMouseTracking: () => {
    ipcRenderer.send('start-mouse-tracking');
  },
  
  stopMouseTracking: () => {
    ipcRenderer.send('stop-mouse-tracking');
  },
  
  onMouseTrackingStarted: (callback: () => void) => {
    ipcRenderer.on('mouse-tracking-started', callback);
    return () => {
      ipcRenderer.removeListener('mouse-tracking-started', callback);
    };
  },
  
  onMouseTrackingStopped: (callback: () => void) => {
    ipcRenderer.on('mouse-tracking-stopped', callback);
    return () => {
      ipcRenderer.removeListener('mouse-tracking-stopped', callback);
    };
  }
});

export {};
