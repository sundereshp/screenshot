
import { useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';

export const useActivityTracker = () => {
  const { incrementMouseCount, incrementKeyboardCount, activeTask } = useTaskContext();

  useEffect(() => {
    // Only track activity when a task is active and not paused or on break
    if (!activeTask || activeTask.timerPaused || activeTask.breakStarted) {
      return;
    }

    // Mouse activity tracking
    const handleMouseMove = () => {
      incrementMouseCount();
    };

    // Keyboard activity tracking
    const handleKeyDown = () => {
      incrementKeyboardCount();
    };

    // Throttle events to not overwhelm with increments
    let mouseTimeout: number | null = null;
    let keyboardTimeout: number | null = null;

    const throttledMouseMove = () => {
      if (mouseTimeout === null) {
        mouseTimeout = window.setTimeout(() => {
          incrementMouseCount();
          mouseTimeout = null;
        }, 5000); // Track mouse movement every 5 seconds at most
      }
    };

    const throttledKeyDown = () => {
      if (keyboardTimeout === null) {
        keyboardTimeout = window.setTimeout(() => {
          incrementKeyboardCount();
          keyboardTimeout = null;
        }, 1000); // Track keyboard activity every second at most
      }
    };

    window.addEventListener('mousemove', throttledMouseMove);
    window.addEventListener('keydown', throttledKeyDown);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      window.removeEventListener('keydown', throttledKeyDown);
      
      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }
      
      if (keyboardTimeout) {
        clearTimeout(keyboardTimeout);
      }
    };
  }, [incrementMouseCount, incrementKeyboardCount, activeTask]);

  return null; // This hook only has side effects
};
