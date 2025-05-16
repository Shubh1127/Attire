import React, { useEffect, useState } from 'react';
import { useBuyerContext } from '../Context/BuyerContext';
import supabase from '../Auth/SupabaseClient';
import { useTheme } from '../Context/ThemeContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { getCookie,deleteCookie } from '../utils/cookies';

const ProfilePage: React.FC = () => {
  const {
    buyer,
    getProfile,
    updateProfile,
    logoutBuyer,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useBuyerContext();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      // Check if the user is logged in with Supabase
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching Supabase session:', error.message);
        return;
      }

      const user = session?.session?.user;
      setSupabaseUser(user);

      if (user) {
        // If logged in with Supabase, set the profile image from user metadata
        if (user.user_metadata?.avatar_url) {
          setPreviewImage(user.user_metadata.avatar_url);
        } else if (user.user_metadata?.picture) {
          setPreviewImage(user.user_metadata.picture);
        }
        
        // Set form data from Supabase user
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email || '',
          phoneNumber: user.user_metadata?.phone || ''
        }));
      } else if (!buyer) {
        // If not logged in with Supabase, fetch the profile from the backend
        await getProfile();
      }
    };

    fetchProfile();
  }, []);


 useEffect(() => {
  const checkAuth = async () => {
    try {
      // Check Supabase session first
      const { data: { session }, error: supabaseError } = await supabase.auth.getSession();
      
      // Check cookie token
      const token = getCookie('token');
      const tokenTimestamp = getCookie('tokenTimestamp');
      
      // Validate token timestamp if exists
      if (tokenTimestamp) {
        const tokenAge = Date.now() - parseInt(tokenTimestamp);
        const isTokenExpired = tokenAge > 7 * 24 * 60 * 60 * 1000; // 7 days in ms
        
        if (isTokenExpired) {
          // Clear expired tokens
          deleteCookie('token');
          deleteCookie('tokenTimestamp');
          setIsAuthenticated(false);
          return;
        }
      }
      
      // Authenticated if either exists
      setIsAuthenticated(!!(token || session?.user));
      
      // If not authenticated, redirect to login
      if (!token && !session?.user) {
        navigate('/signup');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      navigate('/signup');
    }
  };

  checkAuth();
}, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type, checked } = e.target;
  //   setAddressForm(prev => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value
  //   }));
  // };
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddressIndex !== null) {
        await updateAddress(editingAddressIndex, addressForm);
      } else {
        await addAddress(addressForm);
      }

      if (addressForm.isDefault) {
        const index = editingAddressIndex !== null ? editingAddressIndex : buyer.addresses.length;
        await setDefaultAddress(index);
      }

      resetAddressForm();
    } catch (error) {
      alert('Failed to save address.');
    }
  };

  const handleEditAddress = (index: number) => {
    const address = buyer.addresses[index];
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setEditingAddressIndex(index);
    setIsEditingAddress(true);
  };

  const handleDeleteAddress = async (index: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(index);
      } catch (error) {
        alert('Failed to delete address');
      }
    }
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phoneNumber', formData.phoneNumber);

      if (formData.currentPassword && formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords don't match");
        }
        formDataToSend.append('currentPassword', formData.currentPassword);
        formDataToSend.append('newPassword', formData.newPassword);
      }

      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      await updateProfile(formDataToSend);
      setIsEditing(false);
      await getProfile();
    } catch (error) {
      alert(error.message || 'Failed to update profile.');
    }
  };

  // ... rest of your address-related functions remain the same ...
  const resetAddressForm = () => {
    setAddressForm({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false
    });
    setEditingAddressIndex(null);
    setIsEditingAddress(false);
  };

  if (!buyer) {
    return (
      <div className={`min-h-screen pt-24 pb-16 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={() => navigate('/signup')}
        >
          Login to continue
        </button>
      </div>
    );
  }

  // Theme-based classes
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const cardBorderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen pt-24 pb-16 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <h1 className={`text-3xl font-bold mb-8 ${textColor}`}>My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow-sm border ${cardBgColor} ${cardBorderColor} overflow-hidden`}>
              <div className={`p-6`}>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {previewImage ? (
                      <img
                        src={ previewImage } 
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : buyer?.name ? (
                      <div
                        className={`h-24 w-24 rounded-full bg-navy-100 flex items-center justify-center font-bold text-3xl text-navy-800`}
                      >
                        {buyer.name.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div
                        className={`h-24 w-24 rounded-full bg-navy-100 flex items-center justify-center font-bold text-3xl text-navy-800`}
                      >
                        ?
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className={`text-lg font-semibold ${textColor}`}>{buyer.name}</h2>
                    <p className={`text-sm ${textMutedColor}`}>{buyer.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logoutBuyer}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Information */}
            <div className={`rounded-lg shadow-sm border p-6 ${cardBgColor} ${cardBorderColor}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${textColor}`}>Personal Information</h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(true);
                      // Reset password fields when entering edit mode
                      setFormData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }));
                    }}
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
                    required
                  />

                  <Input
                    label="Phone Number"
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                  />

                  {buyer.provider === 'local' && (
                    <div className="space-y-4 border-t pt-4">
                      <h3 className={`text-lg font-medium ${textColor}`}>Password Update</h3>
                      <Input
                        label="Current Password"
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                        fullWidth
                      />
                      <Input
                        label="New Password"
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        fullWidth
                      />
                      <Input
                        label="Confirm New Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        fullWidth
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => {
                      setIsEditing(false);
                      setPreviewImage(buyer.profileImageUrl || null);
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className={`text-sm font-medium ${textMutedColor}`}>Name</h3>
                    <p className={`mt-1 text-base ${textColor}`}>{buyer.name}</p>
                  </div>

                  <div>
                    <h3 className={`text-sm font-medium ${textMutedColor}`}>Email</h3>
                    <p className={`mt-1 text-base ${textColor}`}>{buyer.email}</p>
                  </div>

                  <div>
                    <h3 className={`text-sm font-medium ${textMutedColor}`}>Phone Number</h3>
                    <p className={`mt-1 text-base ${textColor}`}>{buyer.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Rest of your address management code remains the same */}
            <div className={`rounded-lg shadow-sm border p-6 ${cardBgColor} ${cardBorderColor}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${textColor}`}>My Addresses</h2>
                {!isEditingAddress && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingAddress(true)}
                  >
                    Add New Address
                  </Button>
                )}
              </div>

              {isEditingAddress ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Street Address"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      required
                      fullWidth
                    />
                    <Input
                      label="City"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      required
                      fullWidth
                    />
                    <Input
                      label="State/Province"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      required
                      fullWidth
                    />
                    <Input
                      label="ZIP/Postal Code"
                      name="zipCode"
                      value={addressForm.zipCode}
                      onChange={handleAddressChange}
                      required
                      fullWidth
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                      required
                      fullWidth
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="mr-2"
                    />
                    <label htmlFor="isDefault" className={`text-sm ${textColor}`}>
                      Set as default address
                    </label>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={resetAddressForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingAddressIndex !== null ? 'Update Address' : 'Add Address'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {buyer.addresses?.length > 0 ? (
                    buyer.addresses.map((address, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded border ${address.isDefault ? 'border-blue-500' : cardBorderColor} ${cardBgColor}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            {address.isDefault && (
                              <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mb-2">
                                Default
                              </span>
                            )}
                            <p className={`${textColor} font-medium`}>{address.street}</p>
                            <p className={textColor}>
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className={textColor}>{address.country}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditAddress(index)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                            {!address.isDefault && (
                              <button
                                onClick={() => setDefaultAddress(index)}
                                className="text-green-500 hover:text-green-700"
                              >
                                Set Default
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={textColor}>No addresses saved yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;