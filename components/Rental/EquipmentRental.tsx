import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { User, TIME_SLOTS } from '@/types';
import { format, addDays, isWeekend } from 'date-fns';
import { Package, Clock, AlertCircle } from 'lucide-react';

interface EquipmentRentalProps {
  user: User;
}

export default function EquipmentRental({ user }: EquipmentRentalProps) {
  const { equipment, addRental, getRentalsByDate } = useStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'recess' | 'lunch' | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [isRenting, setIsRenting] = useState(false);

  const today = new Date();
  const maxDate = format(addDays(today, 30), 'yyyy-MM-dd'); // Allow booking up to 30 days ahead

  const isCurrentlyRentable = () => {
    // Allow booking on any day, any time
    return true;
  };

  const getAvailableEquipment = () => {
    return equipment.filter(item => item.availableQuantity > 0);
  };

  const getRentalsForSelectedSlot = () => {
    if (!selectedDate || !selectedTimeSlot) return [];
    return getRentalsByDate(selectedDate).filter(rental => rental.timeSlot === selectedTimeSlot);
  };

  const isEquipmentRented = (equipmentId: string) => {
    const rentals = getRentalsForSelectedSlot();
    return rentals.some(rental => rental.equipmentId === equipmentId);
  };

  const handleRental = async () => {
    if (!selectedEquipment || !selectedTimeSlot || !selectedDate) return;

    const equipmentItem = equipment.find(item => item.id === selectedEquipment);
    if (!equipmentItem) return;

    setIsRenting(true);

    // Create rental
    const rental = {
      id: Date.now().toString(),
      userId: user.id,
      equipmentId: selectedEquipment,
      equipmentName: equipmentItem.name,
      sport: equipmentItem.sport,
      timeSlot: selectedTimeSlot,
      date: selectedDate,
      status: 'active' as const,
      rentedAt: new Date(),
      dueDate: new Date(selectedDate + ' ' + (selectedTimeSlot === 'recess' ? '11:30' : '13:00'))
    };

    addRental(rental);
    
    // Reset form
    setSelectedEquipment(null);
    setSelectedTimeSlot(null);
    setIsRenting(false);
    
    alert('Equipment rented successfully!');
  };

  const isWeekendDay = isWeekend(new Date(selectedDate));
  const canRentToday = selectedDate === format(today, 'yyyy-MM-dd') && isCurrentlyRentable();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rent Sports Equipment</h1>
        <p className="mt-2 text-gray-600">
          Book equipment for recess or lunch periods
        </p>
      </div>

      {/* Rental Info */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Equipment Rental Available
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              You can book equipment for any day up to 30 days in advance. Equipment must be returned by the end of the selected time slot.
            </p>
          </div>
        </div>
      </div>

      {/* Weekend booking is now allowed */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Selection Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select Rental Details</h2>
          
          <div className="space-y-4">
            {/* Date Selection */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                min={format(today, 'yyyy-MM-dd')}
                max={maxDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Slot
              </label>
              <div className="space-y-2">
                {TIME_SLOTS.map((slot) => (
                  <label key={slot.id} className="flex items-center">
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot.id}
                      checked={selectedTimeSlot === slot.id}
                      onChange={(e) => setSelectedTimeSlot(e.target.value as 'recess' | 'lunch')}
                      className="focus:ring-tjhs-blue h-4 w-4 text-tjhs-blue border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {slot.name} ({slot.startTime} - {slot.endTime})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Equipment Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment
              </label>
              <div className="space-y-2">
                {getAvailableEquipment().map((item) => {
                  const isRented = isEquipmentRented(item.id);
                  const isSelected = selectedEquipment === item.id;
                  
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                        isRented
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : isSelected
                          ? 'border-tjhs-blue bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="equipment"
                        value={item.id}
                        checked={isSelected}
                        onChange={(e) => setSelectedEquipment(e.target.value)}
                        disabled={isRented}
                        className="focus:ring-tjhs-blue h-4 w-4 text-tjhs-blue border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.availableQuantity} available
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 capitalize">
                          {item.sport} • {item.description}
                        </p>
                        {isRented && (
                          <p className="text-xs text-red-600 mt-1">
                            Already rented for this time slot
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Rent Button */}
            <button
              onClick={handleRental}
              disabled={!selectedEquipment || !selectedTimeSlot || isRenting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tjhs-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tjhs-blue disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isRenting ? 'Renting...' : 'Rent Equipment'}
            </button>
          </div>
        </div>

        {/* Equipment Overview */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Available Equipment</h2>
          
          <div className="space-y-4">
            {equipment.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-tjhs-blue" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{item.sport}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {item.availableQuantity}/{item.totalQuantity}
                  </div>
                  <div className="text-xs text-gray-500">available</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Rental Information</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Equipment is free for all TJHS students</li>
              <li>• First come, first served basis</li>
              <li>• Must be returned by end of time slot</li>
              <li>• Available for booking up to 30 days in advance</li>
              <li>• Can be booked for any day of the week</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
