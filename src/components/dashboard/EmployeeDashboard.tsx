import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'admin';
}

interface EmployeeDashboardProps {
  user?: User;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user }) => {
  const { orders, loading, updateOrder } = useOrders();
  const [filter, setFilter] = useState('all');

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder(orderId, { status: newStatus as any });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase().replace(' ', '-') === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Ready': return 'bg-green-500';
      case 'Shipped': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Production Dashboard</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">{orders.filter(o => o.status === 'Pending').length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{orders.filter(o => o.status === 'In Progress').length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{orders.filter(o => o.status === 'Ready').length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">Rush Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{orders.filter(o => o.rush).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Production Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders found.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {order.status}
                    </Badge>
                    <div>
                      <Link 
                        to={`/orders/${order.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Order #{order.order_number || order.id}
                      </Link>
                      <p className="text-sm text-gray-500">Due: {order.due_date}</p>
                    </div>
                    {order.rush && <Badge variant="destructive">RUSH</Badge>}
                  </div>
                  <div className="flex space-x-2">
                    <Select value={order.status} onValueChange={(value) => handleStatusUpdate(order.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Ready">Ready</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;