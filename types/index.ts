export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  studentId?: string;
  year?: number;
  createdAt: Date;
}

export interface Equipment {
  id: string;
  name: string;
  sport: 'soccer' | 'basketball' | 'handball' | 'rugby';
  totalQuantity: number;
  availableQuantity: number;
  description?: string;
  image?: string;
}

export interface Rental {
  id: string;
  userId: string;
  equipmentId: string;
  equipmentName: string;
  sport: string;
  timeSlot: 'recess' | 'lunch';
  date: string; // YYYY-MM-DD format
  status: 'active' | 'returned' | 'overdue';
  rentedAt: Date;
  returnedAt?: Date;
  dueDate: Date;
}

export interface TimeSlot {
  id: 'recess' | 'lunch';
  name: string;
  startTime: string;
  endTime: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'recess',
    name: 'Recess',
    startTime: '11:00',
    endTime: '11:30'
  },
  {
    id: 'lunch',
    name: 'Lunch',
    startTime: '12:30',
    endTime: '13:00'
  }
];
