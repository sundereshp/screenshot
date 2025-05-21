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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// In api.ts
// In api.ts
export const fetchTasks = async (
  projectId?: number, 
  parentId?: number | null, 
  level?: number
): Promise<Task[]> => {
  try {
    console.log('Fetching tasks with:', { projectId, parentId, level });
    const response = await fetch(`${API_BASE_URL}/api/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    
    const data = await response.json();
    console.log('API Response:', data); // Log the raw response
    
    const filtered = data.filter((task: any) => {
      const matchesProject = task.projectID === projectId;
      const matchesParent = level === 1 
        ? task.parentID === null  // Level 1 tasks should have null parent
        : task.parentID === parentId;
      const matchesLevel = task.taskLevel === level;
      
      console.log('Task:', task.name, { 
        matchesProject, 
        matchesParent, 
        matchesLevel,
        taskProjectId: task.projectID,
        taskParentId: task.parentID,
        taskLevel: task.taskLevel
      });
      
      return matchesProject && matchesParent && matchesLevel;
    });
    
    console.log('Filtered tasks:', filtered);
    return filtered;
  } catch (error) {
    console.error('Error in fetchTasks:', error);
    return [];
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