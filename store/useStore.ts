import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Equipment, Rental } from '@/types';

interface AppState {
  // User state
  currentUser: User | null;
  users: User[];
  
  // Equipment state
  equipment: Equipment[];
  
  // Rental state
  rentals: Rental[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  addRental: (rental: Rental) => void;
  returnRental: (rentalId: string) => void;
  getRentalsByUser: (userId: string) => Rental[];
  getRentalsByDate: (date: string) => Rental[];
  getOverdueRentals: () => Rental[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
  // Initial state
  currentUser: null,
  users: [],
  equipment: [
    {
      id: '1',
      name: 'Soccer Ball',
      sport: 'soccer',
      totalQuantity: 10,
      availableQuantity: 10,
      description: 'Standard size 5 soccer ball'
    },
    {
      id: '2',
      name: 'Basketball',
      sport: 'basketball',
      totalQuantity: 8,
      availableQuantity: 8,
      description: 'Official size basketball'
    },
    {
      id: '3',
      name: 'Handball',
      sport: 'handball',
      totalQuantity: 6,
      availableQuantity: 6,
      description: 'Official handball'
    },
    {
      id: '4',
      name: 'Rugby Ball',
      sport: 'rugby',
      totalQuantity: 5,
      availableQuantity: 5,
      description: 'Official rugby ball'
    }
  ],
  rentals: [],

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  
  addUser: (user) => set((state) => ({
    users: [...state.users, user]
  })),
  
  addEquipment: (equipment) => set((state) => ({
    equipment: [...state.equipment, equipment]
  })),
  
  updateEquipment: (id, updates) => set((state) => ({
    equipment: state.equipment.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  
  deleteEquipment: (id) => set((state) => ({
    equipment: state.equipment.filter(item => item.id !== id)
  })),
  
  addRental: (rental) => set((state) => ({
    rentals: [...state.rentals, rental],
    equipment: state.equipment.map(item => 
      item.id === rental.equipmentId 
        ? { ...item, availableQuantity: item.availableQuantity - 1 }
        : item
    )
  })),
  
  returnRental: (rentalId) => set((state) => {
    const rental = state.rentals.find(r => r.id === rentalId);
    if (!rental) return state;
    
    return {
      rentals: state.rentals.map(r => 
        r.id === rentalId 
          ? { ...r, status: 'returned' as const, returnedAt: new Date() }
          : r
      ),
      equipment: state.equipment.map(item => 
        item.id === rental.equipmentId 
          ? { ...item, availableQuantity: item.availableQuantity + 1 }
          : item
      )
    };
  }),
  
  getRentalsByUser: (userId) => {
    const state = get();
    return state.rentals.filter(rental => rental.userId === userId);
  },
  
  getRentalsByDate: (date) => {
    const state = get();
    return state.rentals.filter(rental => rental.date === date);
  },
  
  getOverdueRentals: () => {
    const state = get();
    const now = new Date();
    return state.rentals.filter(rental => 
      rental.status === 'active' && new Date(rental.dueDate) < now
    );
  }
}),
{
  name: 'tjhs-rental-storage',
  partialize: (state) => ({
    users: state.users,
    equipment: state.equipment,
    rentals: state.rentals,
    currentUser: state.currentUser
  })
}
)
);
