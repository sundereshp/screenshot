
import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, StopCircle, Coffee } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TaskDetails: React.FC = () => {
  const {
    projects,
    activeTask,
    pauseTask,
    resumeTask,
    takeBreak,
    endBreak,
    stopTask,
    lastScreenshotTime,
    lastScreenshotData,
  } = useTaskContext();

  if (!activeTask) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Active Task</h2>
          <p>Select a task from the sidebar to begin</p>
        </div>
      </div>
    );
  }

  // Find active project, task, action, and sub-action details
  const activeProject = projects.find(p => p.id === activeTask.projectId);
  const activeTaskDetails = activeProject?.tasks.find(t => t.id === activeTask.taskId);
  const activeAction = activeTaskDetails?.actions.find(a => a.id === activeTask.actionId);
  const activeSubAction = activeAction?.subActions.find(sa => sa.id === activeTask.subActionId);

  // Calculate time values
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Estimated time in minutes to seconds
  const estimatedTimeInSeconds = (activeTaskDetails?.estimatedTime || 0) * 60;
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((activeTask.totalTimeSpent / estimatedTimeInSeconds) * 100),
    100
  );

  return (
    <div className="h-full flex flex-col overflow-auto">
      <div className="p-4 text-lg font-bold border-b border-sidebar-border flex justify-between items-center">
        <span>Task Details</span>
        {lastScreenshotTime && (
          <span className="text-xs text-muted-foreground">
            Screenshot: {formatDistanceToNow(lastScreenshotTime, { addSuffix: true })}
          </span>
        )}
      </div>

      <div className="flex-grow p-4 overflow-auto">
        {/* Task Information */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">{activeSubAction?.name}</h2>
          <div className="text-muted-foreground mb-4">
            <div>{activeProject?.name} &gt; {activeTaskDetails?.name} &gt; {activeAction?.name}</div>
          </div>
          
          {/* Timer Controls */}
          <div className="flex gap-2 mb-6">
            {activeTask.timerPaused ? (
              <Button onClick={resumeTask} className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2 h-4 w-4" /> Resume
              </Button>
            ) : (
              <Button onClick={pauseTask} disabled={!!activeTask.breakStarted}>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </Button>
            )}

            {activeTask.breakStarted ? (
              <Button onClick={endBreak} variant="outline">
                End Break
              </Button>
            ) : (
              <Button onClick={takeBreak} variant="outline" disabled={activeTask.timerPaused}>
                <Coffee className="mr-2 h-4 w-4" /> Take Break
              </Button>
            )}

            <Button onClick={stopTask} variant="destructive">
              <StopCircle className="mr-2 h-4 w-4" /> Stop
            </Button>
          </div>
          
          {/* Timer Status */}
          <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {activeTask.breakStarted ? 'On Break' : 
               activeTask.timerPaused ? 'Timer Paused' : 'Timer Running'}
            </h3>
            
            <div className="text-3xl font-mono mb-2">{formatTime(activeTask.totalTimeSpent)}</div>
            
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-sm text-muted-foreground">Estimated Time</div>
                <div>{formatTime(estimatedTimeInSeconds)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Today's Time</div>
                <div>{formatTime(activeTask.todayTimeSpent)}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Screenshot Preview (if available) */}
        {lastScreenshotData && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Latest Screenshot</h3>
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={lastScreenshotData} 
                alt="Latest screenshot" 
                className="w-full h-auto"
              />
            </div>
            {lastScreenshotTime && (
              <div className="text-sm text-muted-foreground mt-1">
                Taken {formatDistanceToNow(lastScreenshotTime, { addSuffix: true })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
