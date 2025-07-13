import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, Package, Search, Filter, Plus } from 'lucide-react';
import ShippingDialog from './ShippingDialog';

interface ShipmentItem {
  id: string;
  orderId: string;
  customerName: string;
  trackingNumber?: string;
  carrier: string;
  status: 'pending' | 'shipped' | 'delivered';
  shippedDate?: string;
  estimatedDelivery?: string;
  weight?: number;
  dimensions?: string;
}

const ShippingView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showShippingDialog, setShowShippingDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Mock data
  const shipments: ShipmentItem[] = [
    {
      id: '1',
      orderId: 'ORD-001',
      customerName: 'Acme Corp',
      trackingNumber: '1Z999AA1234567890',
      carrier: 'UPS',
      status: 'shipped',
      shippedDate: '2024-01-15',
      estimatedDelivery: '2024-01-18',
      weight: 2.5,
      dimensions: '12x8x4'
    },
    {
      id: '2',
      orderId: 'ORD-002',
      customerName: 'Tech Solutions',
      carrier: 'FedEx',
      status: 'pending',
      weight: 1.2,
      dimensions: '10x6x3'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (shipment.trackingNumber && shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || shipment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Shipping Management</h1>
          <p className="text-gray-600">Track and manage order shipments</p>
        </div>
        <Button onClick={() => setShowShippingDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Shipment
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by order, customer, or tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter">Status:</Label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Shipment List</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredShipments.map((shipment) => (
            <Card key={shipment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{shipment.orderId}</CardTitle>
                    <CardDescription>{shipment.customerName}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>
                    {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-500">Carrier</Label>
                    <p className="font-medium">{shipment.carrier}</p>
                  </div>
                  {shipment.trackingNumber && (
                    <div>
                      <Label className="text-gray-500">Tracking</Label>
                      <p className="font-medium">{shipment.trackingNumber}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-500">Weight</Label>
                    <p className="font-medium">{shipment.weight} lbs</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Dimensions</Label>
                    <p className="font-medium">{shipment.dimensions} in</p>
                  </div>
                </div>
                {shipment.shippedDate && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Shipped: {shipment.shippedDate}</span>
                      {shipment.estimatedDelivery && (
                        <span>Est. Delivery: {shipment.estimatedDelivery}</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Package Tracking</CardTitle>
              <CardDescription>
                Enter a tracking number to get real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Enter tracking number..." className="flex-1" />
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showShippingDialog && (
        <ShippingDialog
          orderId={selectedOrder}
          onClose={() => {
            setShowShippingDialog(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default ShippingView;