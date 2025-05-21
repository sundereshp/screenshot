
import { useEffect, useState } from 'react';

export const useScreenshot = () => {
  const [screenshots, setScreenshots] = useState<string[]>([]);

  // In a real Electron app, this would use Electron's desktopCapturer API
  // For now, we'll just simulate it
  const captureScreenshot = async (): Promise<string> => {
    // This is a mock function - in Electron you would use:
    // const sources = await desktopCapturer.getSources({ types: ['screen'] });
    // const source = sources[0]; // Get the entire screen
    // [Then capture using navigator.mediaDevices]

    return new Promise((resolve) => {
      // Mock a base64 screenshot
      const mockBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8${Math.random().toString(36).substring(2, 8)}AAHXAGX7tsEKAAAAAElFTkSuQmCC`;
      resolve(mockBase64);
    });
  };

  const saveScreenshot = (base64Data: string) => {
    // In Electron, you would save to file system
    // For now, we'll save to localStorage and state
    const newScreenshots = [...screenshots, base64Data];
    setScreenshots(newScreenshots);
    
    try {
      localStorage.setItem('screenshots', JSON.stringify(newScreenshots));
    } catch (e) {
      // Handle storage quota exceeded
      console.error('Local storage quota exceeded:', e);
    }
  };

  // Mock function to take a screenshot at random intervals within 10 minutes
  const setupRandomScreenshotInterval = (isActive: boolean) => {
    if (!isActive) return null;

    // Take a screenshot at a random time within the next 10 minutes
    const randomMinutes = Math.floor(Math.random() * 10) + 1;
    const timeout = randomMinutes * 60 * 1000; // Convert to milliseconds

    const intervalId = window.setTimeout(async () => {
      try {
        const screenshot = await captureScreenshot();
        saveScreenshot(screenshot);
        console.log(`Screenshot taken at minute ${randomMinutes}`);
        
        // Schedule next screenshot after completing the 10-minute window
        const remainingTime = (10 - randomMinutes) * 60 * 1000;
        window.setTimeout(() => {
          setupRandomScreenshotInterval(isActive);
        }, remainingTime);
      } catch (error) {
        console.error('Failed to capture screenshot:', error);
      }
    }, timeout);

    return intervalId;
  };

  return {
    screenshots,
    captureScreenshot,
    saveScreenshot,
    setupRandomScreenshotInterval
  };
};
