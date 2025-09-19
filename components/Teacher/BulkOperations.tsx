import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Rental } from '@/types';
import { CheckCircle, AlertCircle, Package, Users } from 'lucide-react';

interface BulkOperationsProps {
  rentals: Rental[];
  onRefresh: () => void;
}

export default function BulkOperations({ rentals, onRefresh }: BulkOperationsProps) {
  const { returnRental } = useStore();
  const [selectedRentals, setSelectedRentals] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeRentals = rentals.filter(rental => rental.status === 'active');
  const overdueRentals = rentals.filter(rental => 
    rental.status === 'active' && new Date(rental.dueDate) < new Date()
  );

  const handleSelectAll = () => {
    if (selectedRentals.length === activeRentals.length) {
      setSelectedRentals([]);
    } else {
      setSelectedRentals(activeRentals.map(rental => rental.id));
    }
  };

  const handleSelectRental = (rentalId: string) => {
    setSelectedRentals(prev => 
      prev.includes(rentalId) 
        ? prev.filter(id => id !== rentalId)
        : [...prev, rentalId]
    );
  };

  const handleBulkReturn = async () => {
    if (selectedRentals.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Process each selected rental
      for (const rentalId of selectedRentals) {
        returnRental(rentalId);
      }
      
      setSelectedRentals([]);
      onRefresh();
      alert(`Successfully returned ${selectedRentals.length} equipment items!`);
    } catch (error) {
      console.error('Error processing bulk return:', error);
      alert('Error processing some returns. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturnOverdue = () => {
    if (overdueRentals.length === 0) return;
    
    if (confirm(`Return all ${overdueRentals.length} overdue items?`)) {
      setIsProcessing(true);
      
      try {
        overdueRentals.forEach(rental => returnRental(rental.id));
        setSelectedRentals([]);
        onRefresh();
        alert(`Successfully returned ${overdueRentals.length} overdue items!`);
      } catch (error) {
        console.error('Error processing overdue returns:', error);
        alert('Error processing overdue returns. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Operations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Active Rentals</p>
              <p className="text-lg font-bold text-blue-700">{activeRentals.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-900">Overdue Items</p>
              <p className="text-lg font-bold text-red-700">{overdueRentals.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Selected</p>
              <p className="text-lg font-bold text-green-700">{selectedRentals.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Select All */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedRentals.length === activeRentals.length && activeRentals.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-tjhs-blue focus:ring-tjhs-blue border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Select All Active Rentals ({activeRentals.length})
            </span>
          </label>
        </div>

        {/* Individual Selection */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {activeRentals.map((rental) => {
            const isOverdue = new Date(rental.dueDate) < new Date();
            const isSelected = selectedRentals.includes(rental.id);
            
            return (
              <div
                key={rental.id}
                className={`flex items-center p-3 border rounded-lg ${
                  isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectRental(rental.id)}
                  className="h-4 w-4 text-tjhs-blue focus:ring-tjhs-blue border-gray-300 rounded"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {rental.equipmentName}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {isOverdue ? 'Overdue' : 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {rental.sport} • Due: {new Date(rental.dueDate).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <button
            onClick={handleBulkReturn}
            disabled={selectedRentals.length === 0 || isProcessing}
            className="bg-tjhs-blue hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : `Return Selected (${selectedRentals.length})`}
          </button>
          
          <button
            onClick={handleReturnOverdue}
            disabled={overdueRentals.length === 0 || isProcessing}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Return All Overdue ({overdueRentals.length})
          </button>
          
          <button
            onClick={() => setSelectedRentals([])}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}
