import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useTaskContext } from '../contexts/TaskContext';
import Navbar from '../components/Navbar';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';

interface SettingsPageProps {
  onBackClick: () => void;
  onQuitClick: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBackClick, onQuitClick }) => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { keyboardCount, mouseCount, lastScreenshotTime } = useTaskContext();
  const [warnings] = useState([
    {
      id: 1,
      type: 'Screenshot Warning',
      message: 'Blank screenshot detected at 14:35.',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'Activity Warning',
      message: 'No activity detected for more than 15 minutes.',
      time: '1 day ago',
    },
    {
      id: 3,
      type: 'Break Warning',
      message: 'Break time exceeded 1 hour limit.',
      time: '2 days ago',
    },
  ]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar 
        title="Settings"
        onSettingsClick={onBackClick}
        onQuitClick={onQuitClick}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 flex items-center" 
            onClick={onBackClick}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Appearance</h2>
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={toggleTheme}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">User Account</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-medium text-lg">U</span>
                  </div>
                  <div>
                    <div className="font-medium">Demo User</div>
                    <div className="text-sm text-muted-foreground">demo@example.com</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  Sign Out
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Activity Monitoring</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Keyboard Count:</span>
                  <span className="font-medium">{keyboardCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Mouse Movements:</span>
                  <span className="font-medium">{mouseCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Screenshot:</span>
                  <span className="font-medium">
                    {lastScreenshotTime ? format(new Date(lastScreenshotTime), 'PPpp') : 'Never'}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Recent Warnings</h2>
              <div className="space-y-3">
                {warnings.map((warning) => (
                  <div key={warning.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{warning.type}</span>
                        <span className="text-xs text-muted-foreground">{warning.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{warning.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
