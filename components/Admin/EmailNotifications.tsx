import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { EmailService, checkAndSendOverdueNotifications } from '@/utils/emailService';
import { Mail, Send, AlertCircle, Clock } from 'lucide-react';

export default function EmailNotifications() {
  const { getOverdueRentals, users } = useStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const emailService = EmailService.getInstance();

  useEffect(() => {
    // Load existing notifications
    setNotifications(emailService.getNotifications());
  }, []);

  const handleSendOverdueNotifications = async () => {
    setIsSending(true);
    
    try {
      const overdueRentals = getOverdueRentals();
      await checkAndSendOverdueNotifications(overdueRentals, users);
      
      // Refresh notifications
      setNotifications(emailService.getNotifications());
      setLastChecked(new Date());
      
      alert(`Sent ${overdueRentals.length} overdue notifications successfully!`);
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Failed to send some notifications. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const clearNotifications = () => {
    emailService.clearNotifications();
    setNotifications([]);
  };

  const overdueRentals = getOverdueRentals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Email Notifications</h1>
        <p className="mt-2 text-gray-600">
          Manage overdue rental notifications
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overdue Rentals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
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
                <Mail className="h-6 w-6 text-tjhs-blue" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Notifications Sent
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {notifications.length}
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
                    Last Checked
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Send Notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              Send email notifications to students with overdue equipment
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSendOverdueNotifications}
              disabled={isSending || overdueRentals.length === 0}
              className="bg-tjhs-blue hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSending ? 'Sending...' : `Send ${overdueRentals.length} Notifications`}
            </button>
            <button
              onClick={clearNotifications}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md text-sm font-medium"
            >
              Clear History
            </button>
          </div>
        </div>
      </div>

      {/* Overdue Rentals List */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Overdue Rentals
          </h3>
          
          {overdueRentals.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No overdue rentals</h3>
              <p className="mt-1 text-sm text-gray-500">
                All equipment has been returned on time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {overdueRentals.map((rental) => {
                const user = users.find(u => u.id === rental.userId);
                const isNotified = notifications.some(n => n.rentalId === rental.id);
                
                return (
                  <div key={rental.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">
                          {rental.equipmentName}
                        </h4>
                        <div className="mt-1 text-sm text-gray-600">
                          <p><strong>Student:</strong> {user?.name || 'Unknown'}</p>
                          <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                          <p><strong>Due Date:</strong> {new Date(rental.dueDate).toLocaleString()}</p>
                          <p><strong>Days Overdue:</strong> {Math.ceil((new Date().getTime() - new Date(rental.dueDate).getTime()) / (1000 * 60 * 60 * 24))}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isNotified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isNotified ? 'Notified' : 'Pending'}
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

      {/* Notification History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Notification History
          </h3>
          
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications sent</h3>
              <p className="mt-1 text-sm text-gray-500">
                Send overdue notifications to see them here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.subject}
                      </h4>
                      <div className="mt-1 text-sm text-gray-600">
                        <p><strong>To:</strong> {notification.to}</p>
                        <p><strong>Student:</strong> {notification.studentName}</p>
                        <p><strong>Equipment:</strong> {notification.equipmentName}</p>
                        <p><strong>Sent:</strong> {new Date().toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Sent
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
