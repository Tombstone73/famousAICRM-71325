import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowUpDown, Edit, Truck, Package } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useCompanies } from '@/hooks/useCompanies';
import { useProducts } from '@/hooks/useProducts';
import { useContacts } from '@/hooks/useContacts';
import { ShippingEstimateDialog } from './ShippingEstimateDialog';
import OrderEditDialog from './OrderEditDialog';
import { ColumnManager, Column } from '@/components/crm/ColumnManager';

interface OrderListWithColumnsProps {
  userRole?: 'customer' | 'employee' | 'admin';
  customerId?: string;
  isColumnManagerOpen?: boolean;
  setIsColumnManagerOpen?: (open: boolean) => void;
}

const OrderListWithColumns: React.FC<OrderListWithColumnsProps> = ({ 
  userRole = 'admin', 
  customerId,
  isColumnManagerOpen = false,
  setIsColumnManagerOpen
}) => {
  const { orders, loading, updateOrder } = useOrders();
  const { companies } = useCompanies();
  const { products } = useProducts();
  const { contacts } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [shippingOrder, setShippingOrder] = useState<any>(null);
  const [showShippingDialog, setShowShippingDialog] = useState(false);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [columns, setColumns] = useState<Column[]>([
    { id: 'orderId', label: 'Order ID', visible: true },
    ...(userRole !== 'customer' ? [{ id: 'customer', label: 'Customer', visible: true }] : []),
    { id: 'product', label: 'Product', visible: true },
    { id: 'quantity', label: 'Quantity', visible: true },
    { id: 'status', label: 'Status', visible: true },
    { id: 'dueDate', label: 'Due Date', visible: true },
    { id: 'contact', label: 'Contact', visible: false },
    { id: 'total', label: 'Total', visible: false },
    { id: 'notes', label: 'Notes', visible: false }
  ]);

  const getCompanyName = (id: string) => {
    const company = companies.find(c => c.id === id);
    return company?.name || 'Unknown Company';
  };

  const getProductName = (id: string) => {
    const product = products.find(p => p.id === id);
    return product?.name || 'Unknown Product';
  };

  const getContactName = (id?: string) => {
    if (!id) return '';
    const contact = contacts.find(c => c.id === id);
    return contact ? `${contact.first_name} ${contact.last_name}` : '';
  };

  const filteredOrders = orders
    .filter(order => userRole === 'customer' ? order.customer_id === customerId : true)
    .filter(order => {
      const customerName = getCompanyName(order.customer_id);
      const productName = getProductName(order.product_id);
      return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order.id.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleSaveOrder = async (updatedOrder: any) => {
    try {
      await updateOrder(updatedOrder.id, updatedOrder);
      setIsEditDialogOpen(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleShipping = (order: any) => {
    setShippingOrder(order);
    setShowShippingDialog(true);
  };

  const handleSelectShippingRate = (rate: any) => {
    console.log('Selected shipping rate:', rate);
    setShowShippingDialog(false);
  };

  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'Pending').length,
    inProgress: filteredOrders.filter(o => o.status === 'In Progress').length,
    ready: filteredOrders.filter(o => o.status === 'Ready').length,
    shipped: filteredOrders.filter(o => o.status === 'Shipped').length
  };

  if (loading) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  return (
    <div className="p-6 space-y-6">
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
                {columns.filter(col => col.visible).map((column) => (
                  <TableHead key={column.id}>
                    <Button variant="ghost" className="h-auto p-0 font-semibold hover:bg-transparent">
                      {column.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const hasShippingAddress = order.ship_to_address_line1 && order.ship_to_city && order.ship_to_state;
                const canShip = order.status === 'Ready' && hasShippingAddress;
                
                return (
                  <TableRow key={order.id}>
                    {columns.filter(col => col.visible).map((column) => {
                      switch (column.id) {
                        case 'orderId':
                          return (
                            <TableCell key={column.id} className="font-medium">
                              {order.order_number || `#${order.id.slice(-8)}`}
                            </TableCell>
                          );
                        case 'customer':
                          return userRole !== 'customer' ? (
                            <TableCell key={column.id}>{getCompanyName(order.customer_id)}</TableCell>
                          ) : null;
                        case 'product':
                          return <TableCell key={column.id}>{getProductName(order.product_id)}</TableCell>;
                        case 'quantity':
                          return <TableCell key={column.id}>{order.quantity}</TableCell>;
                        case 'status':
                          return (
                            <TableCell key={column.id}>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </TableCell>
                          );
                        case 'dueDate':
                          return <TableCell key={column.id}>{formatDate(order.due_date)}</TableCell>;
                        default:
                          return <TableCell key={column.id}>-</TableCell>;
                      }
                    })}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditOrder(order)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {hasShippingAddress && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShipping(order)}
                            disabled={!canShip}
                            title={canShip ? 'Get shipping estimate' : 'Order must be Ready status to ship'}
                          >
                            {order.tracking_number ? (
                              <Package className="h-4 w-4 text-green-600" />
                            ) : (
                              <Truck className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {setIsColumnManagerOpen && (
        <ColumnManager
          open={isColumnManagerOpen}
          onOpenChange={setIsColumnManagerOpen}
          columns={columns}
          onColumnsChange={setColumns}
        />
      )}

      {editingOrder && (
        <OrderEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          order={editingOrder}
          onSave={handleSaveOrder}
        />
      )}

      {shippingOrder && (
        <ShippingEstimateDialog
          open={showShippingDialog}
          onOpenChange={setShowShippingDialog}
          orderId={shippingOrder.id}
          shippingAddress={{
            name: shippingOrder.ship_to_name,
            company: shippingOrder.ship_to_company,
            address_line1: shippingOrder.ship_to_address_line1,
            address_line2: shippingOrder.ship_to_address_line2,
            city: shippingOrder.ship_to_city,
            state: shippingOrder.ship_to_state,
            postal_code: shippingOrder.ship_to_postal_code,
            country: shippingOrder.ship_to_country || 'US'
          }}
          onSelectRate={handleSelectShippingRate}
        />
      )}
    </div>
  );
};

export default OrderListWithColumns;