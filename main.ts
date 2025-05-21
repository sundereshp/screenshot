import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import ioHook from 'iohook';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const isDev = process.env.NODE_ENV === 'development';
  
  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // Open the DevTools in development mode.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
};

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
  
  // Start ioHook for keyboard/mouse events
  ioHook.start();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Keyboard events
ioHook.on('keydown', (event: unknown) => {
  mainWindow?.webContents.send('keyboard-event', event);
});

// Mouse events
ioHook.on('mousedown', (event: unknown) => {
  mainWindow?.webContents.send('mouse-event', event);
});

app.on('will-quit', () => {
  try {
    // @ts-ignore - iohook types are not perfect
    if (typeof ioHook.unregisterAllListeners === 'function') {
      // @ts-ignore
      ioHook.unregisterAllListeners();
    }
    // @ts-ignore
    ioHook.stop();
    // @ts-ignore
    ioHook.unload();
  } catch (error) {
    console.error('Error cleaning up ioHook:', error);
  }
});