import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, useTaskContext } from '../contexts/TaskContext';
import Navbar from '../components/Navbar';
import { TaskDropdown } from '../components/TaskDropdown';
import StartButton from '../components/StartButton';
import { TaskSelection } from '../contexts/TaskContext';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchProjects } from '@/utils/api';
import { Project } from '@/utils/api';

interface TaskSelectionPageProps {
  onSettingsClick: () => void;
  onQuitClick: () => void;
}

const TaskSelectionPage: React.FC<TaskSelectionPageProps> = ({
  onSettingsClick,
  onQuitClick
}) => {
  const navigate = useNavigate();
  const {
    taskSelection,
    setTaskSelection,
    startTimer,
    isTaskSelected,
    selectedTaskDetails,
    loadTasks,
    canNavigateToTimer,
    projects,
    loadProjects,
  } = useTaskContext();
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);



  // Update the useEffect that loads projects
  // In TaskSelectionPage.tsx
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchProjects();
        if (data.length > 0) {
          // Set initial project ID to first project
          setSelectedProjectId(selectedProjectId);
          await loadTasks(selectedProjectId);
          setTaskSelection({
            projectId: selectedProjectId,
            level1Id: null,
            level2Id: null,
            level3Id: null,
            level4Id: null
          });
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };

    loadInitialData();
  }, [loadTasks, setTaskSelection]);


  // Update the project change handler
  const handleProjectChange = async (value: string) => {
    const projectId = parseInt(value, 10);
    setSelectedProjectId(projectId);
    try {
      // Reset task selection when project changes
      setTaskSelection({
        projectId,
        level1Id: null,
        level2Id: null,
        level3Id: null,
        level4Id: null
      });
      await loadTasks(projectId);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  // In TaskSelectionPage.tsx
  const handleTaskSelect = (task: Task) => {
    const selection: Partial<TaskSelection> = {
      [`level${task.level}Id`]: task.id,
      projectId: task.projectId
    };
    setTaskSelection(selection);
  };

  const handleStart = () => {
    const taskId = taskSelection.level4Id ||
      taskSelection.level3Id ||
      taskSelection.level2Id ||
      taskSelection.level1Id;

    const projectId = taskSelection.projectId;

    if (taskId && projectId) {
      startTimer(projectId, taskId);
      navigate('/timer');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Navbar
        title="Task Selection"
        onSettingsClick={onSettingsClick}
        onQuitClick={onQuitClick}
      />

      <div className="flex-grow overflow-y-auto p-6">
        <Card className="p-6 max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Select Project</h2>
              <Select
                value={selectedProjectId?.toString() || ''}
                onValueChange={handleProjectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProjectId && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Select Task</h2>
                <TaskDropdown
                  projectId={selectedProjectId}
                  onTaskSelect={handleTaskSelect}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TaskSelectionPage;
