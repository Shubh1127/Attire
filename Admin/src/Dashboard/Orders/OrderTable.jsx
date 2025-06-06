import React, { useState, useContext } from 'react';
import { Eye, ArrowUpDown, Download, Search, ChevronLeft, ChevronRight, X, Truck } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOwner } from "@/Context/OwnerContext";
import { ThemeContext } from "@/Context/ThemeContext";

const OrderTable = ({ orders = [], refreshOrders }) => {
  const { theme } = useContext(ThemeContext);
  const { updateOrderStatus } = useOwner();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const matchesSearch = searchQuery
      ? order.shippingAddress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 'warning';
      case 'processing':
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
      case 'returned':
        return 'danger';
      default:
        return 'default';
    }
  };
  
  const getPaymentStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'refunded':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsUpdating(true);
    try {
      const updateData = { 
        status: newStatus,
        ...(newStatus === 'shipped' && { 
          trackingNumber,
          carrier,
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        })
      };

      await updateOrderStatus(selectedOrder._id, updateData);
      refreshOrders(); // Refresh the orders list after update
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const validStatuses = [
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned"
  ];

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
    <>
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
            Orders
          </h3>
          
          {/* Mobile Search */}
          <div className="sm:hidden relative">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${inputStyles}`}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Desktop Search */}
            <div className="hidden sm:block relative flex-1">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search orders or customers..."
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
                <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
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
                    Order
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th scope="col" className={`hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Customer
                </th>
                <th scope="col" className={`hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Date
                </th>
                <th scope="col" className={`px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Status
                </th>
                <th scope="col" className={`hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Payment
                </th>
                <th scope="col" className={`px-3 sm:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Total
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        #{order._id.slice(-6).toUpperCase()}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="sm:hidden mt-1">
                        <Badge variant={getStatusBadgeVariant(order.status)} size="sm">
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {order.shippingAddress.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {order.shippingAddress.name}
                          </div>
                          <div className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {order.shippingAddress.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <Badge variant={getPaymentStatusBadgeVariant(order.payment.status)}>
                        {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                      </Badge>
                    </td>
                    <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 sm:p-2"
                        onClick={() => handleViewClick(order)}
                      >
                        <Eye size={16} className={theme === 'dark' ? 'text-gray-300' : ''} />
                        <span className="sr-only sm:not-sr-only sm:ml-2">View/Update</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      No orders found matching your criteria
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
              Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
              <span className="font-medium">{orders.length}</span> orders
            </p>
            <p className={`text-sm mt-1 text-center sm:text-left ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Total Amount: <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
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

      {/* Status Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <DialogHeader>
            <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>
              Update Order Status
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Order ID: #{selectedOrder._id.slice(-6).toUpperCase()}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Customer: {selectedOrder.shippingAddress.name}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Status
                </label>
                <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Update Status
                </label>
                <Select 
                  value={newStatus} 
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                    {validStatuses.map(status => (
                      <SelectItem 
                        key={status} 
                        value={status}
                        className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newStatus === 'shipped' && (
                <>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tracking Number
                    </label>
                    <Input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                      placeholder="Enter tracking number"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Carrier
                    </label>
                    <Input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                      placeholder="Enter carrier name"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || newStatus === selectedOrder.status}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderTable;