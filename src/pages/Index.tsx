
import React, { useState, useEffect } from 'react';
import { useActivityTracker } from '../hooks/useActivityTracker';
import { ThemeProvider } from '../context/ThemeContext';
import { TaskProvider } from '../context/TaskContext';
import Sidebar from '../components/Sidebar';
import TaskDetails from '../components/TaskDetails';
import Navigation from '../components/Navigation';
import Settings from '../components/Settings';

const Index: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  
  // In an Electron app, this would use Electron's remote module
  const handleQuit = () => {
    console.log('Application quit requested');
    // In Electron: window.electron.ipcRenderer.send('quit-app');
    alert('In an Electron app, this would close the application.');
  };
  
  return (
    <ThemeProvider>
      <TaskProvider>
        {/* This hook handles activity tracking */}
        <ActivityTracker />
        
        <div className="h-screen flex flex-col">
          {/* Main content */}
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-1/3 md:border-r border-border overflow-auto">
              <Sidebar />
            </div>
            
            {/* Task Details */}
            <div className="w-full md:w-2/3 overflow-auto">
              <TaskDetails />
            </div>
          </div>
          
          {/* Navigation */}
          <Navigation 
            onOpenSettings={() => setShowSettings(true)} 
            onQuit={handleQuit} 
          />
        </div>
        
        {/* Settings Modal */}
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      </TaskProvider>
    </ThemeProvider>
  );
};

// Separate component to avoid re-renders
const ActivityTracker: React.FC = () => {
  useActivityTracker();
  return null;
};

export default Index;
