import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { User, Rental } from '@/types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays } from 'date-fns';
import { Calendar, Users, Package, TrendingUp, AlertCircle, CheckCircle, Mail, Settings } from 'lucide-react';
import EmailNotifications from './EmailNotifications';
import EquipmentManagement from './EquipmentManagement';

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { users, rentals, equipment, getOverdueRentals } = useStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [currentView, setCurrentView] = useState<'overview' | 'notifications' | 'equipment'>('overview');

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  const getStats = () => {
    const totalUsers = users.length;
    const studentUsers = users.filter(u => u.role === 'student').length;
    const teacherUsers = users.filter(u => u.role === 'teacher').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    
    const totalRentals = rentals.length;
    const activeRentals = rentals.filter(r => r.status === 'active').length;
    const overdueRentals = getOverdueRentals().length;
    const returnedRentals = rentals.filter(r => r.status === 'returned').length;

    const totalEquipment = equipment.reduce((sum, item) => sum + item.totalQuantity, 0);
    const availableEquipment = equipment.reduce((sum, item) => sum + item.availableQuantity, 0);
    const rentedEquipment = totalEquipment - availableEquipment;

    return {
      users: { total: totalUsers, students: studentUsers, teachers: teacherUsers, admins: adminUsers },
      rentals: { total: totalRentals, active: activeRentals, overdue: overdueRentals, returned: returnedRentals },
      equipment: { total: totalEquipment, available: availableEquipment, rented: rentedEquipment }
    };
  };

  const getRentalsForDate = (date: string) => {
    return rentals.filter(rental => rental.date === date);
  };

  const getWeeklyRentals = () => {
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    return weekDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayRentals = getRentalsForDate(dayStr);
      return {
        date: dayStr,
        dayName: format(day, 'EEE'),
        rentals: dayRentals.length,
        active: dayRentals.filter(r => r.status === 'active').length,
        returned: dayRentals.filter(r => r.status === 'returned').length
      };
    });
  };

  const getRecentUsers = () => {
    return users
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getTopRentedEquipment = () => {
    const equipmentStats = equipment.map(item => {
      const rentedCount = rentals.filter(r => r.equipmentId === item.id).length;
      return {
        ...item,
        rentedCount,
        utilizationRate: (rentedCount / item.totalQuantity) * 100
      };
    });

    return equipmentStats.sort((a, b) => b.rentedCount - a.rentedCount);
  };

  const stats = getStats();
  const weeklyData = getWeeklyRentals();
  const recentUsers = getRecentUsers();
  const topEquipment = getTopRentedEquipment();

  if (currentView === 'notifications') {
    return <EmailNotifications />;
  }

  if (currentView === 'equipment') {
    return <EquipmentManagement />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              System overview and management
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentView === 'overview'
                  ? 'bg-tjhs-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('notifications')}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                currentView === 'notifications'
                  ? 'bg-tjhs-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mail className="h-4 w-4 mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setCurrentView('equipment')}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                currentView === 'equipment'
                  ? 'bg-tjhs-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Equipment
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-tjhs-blue" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.users.total}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {stats.users.students} students • {stats.users.teachers} teachers • {stats.users.admins} admins
            </div>
          </div>
        </div>

        {/* Rentals Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-tjhs-green" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Rentals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.rentals.total}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {stats.rentals.active} active • {stats.rentals.returned} returned
            </div>
          </div>
        </div>

        {/* Equipment Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-tjhs-gold" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Equipment
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.equipment.rented}/{stats.equipment.total}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {stats.equipment.available} available
            </div>
          </div>
        </div>

        {/* Overdue Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overdue
                  </dt>
                  <dd className="text-lg font-medium text-red-600">
                    {stats.rentals.overdue}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Need attention
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Calendar View */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Weekly Overview</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'day' 
                    ? 'bg-tjhs-blue text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'week' 
                    ? 'bg-tjhs-blue text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Week
              </button>
            </div>
          </div>

          {viewMode === 'week' ? (
            <div className="space-y-2">
              {weeklyData.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {day.dayName} {format(new Date(day.date), 'MMM d')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{day.rentals} total</span>
                    <span className="text-green-600">{day.returned} returned</span>
                    <span className="text-yellow-600">{day.active} active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Daily View</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a specific date to view detailed rental information.
              </p>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
          
          {recentUsers.length === 0 ? (
            <div className="text-center py-4">
              <Users className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No users yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-tjhs-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(user.createdAt), 'MMM d')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Equipment Utilization */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Utilization</h3>
        
        <div className="space-y-4">
          {topEquipment.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-tjhs-blue mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{item.sport}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {item.rentedCount} rentals
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.utilizationRate.toFixed(1)}% utilization
                  </div>
                </div>
                
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-tjhs-blue h-2 rounded-full" 
                    style={{ width: `${Math.min(item.utilizationRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
