'use client';

import React from 'react';
import { Bell, Car, Users, BarChart3, Settings, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

function NotificationMenu() {
  const router = useRouter();

  const notificationItems = [
    { label: 'New Rental Request', icon: Car, type: 'info', time: '2 hours ago' },
    { label: 'Payment Received', icon: Users, type: 'success', time: '4 hours ago' },
    { label: 'Contract Expiring', icon: FileText, type: 'warning', time: '1 day ago' },
    { label: 'Vehicle Maintenance', icon: Settings, type: 'warning', time: '2 days ago' },
    { label: 'New Client Registration', icon: Users, type: 'info', time: '3 days ago' }
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="relative bg-amber-500 hover:bg-amber-600 p-2 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notificationItems.length}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notificationItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <DropdownMenuItem
              key={index}
              className="flex items-start gap-3 p-3 cursor-pointer"
            >
              <div className={`mt-1 ${getNotificationColor(item.type)}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.time}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationMenu;
