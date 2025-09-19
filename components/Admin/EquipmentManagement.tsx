import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Equipment } from '@/types';
import { Package, Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function EquipmentManagement() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    sport: 'soccer',
    totalQuantity: 1,
    availableQuantity: 1,
    description: ''
  });

  const handleAdd = () => {
    if (!newEquipment.name || !newEquipment.sport) return;
    
    const equipment: Equipment = {
      id: Date.now().toString(),
      name: newEquipment.name!,
      sport: newEquipment.sport as any,
      totalQuantity: newEquipment.totalQuantity || 1,
      availableQuantity: newEquipment.availableQuantity || 1,
      description: newEquipment.description || ''
    };
    
    addEquipment(equipment);
    
    setNewEquipment({
      name: '',
      sport: 'soccer',
      totalQuantity: 1,
      availableQuantity: 1,
      description: ''
    });
    setIsAdding(false);
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingId(equipment.id);
    setNewEquipment(equipment);
  };

  const handleSave = () => {
    if (!editingId || !newEquipment.name) return;
    
    updateEquipment(editingId, newEquipment);
    setEditingId(null);
    setNewEquipment({
      name: '',
      sport: 'soccer',
      totalQuantity: 1,
      availableQuantity: 1,
      description: ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setNewEquipment({
      name: '',
      sport: 'soccer',
      totalQuantity: 1,
      availableQuantity: 1,
      description: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
            <p className="mt-2 text-gray-600">
              Manage sports equipment inventory
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-tjhs-blue hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="mb-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isAdding ? 'Add New Equipment' : 'Edit Equipment'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Equipment Name
              </label>
              <input
                type="text"
                value={newEquipment.name || ''}
                onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
                placeholder="e.g., Soccer Ball"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sport
              </label>
              <select
                value={newEquipment.sport || 'soccer'}
                onChange={(e) => setNewEquipment({...newEquipment, sport: e.target.value as any})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
              >
                <option value="soccer">Soccer</option>
                <option value="basketball">Basketball</option>
                <option value="handball">Handball</option>
                <option value="rugby">Rugby</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Quantity
              </label>
              <input
                type="number"
                min="1"
                value={newEquipment.totalQuantity || 1}
                onChange={(e) => setNewEquipment({...newEquipment, totalQuantity: parseInt(e.target.value)})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Available Quantity
              </label>
              <input
                type="number"
                min="0"
                max={newEquipment.totalQuantity || 1}
                value={newEquipment.availableQuantity || 1}
                onChange={(e) => setNewEquipment({...newEquipment, availableQuantity: parseInt(e.target.value)})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={newEquipment.description || ''}
                onChange={(e) => setNewEquipment({...newEquipment, description: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-tjhs-blue focus:border-tjhs-blue sm:text-sm"
                placeholder="e.g., Standard size 5 soccer ball"
              />
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button
              onClick={isAdding ? handleAdd : handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isAdding ? 'Add Equipment' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Equipment List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Current Equipment
          </h3>
          
          <div className="space-y-4">
            {equipment.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-tjhs-blue mr-3" />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{item.sport}</p>
                      {item.description && (
                        <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {item.availableQuantity}/{item.totalQuantity}
                      </div>
                      <div className="text-xs text-gray-500">available</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this equipment? This action cannot be undone.')) {
                            deleteEquipment(item.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
