import React, { useState, useContext } from 'react';
import { Eye, ArrowUpDown, Download, Search, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeContext } from "@/Context/ThemeContext";

const CustomerTable = ({ buyers = [] }) => {
  const { theme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredCustomers = buyers.filter(customer => {
    const matchesSearch = searchQuery
      ? customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.buyerId?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  const totalSpent = filteredCustomers.reduce((sum, customer) => {
    return sum + (customer.totalSpent || 0);
  }, 0);

  // Theme-aware styles
  const inputStyles = `pl-10 pr-4 py-2 rounded-md focus:ring-2 focus:ring-offset-2 text-sm ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500'
      : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
  }`;

  const selectStyles = `rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500'
      : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
  }`;

  return (
    <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
          Customer List
        </h3>
        
        {/* Mobile Search - Shows only on small screens */}
        <div className="sm:hidden relative">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${inputStyles}`}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Desktop Search - Hidden on mobile */}
          <div className="hidden sm:block relative flex-1">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${inputStyles}`}
            />
          </div>

          <div className="flex flex-row gap-2">
            <select
              className={`flex-1 ${selectStyles}`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Customers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <Button 
              variant="secondary" 
              size="sm"
              className="hidden sm:flex"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>

            {/* Mobile Export Button */}
            <Button 
              variant="secondary" 
              size="sm"
              className="sm:hidden"
              icon={<Download size={16} />}
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className={`px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                <div className="flex items-center">
                  Customer
                  <ArrowUpDown size={14} className="ml-1" />
                </div>
              </th>
              <th scope="col" className={`hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Contact
              </th>
              <th scope="col" className={`hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Status
              </th>
              <th scope="col" className={`px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Spent
              </th>
              <th scope="col" className={`hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Last Order
              </th>
              <th scope="col" className={`px-3 sm:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
          }`}>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.buyerId} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {customer.name?.charAt(0).toUpperCase() || 'C'}
                        </span>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {customer.name || 'No Name'}
                        </div>
                        <div className={`text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          ID: {customer.buyerId?.slice(-6) || 'N/A'}
                        </div>
                        <div className="sm:hidden mt-1">
                          <div className={`text-xs flex items-center ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <Mail size={12} className="mr-1" />
                            {customer.email?.split('@')[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } flex items-center`}>
                      <Mail size={16} className="mr-2" />
                      {customer.email}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    } flex items-center mt-1`}>
                      <Phone size={16} className="mr-2" />
                      {customer.phone || 'N/A'}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    ₹{(customer.totalSpent || 0).toFixed(2)}
                  </td>
                  <td className={`hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'No orders'}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 sm:p-2"
                    >
                      <Eye size={16} className={theme === 'dark' ? 'text-gray-300' : ''} />
                      <span className="sr-only sm:not-sr-only sm:ml-2">View</span>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No customers found matching your criteria
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className={`flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="mb-4 sm:mb-0">
          <p className={`text-sm text-center sm:text-left ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Showing <span className="font-medium">{filteredCustomers.length}</span> of{' '}
            <span className="font-medium">{buyers.length}</span> customers
          </p>
          <p className={`text-sm mt-1 text-center sm:text-left ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Total Revenue: <span className="font-medium">₹{totalSpent.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" icon={<ChevronLeft size={16} />} disabled>
            <span className="sr-only sm:not-sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="sm">
            <span className="sr-only sm:not-sr-only">Next</span>
            <ChevronRight size={16} className="ml-0 sm:ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CustomerTable;