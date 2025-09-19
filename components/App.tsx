import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { User } from '@/types';
import LoginForm from './Auth/LoginForm';
import Header from './Layout/Header';
import Navigation from './Layout/Navigation';
import StudentDashboard from './Dashboard/StudentDashboard';
import EquipmentRental from './Rental/EquipmentRental';
import TeacherDashboard from './Teacher/TeacherDashboard';
import AdminDashboard from './Admin/AdminDashboard';

export default function App() {
  const { currentUser, setCurrentUser } = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('tjhs-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        localStorage.removeItem('tjhs-user');
      }
    }
    setIsLoading(false);
  }, [setCurrentUser]);

  const handleLoginSuccess = () => {
    // Save user to localStorage
    if (currentUser) {
      localStorage.setItem('tjhs-user', JSON.stringify(currentUser));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tjhs-user');
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (!currentUser) return null;

    switch (currentPage) {
      case 'dashboard':
        if (currentUser.role === 'student') {
          return <StudentDashboard user={currentUser} />;
        } else if (currentUser.role === 'teacher') {
          return <TeacherDashboard user={currentUser} />;
        } else if (currentUser.role === 'admin') {
          return <AdminDashboard user={currentUser} />;
        }
        break;
      
      case 'rent':
        return <EquipmentRental user={currentUser} />;
      
      case 'my-rentals':
        return <StudentDashboard user={currentUser} />;
      
      case 'manage-rentals':
        return <TeacherDashboard user={currentUser} />;
      
      case 'return-equipment':
        return <TeacherDashboard user={currentUser} />;
      
      case 'manage-equipment':
        return <AdminDashboard user={currentUser} />;
      
      case 'users':
        return <AdminDashboard user={currentUser} />;
      
      case 'settings':
        return <AdminDashboard user={currentUser} />;
      
      default:
        return <StudentDashboard user={currentUser} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tjhs-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} onLogout={handleLogout} />
      <Navigation 
        user={currentUser} 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
      />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}
