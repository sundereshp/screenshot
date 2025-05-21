import { Task } from '../contexts/TaskContext';

export interface Project {
  id: number;
  userID: number;
  name: string;
  startDate: string;
  endDate: string;
  estHours: number;
  actHours: number;
  wsID: number;
  tasks: Task[];
  createdAt: string;
  modifiedAt: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return [
      { id: 1, name: 'Project 1', userID: 1, startDate: '2023-01-01', endDate: '2023-01-31', estHours: 100, actHours: 0, wsID: 1, tasks: [], createdAt: '2023-01-01', modifiedAt: '2023-01-01' },
      { id: 2, name: 'Project 2', userID: 1, startDate: '2023-01-01', endDate: '2023-01-31', estHours: 100, actHours: 0, wsID: 1, tasks: [], createdAt: '2023-01-01', modifiedAt: '2023-01-01' }
    ];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// In api.ts
export const fetchTasks = async (projectId?: number, parentId?: number | null, level?: number): Promise<Task[]> => {
  try {
    // Mock data with hierarchy
    const allTasks: Task[] = [
      // Level 1 Tasks (parentId = null)
      { 
        id: 1, 
        projectId: 1, 
        name: 'Task 1', 
        status: 'TODO',
        level: 1,
        parentId: null,
        estimatedTime: 10,
        totalExpectedTime: 10,
        level1ID: 1,
        level2ID: 0,
        level3ID: 0,
        level4ID: 0,
      },
      // Subtasks for Task 1 (level 2)
      { 
        id: 2, 
        projectId: 1, 
        name: 'Subtask 1.1', 
        status: 'TODO',
        level: 2,
        parentId: 1,
        estimatedTime: 5,
        totalExpectedTime: 5,
        level1ID: 1,
        level2ID: 2,
        level3ID: 0,
        level4ID: 0,
      },
      // Actions for Subtask 1.1 (level 3)
      { 
        id: 3, 
        projectId: 1, 
        name: 'Action 1.1.1', 
        status: 'TODO',
        level: 3,
        parentId: 2,
        estimatedTime: 2,
        totalExpectedTime: 2,
        level1ID: 1,
        level2ID: 2,
        level3ID: 3,
        level4ID: 0,
      },
      { 
        id: 4, 
        projectId: 1, 
        name: 'Subtask 1.2', 
        status: 'TODO',
        level: 2,
        parentId: 1,
        estimatedTime: 5,
        totalExpectedTime: 5,
        level1ID: 1,
        level2ID: 4,
        level3ID: 0,
        level4ID: 0,
      },
      { 
        id: 5, 
        projectId: 1, 
        name: 'Task 2', 
        status: 'TODO',
        level: 1,
        parentId: null,
        estimatedTime: 5,
        totalExpectedTime: 5,
        level1ID: 5,
        level2ID: 0,
        level3ID: 0,
        level4ID: 0,
      },
      { 
        id: 6, 
        projectId: 1, 
        name: 'Subtask 2.1', 
        status: 'TODO',
        level: 2,
        parentId: 5,
        estimatedTime: 5,
        totalExpectedTime: 5,
        level1ID: 5,
        level2ID: 6,
        level3ID: 0,
        level4ID: 0,
      },
      { 
        id: 7, 
        projectId: 1, 
        name: 'Subtask 2.2', 
        status: 'TODO',
        level: 2,
        parentId: 5,
        estimatedTime: 5,
        totalExpectedTime: 5,
        level1ID: 5,
        level2ID: 7,
        level3ID: 0,
        level4ID: 0,
      },
      { 
        id: 8, 
        projectId: 1, 
        name: 'Subtask 2.3', 
        status: 'TODO',
        level: 2,
        parentId: 5,
        estimatedTime: 5,
        totalExpectedTime: 5,
        level1ID: 5,
        level2ID: 8,
        level3ID: 0,
        level4ID: 0,
      },
      { 
        id: 9, 
        projectId: 1, 
        name: 'action 2.1.1', 
        status: 'TODO',
        level: 3,
        parentId: 6,
        estimatedTime: 5,
        totalExpectedTime: 5,
        level1ID: 5,
        level2ID: 6,
        level3ID: 9,
        level4ID: 0,
      },
      { 
        id: 10, 
        projectId: 1, 
        name: 'subaction 2.1.1.1', 
        status: 'TODO',
        level: 4,
        parentId: 9,
        estimatedTime: 5,
        totalExpectedTime: 5,
        level1ID: 5,
        level2ID: 6,
        level3ID: 9,
        level4ID: 10,
      },
      // More tasks...
    ];

    // Filter tasks based on projectId and parentId
    return allTasks.filter(task => {
      const matchesProject = projectId === undefined || task.projectId === projectId;
      const matchesParent = parentId === undefined ? true : task.parentId === parentId;
      const matchesLevel = level === undefined || task.level === level;
      
      // Debug log to see what's being filtered
      if (process.env.NODE_ENV === 'development' && task.level === 2) {
        console.log('Task:', task.name, {
          matchesProject,
          matchesParent,
          matchesLevel,
          taskParentId: task.parentId,
          expectedParentId: parentId
        });
      }
      
      return matchesProject && matchesParent && matchesLevel;
    }); 
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const updateTask = async (taskId: number, updates: Partial<Task>): Promise<Task> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/task/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};