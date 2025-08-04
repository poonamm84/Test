import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  ChefHat, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminMenu = () => {
  const { apiCall } = useAuth();
  const { addNotification } = useNotification();
  
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    dietary: '',
    chef_special: false
  });

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, searchTerm, categoryFilter]);

  const loadMenuItems = async () => {
    setIsLoading(true);
    try {
      const response = await apiCall('/admin/menu');
      if (response.success) {
        setMenuItems(response.data);
      }
    } catch (error) {
      addNotification('Failed to load menu items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...menuItems];

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCall('/admin/menu', {
        method: 'POST',
        body: {
          ...newItem,
          price: parseFloat(newItem.price)
        }
      });

      if (response.success) {
        addNotification('Menu item added successfully', 'success');
        setShowAddModal(false);
        setNewItem({
          name: '',
          category: '',
          price: '',
          description: '',
          image: '',
          dietary: '',
          chef_special: false
        });
        loadMenuItems();
      }
    } catch (error) {
      addNotification(error.message || 'Failed to add menu item', 'error');
    }
  };

  const handleUpdateItem = async (itemId, updates) => {
    try {
      const response = await apiCall(`/admin/menu/${itemId}`, {
        method: 'PUT',
        body: updates
      });

      if (response.success) {
        addNotification('Menu item updated successfully', 'success');
        setEditingItem(null);
        loadMenuItems();
      }
    } catch (error) {
      addNotification(error.message || 'Failed to update menu item', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const response = await apiCall(`/admin/menu/${itemId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        addNotification('Menu item deleted successfully', 'success');
        loadMenuItems();
      }
    } catch (error) {
      addNotification(error.message || 'Failed to delete menu item', 'error');
    }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    await handleUpdateItem(itemId, { available: !currentStatus });
  };

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's menu items and pricing</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            {item.chef_special && (
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-2 text-sm font-medium">
                <Star className="w-4 h-4 inline mr-1" />
                Chef's Special
              </div>
            )}
            
            <div className="relative">
              <img
                src={item.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="font-bold text-green-600">${item.price}</span>
              </div>
              
              <div className="absolute bottom-4 left-4">
                <button
                  onClick={() => toggleAvailability(item.id, item.available)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                    item.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{item.available ? 'Available' : 'Hidden'}</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {item.category}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
              
              {item.dietary && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.dietary.split(',').map((diet, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {diet.trim()}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">Updated</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.updated_at || item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
          <p className="text-gray-500">No items match your current filters.</p>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Menu Item</h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newItem.image}
                  onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Dietary Info (comma separated)"
                  value={newItem.dietary}
                  onChange={(e) => setNewItem({...newItem, dietary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="chef_special"
                    checked={newItem.chef_special}
                    onChange={(e) => setNewItem({...newItem, chef_special: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="chef_special" className="text-sm text-gray-700">Chef's Special</label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Menu Item</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateItem(editingItem.id, editingItem);
              }} className="space-y-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Dietary Info (comma separated)"
                  value={editingItem.dietary}
                  onChange={(e) => setEditingItem({...editingItem, dietary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit_chef_special"
                    checked={editingItem.chef_special}
                    onChange={(e) => setEditingItem({...editingItem, chef_special: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="edit_chef_special" className="text-sm text-gray-700">Chef's Special</label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;