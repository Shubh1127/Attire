import React, { useState } from 'react';
import { User, Settings, MapPin, ShoppingBag, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AddressForm from '../components/checkout/AddressForm';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update user profile info via API
    console.log('Updated profile:', formData);
    setIsEditing(false);
  };
  
  if (!user) {
    return null; // User not authenticated, redirect is handled in App.tsx
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-navy-100 flex items-center justify-center text-navy-800 font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-navy-50 text-navy-800' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="h-5 w-5 mr-3" />
                  <span>Profile</span>
                </button>
                
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'addresses'
                      ? 'bg-navy-50 text-navy-800' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>Addresses</span>
                </button>
                
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'orders'
                      ? 'bg-navy-50 text-navy-800' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  <ShoppingBag className="h-5 w-5 mr-3" />
                  <span>Orders</span>
                </button>
                
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-navy-50 text-navy-800' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span>Settings</span>
                </button>
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <button
                  className="w-full flex items-center px-4 py-3 rounded-md text-red-600 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Personal Information
                  </h2>
                  {!isEditing && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label="Full Name"
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                    />
                    
                    <Input
                      label="Email Address"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                    />
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Change Password
                      </h3>
                      
                      <div className="space-y-4">
                        <Input
                          label="Current Password"
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          fullWidth
                        />
                        
                        <Input
                          label="New Password"
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          fullWidth
                        />
                        
                        <Input
                          label="Confirm New Password"
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          fullWidth
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Name</h3>
                      <p className="mt-1 text-base">{user.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-base">{user.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                      <p className="mt-1 text-base">April 2023</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Saved Addresses
                  </h2>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddressForm(true)}
                  >
                    Add New Address
                  </Button>
                </div>
                
                {showAddressForm ? (
                  <AddressForm onClose={() => setShowAddressForm(false)} />
                ) : (
                  <div>
                    {user.addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">You don't have any saved addresses yet.</p>
                        <Button onClick={() => setShowAddressForm(true)}>
                          Add Your First Address
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {user.addresses.map((address) => (
                          <div 
                            key={address.id} 
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="text-base font-medium text-gray-900">
                                    {address.title}
                                  </h3>
                                  {address.isDefault && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-900 mt-1">{address.fullName}</p>
                                <p className="text-sm text-gray-500">
                                  {address.street}, {address.city}, {address.state}, {address.postalCode}
                                </p>
                                <p className="text-sm text-gray-500">{address.phone}</p>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // In a real app, this would open an edit form with this address pre-populated
                                    console.log('Edit address:', address);
                                  }}
                                >
                                  Edit
                                </Button>
                                
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // In a real app, this would ask for confirmation before deletion
                                    console.log('Delete address:', address);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Your Orders
                </h2>
                
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                  <Button onClick={() => window.location.href = '/'}>
                    Start Shopping
                  </Button>
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Account Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      Email Notifications
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="orderUpdates"
                          name="orderUpdates"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                        />
                        <label htmlFor="orderUpdates" className="ml-2 block text-sm text-gray-900">
                          Order updates
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="promotions"
                          name="promotions"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                        />
                        <label htmlFor="promotions" className="ml-2 block text-sm text-gray-900">
                          Promotions and offers
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="newArrivals"
                          name="newArrivals"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                        />
                        <label htmlFor="newArrivals" className="ml-2 block text-sm text-gray-900">
                          New arrivals and collections
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      Privacy Settings
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="savePayment"
                          name="savePayment"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                        />
                        <label htmlFor="savePayment" className="ml-2 block text-sm text-gray-900">
                          Save payment information
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="browsingHistory"
                          name="browsingHistory"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                        />
                        <label htmlFor="browsingHistory" className="ml-2 block text-sm text-gray-900">
                          Use browsing history for recommendations
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      Account Actions
                    </h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;