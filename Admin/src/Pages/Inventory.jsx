import React, { useEffect, useState, useContext } from 'react';
import { Package, AlertTriangle, TrendingDown, ArrowUpDown, Search, Download, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOwner } from "@/Context/OwnerContext";
import { ThemeContext } from "@/Context/ThemeContext";

const Inventory = () => {
  const { fetchProducts, deleteProduct, editProduct } = useOwner();
  const { theme } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, [fetchProducts]);

  const filteredItems = products.filter(item => {
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchesStatus = statusFilter 
      ? (statusFilter === 'in-stock' && item.quantity > 10) ||
        (statusFilter === 'low-stock' && item.quantity <= 10 && item.quantity > 0) ||
        (statusFilter === 'out-of-stock' && item.quantity === 0)
      : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(products.map(item => item.category)));

  const stats = {
    totalItems: products.length,
    lowStock: products.filter(item => item.quantity <= 10 && item.quantity > 0).length,
    outOfStock: products.filter(item => item.quantity === 0).length
  };

  const getStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= 10) return 'low-stock';
    return 'in-stock';
  };

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (product) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${product.name}?`);
    if (!confirmDelete) return;

    const deleteOption = window.confirm("Delete all stock? Click OK to delete all, or Cancel to delete partial stock.");
    
    try {
      if (deleteOption) {
        await deleteProduct(product._id, true);
        setProducts(prev => prev.filter(p => p._id !== product._id));
        alert("Product and all stock deleted successfully!");
      } else {
        const stockToDelete = parseInt(prompt(`Enter amount of stock to delete (current: ${product.quantity}):`), 10);
        
        if (isNaN(stockToDelete) || stockToDelete <= 0) {
          alert("Invalid stock value. Must be a positive number.");
          return;
        }
        
        if (stockToDelete > product.quantity) {
          alert(`Cannot delete more than current stock (${product.quantity}).`);
          return;
        }

        const updatedProduct = await deleteProduct(product._id, false, stockToDelete);
        setProducts(prev => 
          prev.map(p => p._id === updatedProduct._id ? updatedProduct : p)
        );
        alert(`Successfully deleted ${stockToDelete} units of stock.`);
      }
    } catch (error) {
      alert("Failed to delete product.");
      console.error("Error:", error);
    }
  };

  const handleEditSubmit = async (productId) => {
    try {
      const updates = {
        name: editFormData.name,
        price: parseFloat(editFormData.price),
        quantity: parseInt(editFormData.quantity, 10)
      };
      
      const updatedProduct = await editProduct(productId, updates);
      setProducts(prev => 
        prev.map(p => p._id === updatedProduct._id ? updatedProduct : p)
      );
      setEditingProduct(null);
      alert("Product updated successfully!");
    } catch (error) {
      alert("Failed to update product.");
      console.error("Error:", error);
    }
  };

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="px-4 sm:px-6 lg:px-4">
        <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Inventory Management
        </h1>
        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Track stock levels, manage inventory, and monitor product availability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-1">
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <div className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Items
                </p>
                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalItems}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <div className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-amber-900' : 'bg-amber-50'}`}>
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Low Stock Items
                </p>
                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stats.lowStock}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <div className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-red-900' : 'bg-red-50'}`}>
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Out of Stock
                </p>
                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stats.outOfStock}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Inventory Items</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} />
              </div>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:outline-none sm:text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500' 
                    : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
                }`}
              />
            </div>
            <select
              className={`rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500'
                  : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
              }`}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              className={`rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500'
                  : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
              }`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <Button 
              variant={theme === 'dark' ? 'secondary' : 'outline'}
              size="sm"
              className={theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  <div className="flex items-center">
                    Product
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Category
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Stock Level
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Status
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Price
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Last Updated
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
            }`}>
              {filteredItems.map((item) => {
                const status = getStatus(item.quantity);
                const isEditing = editingProduct === item._id;
                
                return (
                  <tr key={item._id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded object-cover" src={item.photo[0]} alt={item.name} />
                        </div>
                        <div className="ml-4">
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={editFormData.name}
                              onChange={handleEditChange}
                              className={`block w-full rounded-md shadow-sm py-1 px-2 focus:ring-2 focus:outline-none text-sm ${
                                theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500'
                                  : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
                              }`}
                            />
                          ) : (
                            <>
                              <div className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {item.name}
                              </div>
                              <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                ID: {item._id}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge>{item.category}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          name="quantity"
                          value={editFormData.quantity}
                          onChange={handleEditChange}
                          className={`block w-full rounded-md shadow-sm py-1 px-2 focus:ring-2 focus:outline-none text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500'
                              : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
                          }`}
                          min="0"
                        />
                      ) : (
                        <>
                          <div className={`text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.quantity} units
                          </div>
                          <div className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Sizes: {item.sizes.join(', ')}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          status === 'in-stock'
                            ? 'success'
                            : status === 'low-stock'
                              ? 'warning'
                              : 'danger'
                        }
                      >
                        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleEditChange}
                          className={`block w-full rounded-md shadow-sm py-1 px-2 focus:ring-2 focus:outline-none text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500'
                              : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
                          }`}
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${item.price.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant={theme === 'dark' ? 'secondary' : 'outline'}
                            className={theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : ''}
                            onClick={() => handleEditSubmit(item._id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant={theme === 'dark' ? 'secondary' : 'outline'}
                            className={theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : ''}
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant={theme === 'dark' ? 'secondary' : 'outline'}
                            className={theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : ''}
                            onClick={() => handleEditClick(item)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant={theme === 'dark' ? 'secondary' : 'outline'}
                            className={theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : ''}
                            onClick={() => handleDeleteProduct(item)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <CardFooter className={`flex items-center justify-between ${
          theme === 'dark' ? 'bg-gray-800 border-t border-gray-700' : ''
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Showing <span className="font-medium">{filteredItems.length}</span> of{' '}
            <span className="font-medium">{products.length}</span> items
          </p>
          <div className="flex space-x-1">
            <Button 
              variant={theme === 'dark' ? 'secondary' : 'outline'} 
              size="sm"
              className={theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}
              disabled
            >
              Previous
            </Button>
            <Button 
              variant={theme === 'dark' ? 'secondary' : 'outline'} 
              size="sm"
              className={theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Inventory;