import React, { useEffect, useState } from 'react';
import { useTaskContext, Task, TaskStatus } from '../contexts/TaskContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '../contexts/ThemeContext';

interface TaskDropdownProps {
  projectId: number | null;
  onTaskSelect: (task: Task) => void;
  disabled?: boolean;
}

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const statusClass = `status-${status.replace(' ', '-').toLowerCase()}`;
  return (
    <span className={`status-badge ${statusClass}`}>
      {status}
    </span>
  );
};

const TaskDropdown: React.FC<TaskDropdownProps> = ({
  projectId,
  onTaskSelect,
  disabled = false,
}) => {
  const { tasks, loading, error } = useTaskContext();
  const { isDarkMode } = useTheme();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter tasks by project
  // In TaskDropdown.tsx
  const projectTasks = React.useMemo(() =>
    tasks.filter(task => task.projectId === projectId),
    [tasks, projectId]
  );

  // Group tasks by level
  const level1Tasks = projectTasks.filter(task => task.level === 1);
  const level2Tasks = projectTasks.filter(task => task.level === 2);
  const level3Tasks = projectTasks.filter(task => task.level === 3);
  const level4Tasks = projectTasks.filter(task => task.level === 4);

  // Handle task selection
  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    onTaskSelect(task);
  };

  if (loading) {
    return (
      <div className="mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Loading tasks...</label>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 text-red-500 dark:text-red-400">
        Error loading tasks: {error}
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="mb-4 text-foreground/70">
        Please select a project first
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Level 1 Tasks */}
      <div>
        <label className="block text-sm font-medium mb-1">Task</label>
        <Select
          onValueChange={(value) => {
            const task = level1Tasks.find(t => t.id === parseInt(value));
            if (task) handleTaskSelect(task);
          }}
          disabled={disabled || level1Tasks.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            {level1Tasks.map((task) => (
              <SelectItem key={task.id} value={task.id.toString()}>
                <div className="flex items-center gap-2">
                  <span>{task.name}</span>
                  <StatusBadge status={task.status} />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Level 2 Tasks - Only show if a level 1 task is selected */}
      {selectedTask?.level === 1 && level2Tasks.some(t => t.level1ID === selectedTask.id) && (
        <div>
          <label className="block text-sm font-medium mb-1">Subtask</label>
          <Select
            onValueChange={(value) => {
              const task = level2Tasks.find(t => t.id === parseInt(value));
              if (task) handleTaskSelect(task);
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a subtask" />
            </SelectTrigger>
            <SelectContent>
              {level2Tasks
                .filter(task => task.level1ID === selectedTask.id)
                .map((task) => (
                  <SelectItem key={task.id} value={task.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{task.name}</span>
                      <StatusBadge status={task.status} />
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Level 3 Tasks - Only show if a level 2 task is selected */}
      {selectedTask?.level === 2 && level3Tasks.some(t => t.level2ID === selectedTask.id) && (
        <div>
          <label className="block text-sm font-medium mb-1">Action</label>
          <Select
            onValueChange={(value) => {
              const task = level3Tasks.find(t => t.id === parseInt(value));
              if (task) handleTaskSelect(task);
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              {level3Tasks
                .filter(task => task.level2ID === selectedTask.id)
                .map((task) => (
                  <SelectItem key={task.id} value={task.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{task.name}</span>
                      <StatusBadge status={task.status} />
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Level 4 Tasks - Only show if a level 3 task is selected */}
      {selectedTask?.level === 3 && level4Tasks.some(t => t.level3ID === selectedTask.id) && (
        <div>
          <label className="block text-sm font-medium mb-1">Subaction</label>
          <Select
            onValueChange={(value) => {
              const task = level4Tasks.find(t => t.id === parseInt(value));
              if (task) handleTaskSelect(task);
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a subaction" />
            </SelectTrigger>
            <SelectContent>
              {level4Tasks
                .filter(task => task.level3ID === selectedTask.id)
                .map((task) => (
                  <SelectItem key={task.id} value={task.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{task.name}</span>
                      <StatusBadge status={task.status} />
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default TaskDropdown;
