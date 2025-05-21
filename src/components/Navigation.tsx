
import React from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onOpenSettings: () => void;
  onQuit: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onOpenSettings, onQuit }) => {
  return (
    <div className="w-full border-t border-border p-2 flex justify-between items-center">
      <Button variant="ghost" size="sm" onClick={onOpenSettings}>
        <Settings className="mr-2 h-4 w-4" /> Settings
      </Button>
      
      <Button variant="ghost" size="sm" className="text-destructive" onClick={onQuit}>
        <X className="mr-2 h-4 w-4" /> Quit
      </Button>
    </div>
  );
};

export default Navigation;
