import React from 'react';
import { User } from '@/types';
import { Home, Calendar, Users, Settings, Package } from 'lucide-react';

interface NavigationProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ user, currentPage, onNavigate }: NavigationProps) {
  const getNavItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    if (user.role === 'student') {
      return [
        ...baseItems,
        { id: 'rent', label: 'Rent Equipment', icon: Package },
        { id: 'my-rentals', label: 'My Rentals', icon: Calendar },
      ];
    }

    if (user.role === 'teacher') {
      return [
        ...baseItems,
        { id: 'manage-rentals', label: 'Manage Rentals', icon: Calendar },
        { id: 'return-equipment', label: 'Return Equipment', icon: Package },
      ];
    }

    if (user.role === 'admin') {
      return [
        ...baseItems,
        { id: 'manage-rentals', label: 'All Rentals', icon: Calendar },
        { id: 'manage-equipment', label: 'Equipment', icon: Package },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-tjhs-blue text-tjhs-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
