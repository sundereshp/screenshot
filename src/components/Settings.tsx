
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { mouseCount, keyboardCount } = useTaskContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border rounded-lg shadow-lg w-[90%] max-w-md max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-5">
          {/* Theme Setting */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Theme</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-switch">Dark Theme</Label>
              <Switch 
                id="theme-switch" 
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
          
          {/* User Activity */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">User Activity</h3>
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span>Mouse Events:</span>
                <span className="font-mono">{mouseCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Keyboard Events:</span>
                <span className="font-mono">{keyboardCount}</span>
              </div>
            </div>
          </div>
          
          {/* Warnings */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Warnings</h3>
            <div className="text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>Blank screenshots will trigger alerts</li>
                <li>Inactivity periods will be monitored</li>
                <li>Breaks exceeding 1 hour will trigger warnings</li>
              </ul>
            </div>
          </div>
          
          {/* Mock User Information */}
          <div>
            <h3 className="font-medium mb-3">User Information</h3>
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm">
                <div className="mb-1">Username: demo@example.com</div>
                <div>Status: Active</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
