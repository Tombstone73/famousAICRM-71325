import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Truck, Package } from 'lucide-react';
import { ShippingEstimateDialog } from './ShippingEstimateDialog';
import { Column } from '@/components/crm/ColumnManager';

interface OrderTableRowWithShippingProps {
  order: any;
  columns: Column[];
  userRole: string;
  getCompanyName: (id: string) => string;
  getProductName: (id: string) => string;
  getContactName: (id?: string) => string;
  onEditOrder: (order: any) => void;
}

const OrderTableRowWithShipping: React.FC<OrderTableRowWithShippingProps> = ({
  order,
  columns,
  userRole,
  getCompanyName,
  getProductName,
  getContactName,
  onEditOrder
}) => {
  const [showShippingDialog, setShowShippingDialog] = useState(false);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const hasShippingAddress = order.ship_to_address_line1 && order.ship_to_city && order.ship_to_state;
  const canShip = order.status === 'Ready' && hasShippingAddress;

  const handleSelectShippingRate = (rate: any) => {
    // Update order with shipping information
    console.log('Selected shipping rate:', rate);
  };

  const renderCell = (columnId: string) => {
    switch (columnId) {
      case 'orderId':
        return (
          <TableCell className="font-medium">
            {order.order_number || `#${order.id.slice(-8)}`}
          </TableCell>
        );
      case 'customer':
        return userRole !== 'customer' ? (
          <TableCell>{getCompanyName(order.customer_id)}</TableCell>
        ) : null;
      case 'product':
        return <TableCell>{getProductName(order.product_id)}</TableCell>;
      case 'quantity':
        return <TableCell>{order.quantity}</TableCell>;
      case 'status':
        return (
          <TableCell>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </TableCell>
        );
      case 'dueDate':
        return <TableCell>{formatDate(order.due_date)}</TableCell>;
      case 'contact':
        return <TableCell>{getContactName(order.contact_id)}</TableCell>;
      case 'total':
        return (
          <TableCell>
            {order.total_price ? formatCurrency(order.total_price) : '-'}
          </TableCell>
        );
      case 'notes':
        return (
          <TableCell className="max-w-xs truncate">
            {order.notes || '-'}
          </TableCell>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TableRow>
        {columns.filter(col => col.visible).map((column) => renderCell(column.id))}
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditOrder(order)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {hasShippingAddress && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShippingDialog(true)}
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
      
      {showShippingDialog && (
        <ShippingEstimateDialog
          open={showShippingDialog}
          onOpenChange={setShowShippingDialog}
          orderId={order.id}
          shippingAddress={{
            name: order.ship_to_name,
            company: order.ship_to_company,
            address_line1: order.ship_to_address_line1,
            address_line2: order.ship_to_address_line2,
            city: order.ship_to_city,
            state: order.ship_to_state,
            postal_code: order.ship_to_postal_code,
            country: order.ship_to_country || 'US'
          }}
          onSelectRate={handleSelectShippingRate}
        />
      )}
    </>
  );
};

export default OrderTableRowWithShipping;