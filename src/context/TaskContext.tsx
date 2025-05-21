
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SubAction {
  id: string;
  name: string;
}

interface Action {
  id: string;
  name: string;
  subActions: SubAction[];
}

interface Task {
  id: string;
  name: string;
  status: string;
  estimatedTime: number; // in minutes
  actions: Action[];
}

interface Project {
  id: string;
  name: string;
  status: string;
  tasks: Task[];
}

interface ActiveTask {
  projectId: string;
  taskId: string;
  actionId: string;
  subActionId: string;
  timerStarted: Date | null;
  timerPaused: boolean;
  totalTimeSpent: number; // in seconds
  todayTimeSpent: number; // in seconds
  breakStarted: Date | null;
}

interface TaskContextType {
  projects: Project[];
  activeTask: ActiveTask | null;
  selectedProjectId: string | null;
  selectedTaskId: string | null;
  selectedActionId: string | null;
  selectedSubActionId: string | null;
  loadTasksFromServer: () => void;
  selectProject: (projectId: string) => void;
  selectTask: (taskId: string) => void;
  selectAction: (actionId: string) => void;
  selectSubAction: (subActionId: string) => void;
  startTask: () => void;
  pauseTask: () => void;
  resumeTask: () => void;
  takeBreak: () => void;
  endBreak: () => void;
  stopTask: () => void;
  mouseCount: number;
  keyboardCount: number;
  incrementMouseCount: () => void;
  incrementKeyboardCount: () => void;
  lastScreenshotTime: Date | null;
  lastScreenshotData: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Project Alpha',
    status: 'In Progress',
    tasks: [
      {
        id: '1-1',
        name: 'Design UI',
        status: 'Active',
        estimatedTime: 480, // 8 hours in minutes
        actions: [
          {
            id: '1-1-1',
            name: 'Create wireframes',
            subActions: [
              { id: '1-1-1-1', name: 'Homepage wireframe' },
              { id: '1-1-1-2', name: 'Dashboard wireframe' }
            ]
          },
          {
            id: '1-1-2',
            name: 'Create mockups',
            subActions: [
              { id: '1-1-2-1', name: 'Homepage mockup' },
              { id: '1-1-2-2', name: 'Dashboard mockup' }
            ]
          }
        ]
      },
      {
        id: '1-2',
        name: 'Development',
        status: 'Pending',
        estimatedTime: 960, // 16 hours in minutes
        actions: [
          {
            id: '1-2-1',
            name: 'Frontend development',
            subActions: [
              { id: '1-2-1-1', name: 'Setup project' },
              { id: '1-2-1-2', name: 'Implement components' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Project Beta',
    status: 'Pending',
    tasks: [
      {
        id: '2-1',
        name: 'Research',
        status: 'Active',
        estimatedTime: 240, // 4 hours in minutes
        actions: [
          {
            id: '2-1-1',
            name: 'Market research',
            subActions: [
              { id: '2-1-1-1', name: 'Competitor analysis' }
            ]
          }
        ]
      }
    ]
  }
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : mockProjects;
  });
  
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(() => {
    const savedActiveTask = localStorage.getItem('activeTask');
    return savedActiveTask ? JSON.parse(savedActiveTask) : null;
  });
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [selectedSubActionId, setSelectedSubActionId] = useState<string | null>(null);
  
  const [mouseCount, setMouseCount] = useState(() => {
    const savedCount = localStorage.getItem('mouseCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  
  const [keyboardCount, setKeyboardCount] = useState(() => {
    const savedCount = localStorage.getItem('keyboardCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  
  const [lastScreenshotTime, setLastScreenshotTime] = useState<Date | null>(() => {
    const saved = localStorage.getItem('lastScreenshotTime');
    return saved ? new Date(saved) : null;
  });
  
  const [lastScreenshotData, setLastScreenshotData] = useState<string | null>(() => {
    return localStorage.getItem('lastScreenshotData');
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (activeTask) {
      localStorage.setItem('activeTask', JSON.stringify(activeTask));
    } else {
      localStorage.removeItem('activeTask');
    }
  }, [activeTask]);

  useEffect(() => {
    localStorage.setItem('mouseCount', mouseCount.toString());
  }, [mouseCount]);

  useEffect(() => {
    localStorage.setItem('keyboardCount', keyboardCount.toString());
  }, [keyboardCount]);

  useEffect(() => {
    if (lastScreenshotTime) {
      localStorage.setItem('lastScreenshotTime', lastScreenshotTime.toISOString());
    }
  }, [lastScreenshotTime]);

  useEffect(() => {
    if (lastScreenshotData) {
      localStorage.setItem('lastScreenshotData', lastScreenshotData);
    }
  }, [lastScreenshotData]);

  // Timer effect to update total time spent
  useEffect(() => {
    let intervalId: number;

    if (activeTask?.timerStarted && !activeTask.timerPaused && !activeTask.breakStarted) {
      intervalId = window.setInterval(() => {
        setActiveTask(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            totalTimeSpent: prev.totalTimeSpent + 1,
            todayTimeSpent: prev.todayTimeSpent + 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTask?.timerStarted, activeTask?.timerPaused, activeTask?.breakStarted]);

  // Load data from "server" (this would normally be an API call)
  const loadTasksFromServer = () => {
    // In a real app, this would be an API call
    setProjects(mockProjects);
  };

  const selectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedTaskId(null);
    setSelectedActionId(null);
    setSelectedSubActionId(null);
  };

  const selectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setSelectedActionId(null);
    setSelectedSubActionId(null);
  };

  const selectAction = (actionId: string) => {
    setSelectedActionId(actionId);
    setSelectedSubActionId(null);
  };

  const selectSubAction = (subActionId: string) => {
    setSelectedSubActionId(subActionId);
  };

  const startTask = () => {
    if (!selectedProjectId || !selectedTaskId || !selectedActionId || !selectedSubActionId) return;

    setActiveTask({
      projectId: selectedProjectId,
      taskId: selectedTaskId,
      actionId: selectedActionId,
      subActionId: selectedSubActionId,
      timerStarted: new Date(),
      timerPaused: false,
      totalTimeSpent: 0,
      todayTimeSpent: 0,
      breakStarted: null,
    });
  };

  const pauseTask = () => {
    if (!activeTask) return;

    setActiveTask({
      ...activeTask,
      timerPaused: true,
    });
  };

  const resumeTask = () => {
    if (!activeTask) return;

    setActiveTask({
      ...activeTask,
      timerPaused: false,
    });
  };

  const takeBreak = () => {
    if (!activeTask) return;

    setActiveTask({
      ...activeTask,
      breakStarted: new Date(),
    });
  };

  const endBreak = () => {
    if (!activeTask) return;

    setActiveTask({
      ...activeTask,
      breakStarted: null,
    });
  };

  const stopTask = () => {
    // Save completed task history before clearing it
    if (activeTask) {
      // In a real app, you'd save this to a task history
      console.log('Task completed:', activeTask);
    }
    
    setActiveTask(null);
  };

  const incrementMouseCount = () => {
    setMouseCount(prev => prev + 1);
  };

  const incrementKeyboardCount = () => {
    setKeyboardCount(prev => prev + 1);
  };

  // Mock screenshot functionality (would use Electron in real app)
  useEffect(() => {
    const takeRandomScreenshot = () => {
      if (typeof window !== 'undefined' && !activeTask?.timerPaused && !activeTask?.breakStarted) {
        // In a real Electron app, this would capture an actual screenshot
        console.log('Taking screenshot...');
        
        // Simulate screenshot data
        const mockBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8${Math.random().toString(36).substring(2, 8)}AAHXAGX7tsEKAAAAAElFTkSuQmCC`;
        
        setLastScreenshotData(mockBase64);
        setLastScreenshotTime(new Date());
      }
    };

    const scheduleNextScreenshot = () => {
      if (!activeTask?.timerStarted) return;
      
      // Random time within 10 minutes (between 1-10 minutes for demo)
      const randomMinutes = Math.floor(Math.random() * 10) + 1;
      const ms = randomMinutes * 60 * 1000;
      
      setTimeout(() => {
        takeRandomScreenshot();
        // Schedule next one after completing current 10-minute window
        const remainingMs = (10 - randomMinutes) * 60 * 1000;
        setTimeout(scheduleNextScreenshot, remainingMs);
      }, ms);
    };

    if (activeTask?.timerStarted && !activeTask.timerPaused) {
      scheduleNextScreenshot();
    }
  }, [activeTask?.timerStarted, activeTask?.timerPaused, activeTask?.breakStarted]);

  return (
    <TaskContext.Provider
      value={{
        projects,
        activeTask,
        selectedProjectId,
        selectedTaskId,
        selectedActionId,
        selectedSubActionId,
        loadTasksFromServer,
        selectProject,
        selectTask,
        selectAction,
        selectSubAction,
        startTask,
        pauseTask,
        resumeTask,
        takeBreak,
        endBreak,
        stopTask,
        mouseCount,
        keyboardCount,
        incrementMouseCount,
        incrementKeyboardCount,
        lastScreenshotTime,
        lastScreenshotData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  
  return context;
};
