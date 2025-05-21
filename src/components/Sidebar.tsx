
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    selectedTaskId,
    selectedActionId,
    selectedSubActionId,
    selectProject,
    selectTask,
    selectAction,
    selectSubAction,
    startTask,
    activeTask
  } = useTaskContext();

  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  // Set initial expanded state based on active task
  useEffect(() => {
    if (activeTask) {
      setExpandedProject(activeTask.projectId);
      setExpandedTask(activeTask.taskId);
      setExpandedAction(activeTask.actionId);
    }
  }, [activeTask]);

  // Handle project click
  const handleProjectClick = (projectId: string) => {
    selectProject(projectId);
    setExpandedProject(expandedProject === projectId ? null : projectId);
    setExpandedTask(null);
    setExpandedAction(null);
  };

  // Handle task click
  const handleTaskClick = (taskId: string) => {
    selectTask(taskId);
    setExpandedTask(expandedTask === taskId ? null : taskId);
    setExpandedAction(null);
  };

  // Handle action click
  const handleActionClick = (actionId: string) => {
    selectAction(actionId);
    setExpandedAction(expandedAction === actionId ? null : actionId);
  };

  // Handle sub-action click
  const handleSubActionClick = (subActionId: string) => {
    selectSubAction(subActionId);
  };

  // Get selected project
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  
  // Get selected task
  const selectedTask = selectedProject?.tasks.find(t => t.id === selectedTaskId);
  
  // Get selected action
  const selectedAction = selectedTask?.actions.find(a => a.id === selectedActionId);

  // Show start button if all selections are made
  const showStartButton = selectedProjectId && selectedTaskId && selectedActionId && selectedSubActionId && !activeTask;

  // Handle start button click
  const handleStartClick = () => {
    startTask();
  };

  return (
    <div className="w-full h-full flex flex-col overflow-auto bg-sidebar">
      <div className="p-4 text-lg font-bold border-b border-sidebar-border">
        Tasks
      </div>
      
      <div className="flex-grow overflow-auto p-3">
        {projects.map(project => (
          <div key={project.id} className="mb-2">
            {/* Project Dropdown */}
            <div 
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                expandedProject === project.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent'
              }`}
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="flex items-center">
                {expandedProject === project.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <span className="ml-2">{project.name}</span>
              </div>
              <span className="text-xs py-1 px-2 rounded bg-secondary">{project.status}</span>
            </div>
            
            {/* Tasks */}
            {expandedProject === project.id && project.tasks.length > 0 && (
              <div className="ml-6 mt-1">
                {project.tasks.map(task => (
                  <div key={task.id} className="mb-1">
                    {/* Task Dropdown */}
                    <div 
                      className={`flex items-center p-2 rounded-lg cursor-pointer ${
                        expandedTask === task.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent'
                      }`}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      {task.actions.length > 0 ? (
                        expandedTask === task.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      ) : (
                        <span className="w-4"></span>
                      )}
                      <span className="ml-2">{task.name}</span>
                      <span className="ml-2 text-xs py-1 px-2 rounded bg-secondary">{task.status}</span>
                    </div>
                    
                    {/* Actions */}
                    {expandedTask === task.id && task.actions.length > 0 && (
                      <div className="ml-6 mt-1">
                        {task.actions.map(action => (
                          <div key={action.id} className="mb-1">
                            {/* Action Dropdown */}
                            <div 
                              className={`flex items-center p-2 rounded-lg cursor-pointer ${
                                expandedAction === action.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent'
                              }`}
                              onClick={() => handleActionClick(action.id)}
                            >
                              {action.subActions.length > 0 ? (
                                expandedAction === action.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                              ) : (
                                <span className="w-3.5"></span>
                              )}
                              <span className="ml-2">{action.name}</span>
                            </div>
                            
                            {/* Sub Actions */}
                            {expandedAction === action.id && action.subActions.length > 0 && (
                              <div className="ml-6 mt-1">
                                {action.subActions.map(subAction => (
                                  <div 
                                    key={subAction.id} 
                                    className={`p-2 rounded-lg cursor-pointer ${
                                      selectedSubActionId === subAction.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent'
                                    }`}
                                    onClick={() => handleSubActionClick(subAction.id)}
                                  >
                                    {subAction.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Start Button */}
      {showStartButton && (
        <div className="p-4 border-t border-sidebar-border">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white" 
            onClick={handleStartClick}
          >
            Start Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
