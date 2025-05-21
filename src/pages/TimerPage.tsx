import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import Navbar from '../components/Navbar';
import TimerControls from '../components/TimerControls';
import TimerDisplay from '../components/TimerDisplay';
import ScreenshotDisplay from '../components/ScreenshotDisplay';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Keyboard, Mouse } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TimerPageProps {
  onSettingsClick: () => void;
  onQuitClick: () => void;
}

const TimerPage: React.FC<TimerPageProps> = ({ onSettingsClick, onQuitClick }) => {
  const navigate = useNavigate();
  const { 
    timer, 
    selectedTaskDetails,
    keyboardCount,
    mouseCount,
    getTaskActivity
  } = useTaskContext();
  
  // If there's no active timer, redirect to the task selection page
  React.useEffect(() => {
    if (!timer.isRunning && !timer.isPaused) {
      navigate('/');
    }
  }, [timer.isRunning, timer.isPaused, navigate]);
  
  if (!selectedTaskDetails) {
    return null;
  }

  const handleBackToTaskSelection = () => {
    navigate('/');
  };

  // Get activity for the current task
  const taskActivity = timer.taskId ? getTaskActivity(timer.taskId) : { keyboardCount: 0, mouseCount: 0 };
  const currentKeyboardCount = taskActivity.keyboardCount || 0;
  const currentMouseCount = taskActivity.mouseCount || 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar 
        title="Timer Running"
        onSettingsClick={onSettingsClick}
        onQuitClick={onQuitClick}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 flex items-center" 
            onClick={handleBackToTaskSelection}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to tasks
          </Button>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Task Info Card */}
            <Card className="p-4">
              <h2 className="text-xl font-bold">{selectedTaskDetails.name}</h2>
              <div className="flex items-center mt-2">
                <div className={`status-badge status-${selectedTaskDetails.status.replace(' ', '-')} text-sm py-1 px-3 rounded-full`}>
                  {selectedTaskDetails.status}
                </div>
              </div>
            </Card>
            
            {/* Timer Display */}
            <Card className="p-6">
              <TimerDisplay />
            </Card>
            
            
            {/* Timer Controls */}
            <Card className="p-4">
              <TimerControls />
            </Card>
            
            {/* Screenshot Display */}
            <Card className="p-4">
              <ScreenshotDisplay />
            </Card>
            
            {/* Add some padding at the bottom for better scrolling */}
            <div className="h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerPage;
