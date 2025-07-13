import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, CheckCircle, Truck, Package } from 'lucide-react';
import ShippingFormEnhanced from '@/components/shipping/ShippingFormEnhanced';
import { Order } from '@/types';

const OrderListWithShipping: React.FC = () => {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      customer_id: 'cust1',
      product_id: 'prod1',
      due_date: '2024-02-15',
      status: 'Ready',
      rush: true,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      customer_id: 'cust2',
      product_id: 'prod2',
      due_date: '2024-02-20',
      status: 'In Progress',
      rush: false,
      created_at: '2024-01-18T14:30:00Z'
    }
  ]);

  const [shippingDialog, setShippingDialog] = useState<string | null>(null);

  const customerNames = {
    'cust1': 'Acme Corporation',
    'cust2': 'Tech Startup Inc'
  };

  const customerAddresses = {
    'cust1': {
      name: 'John Smith',
      company: 'Acme Corporation',
      addressLine1: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      phone: '(555) 123-4567'
    },
    'cust2': {
      name: 'Jane Doe',
      company: 'Tech Startup Inc',
      addressLine1: '456 Innovation Dr',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      phone: '(555) 987-6543'
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress': return <Package className="w-4 h-4" />;
      case 'Ready': return <CheckCircle className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleLabelCreated = (label: any) => {
    console.log('Label created:', label);
    setShippingDialog(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders - Shipping Management</h1>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      ORD-{order.id.padStart(3, '0')}
                      {order.rush && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          RUSH
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {customerNames[order.customer_id as keyof typeof customerNames]}
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
                    <div className="flex gap-2">
                      {order.status === 'Ready' && (
                        <Dialog open={shippingDialog === order.id} onOpenChange={(open) => setShippingDialog(open ? order.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Truck className="w-4 h-4 mr-2" />
                              Ship
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Create Shipping Label - Order {order.id}
                              </DialogTitle>
                            </DialogHeader>
                            <ShippingFormEnhanced
                              orderId={order.id}
                              prefilledAddress={customerAddresses[order.customer_id as keyof typeof customerAddresses]}
                              onLabelCreated={handleLabelCreated}
                            />
                          </DialogContent>
                        </Dialog>
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

export default OrderListWithShipping;