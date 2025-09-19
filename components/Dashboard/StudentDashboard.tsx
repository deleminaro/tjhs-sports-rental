import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { User } from '@/types';
import { Calendar, Clock, Package, AlertCircle, History } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';
import RentalHistory from '../Student/RentalHistory';

interface StudentDashboardProps {
  user: User;
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const { getRentalsByUser, equipment } = useStore();
  const [currentView, setCurrentView] = useState<'dashboard' | 'history'>('dashboard');
  const userRentals = getRentalsByUser(user.id);
  const activeRentals = userRentals.filter(rental => rental.status === 'active');
  const overdueRentals = userRentals.filter(rental => 
    rental.status === 'active' && new Date(rental.dueDate) < new Date()
  );

  const getTimeSlotInfo = (timeSlot: string) => {
    return timeSlot === 'recess' 
      ? { name: 'Recess', time: '11:00 - 11:30' }
      : { name: 'Lunch', time: '12:30 - 13:00' };
  };

  const isCurrentlyRentable = () => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const recessStart = 11 * 100; // 11:00
    const recessEnd = 11 * 100 + 30; // 11:30
    const lunchStart = 12 * 100 + 30; // 12:30
    const lunchEnd = 13 * 100; // 13:00
    
    return (currentTime >= recessStart && currentTime <= recessEnd) || 
           (currentTime >= lunchStart && currentTime <= lunchEnd);
  };

  if (currentView === 'history') {
    return <RentalHistory user={user} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="mt-2 text-gray-600">
              Manage your sports equipment rentals at TJHS
            </p>
          </div>
          <button
            onClick={() => setCurrentView('history')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"
          >
            <History className="h-4 w-4 mr-2" />
            View History
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-tjhs-blue" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Rentals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activeRentals.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overdue Items
                  </dt>
                  <dd className="text-lg font-medium text-red-600">
                    {overdueRentals.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-tjhs-green" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rental Status
                  </dt>
                  <dd className="text-lg font-medium text-tjhs-green">
                    {isCurrentlyRentable() ? 'Open' : 'Closed'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Rentals */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Your Current Rentals
          </h3>
          
          {activeRentals.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active rentals</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't rented any equipment yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRentals.map((rental) => {
                const timeSlotInfo = getTimeSlotInfo(rental.timeSlot);
                const isOverdue = new Date(rental.dueDate) < new Date();
                
                return (
                  <div
                    key={rental.id}
                    className={`border rounded-lg p-4 ${
                      isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">
                          {rental.equipmentName}
                        </h4>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(rental.date), 'EEEE, MMMM do, yyyy')}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {timeSlotInfo.name} ({timeSlotInfo.time})
                        </div>
                        {isOverdue && (
                          <div className="mt-2 flex items-center text-sm text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Overdue - Please return immediately
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isOverdue 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isOverdue ? 'Overdue' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rental Times Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Rental Information</h4>
        <div className="text-sm text-blue-700">
          <p><strong>Recess:</strong> 11:00 AM - 11:30 AM</p>
          <p><strong>Lunch:</strong> 12:30 PM - 1:00 PM</p>
          <p className="mt-2 text-xs">
            Equipment can be booked for any day up to 30 days in advance. Must be returned by end of time slot.
          </p>
        </div>
      </div>
    </div>
  );
}
