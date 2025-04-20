import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useOwner } from '@/Context/OwnerContext';

const categories = [
  { id: 'men', name: 'Men' },
  { id: 'women', name: 'Women' },
  { id: 'kids', name: 'Kids' },
];

const sizes = [
  { id: 'xs', name: 'XS' },
  { id: 's', name: 'S' },
  { id: 'm', name: 'M' },
  { id: 'l', name: 'L' },
  { id: 'xl', name: 'XL' },
  { id: 'xxl', name: 'XXL' },
];

const colors = [
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'gray', name: 'Gray', hex: '#808080' },
  { id: 'red', name: 'Red', hex: '#FF0000' },
  { id: 'blue', name: 'Blue', hex: '#0000FF' },
  { id: 'green', name: 'Green', hex: '#008000' },
  { id: 'yellow', name: 'Yellow', hex: '#FFFF00' },
  { id: 'purple', name: 'Purple', hex: '#800080' },
  { id: 'pink', name: 'Pink', hex: '#FFC0CB' },
  { id: 'brown', name: 'Brown', hex: '#A52A2A' },
];

const AddProduct = () => {
  const { addProduct } = useOwner();
  const [selectedImages, setSelectedImages] = useState([]); // Change to an array
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    mainCategory: '',
    category: '',
    sizes: [],
    colors: [],
    status: 'Regular',
    quantity: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Form Data:", formData);
    console.log("Selected Images:", selectedImages);
  
    try {
      await addProduct(formData, selectedImages);
      alert("Product added successfully!");
    } catch (error) {
      alert("Failed to add product.");
    }
  };
  
  const handleSizeToggle = (sizeId) => {
    if (selectedSizes.includes(sizeId)) {
      setSelectedSizes(selectedSizes.filter(id => id !== sizeId));
    } else {
      setSelectedSizes([...selectedSizes, sizeId]);
    }
  };
  
  const handleColorToggle = (colorId) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(selectedColors.filter(id => id !== colorId));
    } else {
      setSelectedColors([...selectedColors, colorId]);
    }
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const newImages = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
    });
  
    Promise.all(newImages).then((images) => {
      setSelectedImages((prev) => [...prev, ...images]); // Append new images to the existing ones
    });
  };
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-6">
                  {selectedImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg"
                    >
                      <img
                        src={image}
                        alt="Product preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                  ))}
                  <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer">
                    <Upload size={24} className="text-gray-500" />
                    <input
                      type="file"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Click the icon to upload high-quality images of your product.
                    Recommended size: 1000x1000px. Max size: 5MB. Supported formats: JPG,
                    PNG.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="e.g. Classic White T-Shirt"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="29.99"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stock"
                  className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="100"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                placeholder="Enter product description..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => handleSizeToggle(size.id)}
                    className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                      selectedSizes.includes(size.id)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Colors
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleColorToggle(color.id)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColors.includes(color.id)
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-300'
                    }`}
                  >
                    <span 
                      className="absolute inset-1 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    ></span>
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Selected colors: {selectedColors.length ? colors.filter(c => selectedColors.includes(c.id)).map(c => c.name).join(', ') : 'None'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Status
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="status-regular"
                    name="status"
                    type="radio"
                    defaultChecked
                    className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                  <label htmlFor="status-regular" className="ml-2 block text-sm text-gray-700">
                    Regular
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="status-new-arrival"
                    name="status"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                  <label htmlFor="status-new-arrival" className="ml-2 block text-sm text-gray-700">
                    New Arrival
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="status-on-sale"
                    name="status"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                  <label htmlFor="status-on-sale" className="ml-2 block text-sm text-gray-700">
                    On Sale
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-800">
          Save Product
        </Button>
      </div>
    </form>
  );
};

export default AddProduct;