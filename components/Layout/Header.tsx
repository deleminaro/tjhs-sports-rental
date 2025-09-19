import React from 'react';
import { useStore } from '@/store/useStore';
import { User } from '@/types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-tjhs-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">TJHS Sports Rental</h1>
            <span className="ml-4 text-sm bg-tjhs-gold text-tjhs-blue px-2 py-1 rounded">
              The Jannali High School
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-blue-200 capitalize">{user.role}</p>
              {user.studentId && (
                <p className="text-xs text-blue-200">ID: {user.studentId}</p>
              )}
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
