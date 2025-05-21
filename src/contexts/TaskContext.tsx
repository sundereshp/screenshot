import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { fetchTasks, fetchProjects, Project } from '../utils/api';

export type TaskStatus = 'TODO' | 'IN PROGRESS' | 'COMPLETE' | 'REVIEW' | 'CLOSED' | 'BACKLOG' | 'CLARIFICATION';

export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
  level: number;  // This is the existing property
  parentId: number | null;
  projectId: number;
  estimatedTime?: number;
  totalExpectedTime?: number;
  level1ID?: number;
  level2ID?: number;
  level3ID?: number;
  level4ID?: number;
}

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  isBreak: boolean;
  startTime: number | null;
  elapsedTime: number;
  todayTime: number;
  totalTime: number;
  projectId: number | null;
  taskId: number | null;
}

export type TaskSelection = {
  projectId: number | null;
  level1Id: number | null;
  level2Id: number | null;
  level3Id: number | null;
  level4Id: number | null;
};

interface TaskActivity {
  taskId: number;
  keyboardCount: number;
  mouseCount: number;
  lastUpdated?: number;
}

type TaskActivityMap = Record<number, TaskActivity>;

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  selectedProjectId: number | null;
  setSelectedProjectId: (id: number | null) => void;
  loading: boolean;
  error: string | null;
  taskSelection: TaskSelection;
  timer: TimerState;
  timeFormatted: string;
  lastScreenshotTime: Date | null;
  keyboardCount: number;
  mouseCount: number;
  loadProjects: () => Promise<Project[]>;
  loadTasks: (projectId?: number | null, parentId?: number | null, level?: number) => Promise<Task[]>;
  getTaskActivity: (taskId: number) => TaskActivity;
  setTaskSelection: (selection: Partial<TaskSelection>) => void;
  startTimer: (projectId: number, taskId: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  startBreak: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  isTaskSelected: boolean;
  selectedTaskDetails: Task | null;
  canNavigateToTimer: boolean;
  activity: TaskActivityMap;
}

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

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [taskSelection, setTaskSelectionState] = useState<TaskSelection>({
    projectId: null,
    level1Id: null,
    level2Id: null,
    level3Id: null,
    level4Id: null,
  });
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    isBreak: false,
    startTime: null,
    elapsedTime: 0,
    todayTime: 0,
    totalTime: 0,
    projectId: null,
    taskId: null,
  });
  const [taskActivities, setTaskActivities] = useState<TaskActivityMap>({});
  const [lastScreenshotTime, setLastScreenshotTime] = useState<Date | null>(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);
  const [canNavigateToTimer, setCanNavigateToTimer] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [timeFormatted, setTimeFormatted] = useState("00:00:00");
  const [keyboardCount, setKeyboardCount] = useState(0);
  const [mouseCount, setMouseCount] = useState(0);
  const lastActivityUpdate = useRef<number>(0);
  const activityThrottleMs = 1000; // Throttle updates to once per second
  const isTrackingRef = useRef(false);
  const timerRef = useRef(timer);
  const setTaskSelection = (selection: Partial<TaskSelection>) => {
    setTaskSelectionState((prev) => {
      const newSelection = { ...prev, ...selection };

      if (selection.projectId !== undefined) {
        newSelection.level1Id = null;
        newSelection.level2Id = null;
        newSelection.level3Id = null;
        newSelection.level4Id = null;
      } else if (selection.level1Id !== undefined) {
        newSelection.level2Id = null;
        newSelection.level3Id = null;
        newSelection.level4Id = null;
      } else if (selection.level2Id !== undefined) {
        newSelection.level3Id = null;
        newSelection.level4Id = null;
      } else if (selection.level3Id !== undefined) {
        newSelection.level4Id = null;
      }

      if (newSelection.level4Id) {
        const task = tasks.find((t) => t.id === newSelection.level4Id);
        setSelectedTaskDetails(task || null);
        setCanNavigateToTimer(true);
      } else if (newSelection.level3Id) {
        const task = tasks.find((t) => t.id === newSelection.level3Id);
        setSelectedTaskDetails(task || null);
        setCanNavigateToTimer(true);
      } else if (newSelection.level2Id) {
        const task = tasks.find((t) => t.id === newSelection.level2Id);
        setSelectedTaskDetails(task || null);
        setCanNavigateToTimer(true);
      } else if (newSelection.level1Id) {
        const task = tasks.find((t) => t.id === newSelection.level1Id);
        setSelectedTaskDetails(task || null);
        setCanNavigateToTimer(true);
      } else {
        setSelectedTaskDetails(null);
        setCanNavigateToTimer(false);
      }

      return newSelection;
    });
  };
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);


  // In TaskContext.tsx

  // In TaskContext.tsx
  const loadTasks = useCallback(async (
    projectId?: number | null,
    parentId?: number | null,
    level?: number
  ): Promise<Task[]> => {
    try {
      setLoading(true);
      const data = await fetchTasks(
        projectId === null ? undefined : projectId,
        parentId === null ? undefined : parentId,
        level
      );

      // If loading top-level tasks, update the tasks state
      if (level === 1 || level === undefined) {
        setTasks(data);
      }

      return data;
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);

      // Only set initial project if we don't have one selected
      if (selectedProjectId === null && data.length > 0) {
        const firstProjectId = data[0].id;
        setSelectedProjectId(firstProjectId);
        // Load tasks for the first project
        await loadTasks(firstProjectId);
      }

      return data;
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  }, [loadTasks, selectedProjectId]);

  // Add this effect to load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
  useEffect(() => {
    const loadInitialData = async () => {
      const projects = await loadProjects();
      if (projects.length > 0) {
        const firstProjectId = projects[0].id;
        await loadTasks(firstProjectId);
      }
    };

    loadInitialData();
  }, [loadProjects, loadTasks]);

  // Then use it in the useEffect
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
        if (data.length > 0) {
          const firstProjectId = data[0].id;
          await loadTasks(firstProjectId);
          // ... rest of the code
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };

    loadProjects();
  }, [loadTasks]); // Add loadTasks to dependencies
  useEffect(() => {
    const loadInitialData = async () => {
      const projects = await loadProjects();
      if (projects.length > 0) {
        const firstProjectId = projects[0].id;
        await loadTasks(firstProjectId);
      }
    };

    loadInitialData();
  }, [loadProjects, loadTasks]);


  useEffect(() => {
    const loadTasksOnInitialRender = async () => {
      await loadTasks();
      setInitialLoad(false);
    };

    loadTasksOnInitialRender();
  }, [loadTasks]);

  useEffect(() => {
    const formatTime = (timeInSeconds: number) => {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setTimeFormatted(formatTime(Math.floor(timer.elapsedTime / 1000)));
  }, [timer.elapsedTime]);

  useEffect(() => {
    if (timer.isRunning && !timer.isPaused && !timer.isBreak) {
      const id = window.setInterval(() => {
        setTimer((prev) => ({
          ...prev,
          elapsedTime: prev.startTime ? prev.elapsedTime + 1000 : prev.elapsedTime,
        }));
      }, 1000);
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timer.isRunning, timer.isPaused, timer.isBreak, timer.startTime]);

  const updateLastScreenshotTime = () => {
    setLastScreenshotTime(new Date());
  };

  const getTaskActivity = useCallback((taskId: number): TaskActivity => {
    if (!taskActivities[taskId]) {
      setTaskActivities((prev) => ({
        ...prev,
        [taskId]: { taskId, keyboardCount: 0, mouseCount: 0, lastUpdated: Date.now() },
      }));
      return { taskId, keyboardCount: 0, mouseCount: 0 };
    }
    return taskActivities[taskId];
  }, [taskActivities]);

  const saveActivityToTask = useCallback((taskId: number, updates: Partial<TaskActivity>) => {
    const now = Date.now();

    if (now - (lastActivityUpdate.current || 0) < activityThrottleMs) {
      return;
    }
    lastActivityUpdate.current = now;

    setTaskActivities((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || { keyboardCount: 0, mouseCount: 0 }),
        ...updates,
        lastUpdated: now,
      },
    }));
  }, []);

  const incrementKeyboardCount = useCallback(() => {
    if (!timer.isRunning || timer.isPaused || !timer.taskId) return;

    setKeyboardCount((prev) => {
      const newCount = prev + 1;
      saveActivityToTask(timer.taskId!, { keyboardCount: newCount });
      return newCount;
    });
  }, [timer.isRunning, timer.isPaused, timer.taskId, saveActivityToTask]);

  const incrementMouseCount = useCallback(() => {
    if (!timer.isRunning || timer.isPaused || !timer.taskId) return;

    setMouseCount((prev) => {
      const newCount = prev + 1;
      saveActivityToTask(timer.taskId!, { mouseCount: newCount });
      return newCount;
    });
  }, [timer.isRunning, timer.isPaused, timer.taskId, saveActivityToTask]);

  const startTimer = useCallback((projectId: number, taskId: number) => {
    const taskActivity = getTaskActivity(taskId);
    setKeyboardCount(taskActivity.keyboardCount || 0);
    setMouseCount(taskActivity.mouseCount || 0);

    setTimer((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      isBreak: false,
      startTime: Date.now() - prev.elapsedTime,
      projectId,
      taskId,
    }));
  }, [getTaskActivity]);
  const startBreak = useCallback(() => {
    // Pause the current timer
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true,
      isBreak: true
    }));

    // You might also want to:
    // 1. Save the current task progress
    // 2. Show a break timer
    // 3. Update any relevant state
  }, []);
  const startGlobalMouseTracking = useCallback(() => {
    if (isTrackingRef.current) return;
    isTrackingRef.current = true;

    if (window.electron) {
      window.electron.startMouseTracking();

      const handleMouseEvent = (event: { x: number; y: number }) => {
        const currentTimer = timerRef.current;
        if (currentTimer.isRunning && !currentTimer.isPaused && currentTimer.taskId) {
          incrementMouseCount();
        }
      };

      const cleanup = window.electron.onMouseEvent(handleMouseEvent);

      return () => {
        cleanup();
        window.electron?.stopMouseTracking();
        isTrackingRef.current = false;
      };
    } else {
      const handleClick = () => {
        const currentTimer = timerRef.current;
        if (currentTimer.isRunning && !currentTimer.isPaused && currentTimer.taskId) {
          incrementMouseCount();
        }
      };

      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('click', handleClick);
        isTrackingRef.current = false;
      };
    }
  }, [incrementMouseCount]);

  const stopGlobalMouseTracking = useCallback(() => {
    isTrackingRef.current = false;
  }, []);

  useEffect(() => {
    if (timer.isRunning && !timer.isPaused && timer.taskId) {
      const cleanup = startGlobalMouseTracking();
      return () => {
        cleanup?.();
        stopGlobalMouseTracking();
      };
    }
  }, [timer.isRunning, timer.isPaused, timer.taskId, startGlobalMouseTracking, stopGlobalMouseTracking]);

  useEffect(() => {
    const handleKeyDown = () => {
      incrementKeyboardCount();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [incrementKeyboardCount]);



  const value: TaskContextType = {
    tasks,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    loadProjects,
    loading,
    error,
    taskSelection,
    timer,
    timeFormatted,
    loadTasks,
    lastScreenshotTime,
    setTaskSelection,
    keyboardCount,
    mouseCount,
    getTaskActivity,
    startTimer,
    pauseTimer: () => {
      setTimer((prev) => ({ ...prev, isPaused: true, isBreak: false }));
    },
    resumeTimer: () => {
      setTimer((prev) => ({ ...prev, isPaused: false, isBreak: false }));
      setCanNavigateToTimer(true);
    },
    stopTimer: () => {
      stopGlobalMouseTracking();
      setTimer((prev) => {
        const todayTime = prev.todayTime + Math.floor(prev.elapsedTime / 1000);
        return {
          isRunning: false,
          isPaused: false,
          isBreak: false,
          startTime: null,
          elapsedTime: 0,
          todayTime,
          totalTime: prev.totalTime + Math.floor(prev.elapsedTime / 1000),
          projectId: null,
          taskId: null,
        };
      });
      setCanNavigateToTimer(true);
    },
    startBreak,
    resetTimer: () => {
      setTimer({
        isRunning: false,
        isPaused: false,
        isBreak: false,
        startTime: null,
        elapsedTime: 0,
        todayTime: 0,
        totalTime: 0,
        projectId: null,
        taskId: null,
      });
    },
    isTaskSelected: Boolean(
      taskSelection.level1Id ||
      taskSelection.level2Id ||
      taskSelection.level3Id ||
      taskSelection.level4Id
    ),
    selectedTaskDetails,
    canNavigateToTimer,
    activity: taskActivities,
  };

  return (
    <TaskContext.Provider value={value}>
      {!initialLoad && children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export { TaskProvider };
