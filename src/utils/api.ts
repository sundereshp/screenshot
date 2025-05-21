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

export const fetchTasks = async (projectId?: number): Promise<Task[]> => {
  try {
    // Return mock tasks for the selected project
    const tasks: Task[] = [
      { 
        id: 1, 
        projectId: 1, 
        name: 'Task 1', 
        status: 'TODO',
        level: 1,
        parentId: 1,
        estimatedTime: 10,
        totalExpectedTime: 10,
        level1ID: 1,
        level2ID: 0,
        level3ID: 0,
        level4ID: 0,
      },
      { 
        id: 2, 
        projectId: 1, 
        name: 'Task 2', 
        status: 'TODO',
        level: 1,
        parentId: 1,
        estimatedTime: 10,
        totalExpectedTime: 10,
        level1ID: 2,
        level2ID: 0,
        level3ID: 0,
        level4ID: 0,
      },
      { 
        id: 3, 
        projectId: 2,  // Project 2 task
        name: 'Task 1 for Project 2', 
        status: 'TODO',
        level: 1,
        parentId: 2,
        estimatedTime: 8,
        totalExpectedTime: 8,
        level1ID: 3,
        level2ID: 0,
        level3ID: 0,
        level4ID: 0,
      },
      { 
        id: 4, 
        projectId: 2,  // Project 2 task
        name: 'Task 2 for Project 2', 
        status: 'TODO',
        level: 1,
        parentId: 2,
        estimatedTime: 8,
        totalExpectedTime: 8,
        level1ID: 4,
        level2ID: 0,
        level3ID: 0,
        level4ID: 0,
      }
    ];

    // If projectId is provided, return tasks for that project
    if (projectId) {
      return tasks.filter(task => task.projectId === projectId);
    }

    return tasks;
    
    // If projectId is provided, return tasks for that project
    if (projectId) {  
      return tasks.filter(task => task.projectId === projectId);
    }

    return tasks;
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