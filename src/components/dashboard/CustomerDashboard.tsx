import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'admin';
}

interface Order {
  id: string;
  customer_id: string;
  product_id: string;
  due_date: string;
  status: 'Pending' | 'In Progress' | 'Ready' | 'Shipped';
  rush: boolean;
  created_at: string;
}

interface CustomerDashboardProps {
  user?: User;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user }) => {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      customer_id: user?.id || '1',
      product_id: '1',
      due_date: '2024-01-15',
      status: 'In Progress',
      rush: false,
      created_at: '2024-01-01'
    },
    {
      id: '2',
      customer_id: user?.id || '1',
      product_id: '2',
      due_date: '2024-01-20',
      status: 'Pending',
      rush: true,
      created_at: '2024-01-05'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Ready': return 'bg-green-500';
      case 'Shipped': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Customer'}</h1>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{orders.filter(o => o.status !== 'Shipped').length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{orders.filter(o => o.status === 'Shipped').length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800">Rush Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">{orders.filter(o => o.rush).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
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
                      Order #ORD-{order.id.padStart(3, '0')}
                    </Link>
                    <p className="text-sm text-gray-500">Due: {order.due_date}</p>
                  </div>
                  {order.rush && (
                    <Badge variant="destructive">RUSH</Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/orders/${order.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;