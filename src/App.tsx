import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from './components/Navigation';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import TaskDetails from './components/TaskDetails';

const App = () => {
  const [showSettings, setShowSettings] = useState(false);

  const handleOpenSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);
  
  const handleQuit = () => {
    if (window.electron && typeof window.electron.quit === 'function') {
      window.electron.quit();
    } else {
      console.log('Quit requested - running in browser mode');
      // Optional: Provide browser fallback behavior
      if (window.confirm('Are you sure you want to quit?')) {
        window.close();
      }
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <TooltipProvider>
        {/* Sidebar */}
        <div className="w-80 border-r border-border">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Task Details */}
          <div className="flex-1 overflow-auto">
            <TaskDetails />
          </div>

          {/* Navigation */}
          <Navigation 
            onOpenSettings={handleOpenSettings}
            onQuit={handleQuit}
          />
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <Settings onClose={handleCloseSettings} />
        )}

        <Toaster />
      </TooltipProvider>
    </div>
  );
};

export default App;
