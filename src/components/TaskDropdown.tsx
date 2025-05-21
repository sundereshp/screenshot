// In TaskDropDown.tsx
import React, { useEffect, useState } from 'react';
import { useTaskContext, Task } from '../contexts/TaskContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskDropdownProps {
  projectId: number | null;
  level?: number;
  parentId?: number | null;
  onTaskSelect: (task: Task) => void;
  disabled?: boolean;
}

const levelTitles = ['Task', 'Subtask', 'Action', 'Subaction'];

export const TaskDropdown: React.FC<TaskDropdownProps> = ({
  projectId,
  level = 1,
  parentId = null,
  onTaskSelect,
  disabled = false,
}) => {
  const { loadTasks, tasks: allTasks } = useTaskContext();
  const [selectedTasks, setSelectedTasks] = useState<{ [key: number]: Task | null }>({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  // Load tasks for the current level
  useEffect(() => {
    const fetchTasks = async () => {
      if (projectId != null) {
        // Always load all tasks for the project first
        await loadTasks(projectId);
      }
    };
    fetchTasks();
  }, [projectId, loadTasks]);

  // Get tasks for each level
  // In TaskDropDown.tsx
  // In TaskDropDown.tsx
  // In TaskDropDown.tsx
  const getTasksForLevel = (lvl: number): Task[] => {
    if (lvl === 1) {
      // For level 1, return all top-level tasks (parentId is null)
      return allTasks.filter(task => task.level === 1 && task.parentId === null);
    }

    // For levels > 1, find the selected parent task
    const parentTask = selectedTasks[lvl - 1];
    if (!parentTask) return []; // No parent selected, so no children to show

    // Find all tasks that:
    // 1. Are at the current level
    // 2. Have a parentId matching the selected parent's id
    return allTasks.filter(task => {
      return task.level === lvl && task.parentId === parentTask.id;
    });
  };

  // Update the handleTaskSelect function
  const handleTaskSelect = (value: string, lvl: number) => {
    const task = allTasks.find(t => t.id === parseInt(value));
    if (!task) return;

    setSelectedTasks(prev => ({
      ...prev,
      [lvl]: task,
      // Reset higher levels
      ...Object.fromEntries(
        Array.from({ length: 4 - lvl }, (_, i) => [lvl + i + 1, null])
      )
    }));

    onTaskSelect(task);
  };
  // In TaskDropDown.tsx, inside the component
  // In TaskDropDown.tsx
// Remove the console.log from the render method and update the useEffect:
useEffect(() => {
  // Only log when in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('TaskDropdown - All tasks:', allTasks);
    console.log('TaskDropdown - Selected tasks:', selectedTasks);
    
    // Log tasks for each level
    [1, 2, 3, 4].forEach(lvl => {
      console.log(`Level ${lvl} tasks:`, getTasksForLevel(lvl));
    });
  }
}, [allTasks, selectedTasks]); // Only re-run when these dependencies change

  // In the return statement, add:
  { console.log(`Level ${level} tasks:`, getTasksForLevel(level)) }

  if (!projectId) {
    return <div className="mb-4 text-muted-foreground">Please select a project first</div>;
  }

  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((lvl) => {
        // Only show the level if it's the first level or if the previous level has a selection
        const shouldShow = lvl === 1 || selectedTasks[lvl - 1] !== null;
        if (!shouldShow) return null;

        const tasksForLevel = getTasksForLevel(lvl);
        const levelTitle = levelTitles[lvl - 1];

        return (
          <div key={lvl} className="space-y-2">
            <h3 className="text-sm font-medium">{levelTitle}</h3>
            <Select
              value={selectedTasks[lvl]?.id.toString() || ''}
              onValueChange={(value) => handleTaskSelect(value, lvl)}
              disabled={disabled || tasksForLevel.length === 0}  // Removed ?.
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={tasksForLevel.length > 0  // Removed ?.
                    ? `Select ${levelTitle.toLowerCase()}`
                    : `No ${levelTitle.toLowerCase()}s available`}
                />
              </SelectTrigger>
              <SelectContent>
                {tasksForLevel.map(task => (
                  <SelectItem key={task.id} value={task.id.toString()}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
};

export default TaskDropdown;