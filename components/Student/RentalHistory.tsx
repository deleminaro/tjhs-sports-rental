import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { User, Rental } from '@/types';
import { Calendar, Clock, Package, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { format } from 'date-fns';

interface RentalHistoryProps {
  user: User;
}

export default function RentalHistory({ user }: RentalHistoryProps) {
  const { getRentalsByUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'returned' | 'overdue'>('all');
  
  const userRentals = getRentalsByUser(user.id);
  
  const getFilteredRentals = () => {
    let filtered = userRentals;
    
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
      filtered = filtered.filter(rental => 
        rental.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.sport.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.rentedAt).getTime() - new Date(a.rentedAt).getTime()
    );
  };

  const getTimeSlotInfo = (timeSlot: string) => {
    return timeSlot === 'recess' 
      ? { name: 'Recess', time: '11:00 - 11:30' }
      : { name: 'Lunch', time: '12:30 - 13:00' };
  };

  const getRentalStats = () => {
    const total = userRentals.length;
    const active = userRentals.filter(r => r.status === 'active').length;
    const returned = userRentals.filter(r => r.status === 'returned').length;
    const overdue = userRentals.filter(r => 
      r.status === 'active' && new Date(r.dueDate) < new Date()
    ).length;
    
    return { total, active, returned, overdue };
  };

  const stats = getRentalStats();
  const filteredRentals = getFilteredRentals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rental History</h1>
        <p className="mt-2 text-gray-600">
          View your equipment rental history
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
          <div className="p-5">
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

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Equipment
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="search"
                placeholder="Search by equipment name or sport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
            >
              <option value="all">All Rentals</option>
              <option value="active">Active</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rental History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Your Rental History
          </h3>
          
          {filteredRentals.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No rentals found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {userRentals.length === 0 
                  ? "You haven't rented any equipment yet."
                  : "No rentals match your current filters."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRentals.map((rental) => {
                const timeSlotInfo = getTimeSlotInfo(rental.timeSlot);
                const isOverdue = rental.status === 'active' && new Date(rental.dueDate) < new Date();
                
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
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{format(new Date(rental.date), 'EEEE, MMMM do, yyyy')}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{timeSlotInfo.name} ({timeSlotInfo.time})</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2" />
                            <span className="capitalize">{rental.sport}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="text-gray-500">
                              Rented: {format(new Date(rental.rentedAt), 'MMM d, yyyy HH:mm')}
                            </span>
                          </div>
                          
                          {rental.returnedAt && (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              <span>
                                Returned: {format(new Date(rental.returnedAt), 'MMM d, yyyy HH:mm')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
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
