import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { User, Rental } from '@/types';
import { format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { Calendar, Clock, Package, User as UserIcon, CheckCircle, AlertCircle, Search } from 'lucide-react';
import BulkOperations from './BulkOperations';

interface TeacherDashboardProps {
  user: User;
}

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const { rentals, users, returnRental, getRentalsByDate } = useStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'returned' | 'overdue'>('all');

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const getFilteredRentals = () => {
    let filtered = rentals;

    // Filter by date
    filtered = filtered.filter(rental => rental.date === selectedDate);

    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'overdue') {
        filtered = filtered.filter(rental => 
          rental.status === 'active' && new Date(rental.dueDate) < new Date()
        );
      } else {
        filtered = filtered.filter(rental => rental.status === filterStatus);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(rental => {
        const user = users.find(u => u.id === rental.userId);
        return (
          rental.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rental.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user && user.studentId && user.studentId.includes(searchTerm))
        );
      });
    }

    return filtered.sort((a, b) => {
      // Sort by time slot, then by equipment name
      if (a.timeSlot !== b.timeSlot) {
        return a.timeSlot === 'recess' ? -1 : 1;
      }
      return a.equipmentName.localeCompare(b.equipmentName);
    });
  };

  const handleReturn = (rentalId: string) => {
    if (confirm('Mark this equipment as returned?')) {
      returnRental(rentalId);
    }
  };

  const getRentalStats = () => {
    const dayRentals = rentals.filter(rental => rental.date === selectedDate);
    const active = dayRentals.filter(rental => rental.status === 'active').length;
    const returned = dayRentals.filter(rental => rental.status === 'returned').length;
    const overdue = dayRentals.filter(rental => 
      rental.status === 'active' && new Date(rental.dueDate) < new Date()
    ).length;

    return { total: dayRentals.length, active, returned, overdue };
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getUserDetails = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? {
      name: user.name,
      studentId: user.studentId,
      year: user.year
    } : { name: 'Unknown User', studentId: '', year: 0 };
  };

  const stats = getRentalStats();
  const filteredRentals = getFilteredRentals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage equipment rentals and returns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-tjhs-blue" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Rentals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
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
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.active}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Returned
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.returned}
                </dd>
              </dl>
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
                    Overdue
                  </dt>
                  <dd className="text-lg font-medium text-red-600">
                    {stats.overdue}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Operations */}
      <BulkOperations 
        rentals={filteredRentals} 
        onRefresh={() => window.location.reload()} 
      />

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="search"
                placeholder="Search by name, equipment, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rentals List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Rentals for {format(new Date(selectedDate), 'EEEE, MMMM do, yyyy')}
          </h3>
          
          {filteredRentals.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No rentals found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No equipment rentals for the selected date and filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRentals.map((rental) => {
                const userDetails = getUserDetails(rental.userId);
                const isOverdue = rental.status === 'active' && new Date(rental.dueDate) < new Date();
                const timeSlotInfo = rental.timeSlot === 'recess' 
                  ? { name: 'Recess', time: '11:00 - 11:30' }
                  : { name: 'Lunch', time: '12:30 - 13:00' };
                
                return (
                  <div
                    key={rental.id}
                    className={`border rounded-lg p-4 ${
                      isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="text-lg font-medium text-gray-900">
                            {rental.equipmentName}
                          </h4>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rental.status === 'returned'
                              ? 'bg-green-100 text-green-800'
                              : isOverdue
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {rental.status === 'returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Active'}
                          </span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-2" />
                            <span>{userDetails.name}</span>
                            {userDetails.studentId && (
                              <span className="ml-2 text-gray-500">(ID: {userDetails.studentId})</span>
                            )}
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{timeSlotInfo.name} ({timeSlotInfo.time})</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              Rented: {format(new Date(rental.rentedAt), 'HH:mm')}
                            </span>
                          </div>
                          
                          {rental.returnedAt && (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              <span>
                                Returned: {format(new Date(rental.returnedAt), 'HH:mm')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {rental.status === 'active' && (
                        <button
                          onClick={() => handleReturn(rental.id)}
                          className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                          Mark Returned
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
