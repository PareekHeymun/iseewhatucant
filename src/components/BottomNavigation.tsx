import React from 'react';
import { Button } from './ui/button';
import { Home, Map, Plus, User, BarChart3, Bell } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'citizen' | 'admin';
  hasNotifications?: boolean;
}

export function BottomNavigation({ activeTab, onTabChange, userRole, hasNotifications }: BottomNavigationProps) {
  const citizenTabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'report', icon: Plus, label: 'Report' },
    { id: 'my-reports', icon: User, label: 'My Reports' },
  ];

  const adminTabs = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'reports', icon: Bell, label: 'Reports', hasNotification: hasNotifications },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const tabs = userRole === 'admin' ? adminTabs : citizenTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isReportButton = tab.id === 'report';
            
            if (isReportButton) {
              return (
                <div key={tab.id} className="flex-1 p-2">
                  <Button
                    onClick={() => onTabChange(tab.id)}
                    className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Icon className="w-5 h-5 mr-1" />
                    {tab.label}
                  </Button>
                </div>
              );
            }

            return (
              <div key={tab.id} className="flex-1">
                <Button
                  variant="ghost"
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full h-16 flex flex-col items-center justify-center space-y-1 rounded-none relative
                    ${isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{tab.label}</span>
                  {tab.hasNotification && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}