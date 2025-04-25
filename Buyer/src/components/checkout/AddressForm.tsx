import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Address } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface AddressFormProps {
  address?: Address;
  onClose: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onClose }) => {
  const { addAddress, updateAddress } = useAuthStore();
  
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    title: address?.title || '',
    fullName: address?.fullName || '',
    street: address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'India',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = 'Address title is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.street) newErrors.street = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (address) {
      updateAddress(address.id, formData);
    } else {
      addAddress(formData);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Address Title"
        id="title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        placeholder="Home, Work, etc."
        error={errors.title}
        fullWidth
      />
      
      <Input
        label="Full Name"
        id="fullName"
        name="fullName"
        type="text"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="John Doe"
        error={errors.fullName}
        fullWidth
      />
      
      <Input
        label="Street Address"
        id="street"
        name="street"
        type="text"
        value={formData.street}
        onChange={handleChange}
        placeholder="123 Main St"
        error={errors.street}
        fullWidth
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City"
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          placeholder="Mumbai"
          error={errors.city}
          fullWidth
        />
        
        <Input
          label="State"
          id="state"
          name="state"
          type="text"
          value={formData.state}
          onChange={handleChange}
          placeholder="Maharashtra"
          error={errors.state}
          fullWidth
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Postal Code"
          id="postalCode"
          name="postalCode"
          type="text"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="400001"
          error={errors.postalCode}
          fullWidth
        />
        
        <Input
          label="Country"
          id="country"
          name="country"
          type="text"
          value={formData.country}
          onChange={handleChange}
          placeholder="India"
          error={errors.country}
          fullWidth
        />
      </div>
      
      <Input
        label="Phone Number"
        id="phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="9876543210"
        error={errors.phone}
        fullWidth
      />
      
      <div className="flex items-center">
        <input
          id="isDefault"
          name="isDefault"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
          checked={formData.isDefault}
          onChange={handleChange}
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
          Set as default shipping address
        </label>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit">
          {address ? 'Update Address' : 'Add Address'}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;