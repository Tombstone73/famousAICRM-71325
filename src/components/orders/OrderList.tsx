import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Edit, Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Order } from '@/types';

interface OrderListProps {
  userRole?: 'customer' | 'employee' | 'admin';
  customerId?: string;
}

const OrderList: React.FC<OrderListProps> = ({ userRole = 'admin', customerId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders] = useState<Order[]>([
    {
      id: '1',
      customer_id: 'cust1',
      product_id: 'prod1',
      due_date: '2024-02-15',
      status: 'In Progress',
      rush: true,
      internal_notes: 'Customer requested matte finish',
      artwork_url: '/artwork/order1.pdf',
      thumbnail_url: '/thumbs/order1.jpg',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      customer_id: 'cust2',
      product_id: 'prod2',
      due_date: '2024-02-20',
      status: 'Pending',
      rush: false,
      artwork_url: '/artwork/order2.pdf',
      created_at: '2024-01-18T14:30:00Z'
    },
    {
      id: '3',
      customer_id: 'cust1',
      product_id: 'prod3',
      due_date: '2024-02-10',
      status: 'Ready',
      rush: false,
      created_at: '2024-01-10T09:15:00Z'
    },
    {
      id: '4',
      customer_id: 'cust3',
      product_id: 'prod1',
      due_date: '2024-02-25',
      status: 'Shipped',
      rush: false,
      created_at: '2024-01-20T16:45:00Z'
    }
  ]);

  const customerNames = {
    'cust1': 'Acme Corporation',
    'cust2': 'Tech Startup Inc',
    'cust3': 'Design Studio Co'
  };

  const productNames = {
    'prod1': 'Business Cards',
    'prod2': 'Brochures',
    'prod3': 'Posters'
  };

  const filteredOrders = orders
    .filter(order => userRole === 'customer' ? order.customer_id === customerId : true)
    .filter(order => {
      const customerName = customerNames[order.customer_id as keyof typeof customerNames] || '';
      const productName = productNames[order.product_id as keyof typeof productNames] || '';
      return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order.id.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <Package className="w-4 h-4" />;
      case 'Ready': return <CheckCircle className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'Pending').length,
    inProgress: filteredOrders.filter(o => o.status === 'In Progress').length,
    ready: filteredOrders.filter(o => o.status === 'Ready').length,
    shipped: filteredOrders.filter(o => o.status === 'Shipped').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {userRole === 'customer' ? 'My Orders' : 'All Orders'}
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-sm text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
            <p className="text-sm text-gray-600">Ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{stats.shipped}</p>
            <p className="text-sm text-gray-600">Shipped</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                {userRole !== 'customer' && <TableHead>Customer</TableHead>}
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/orders/${order.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        ORD-{order.id.padStart(3, '0')}
                      </Link>
                      {order.rush && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          RUSH
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  {userRole !== 'customer' && (
                    <TableCell>
                      {customerNames[order.customer_id as keyof typeof customerNames]}
                    </TableCell>
                  )}
                  <TableCell>
                    {productNames[order.product_id as keyof typeof productNames]}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/orders/${order.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      {userRole !== 'customer' && (
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderList;