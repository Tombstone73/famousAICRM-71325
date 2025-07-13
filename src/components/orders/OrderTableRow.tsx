import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Package, Clock, CheckCircle, Truck, History } from 'lucide-react';
import { Column } from '@/components/crm/ColumnManager';
import OrderHistoryDialog from './OrderHistoryDialog';

interface OrderTableRowProps {
  order: any;
  columns: Column[];
  userRole: string;
  getCompanyName: (id: string) => string;
  getProductName: (id: string) => string;
  getContactName: (id?: string) => string;
  onEditOrder: (order: any) => void;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  columns,
  userRole,
  getCompanyName,
  getProductName,
  getContactName,
  onEditOrder
}) => {
  const [historyOpen, setHistoryOpen] = useState(false);

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

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-gray-50">
        {columns.filter(col => col.visible).map((column) => {
          switch (column.id) {
            case 'orderId':
              return (
                <TableCell key={column.id} className="font-medium">
                  <Link 
                    to={`/orders/${order.id}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    ORD-{order.order_number || order.id.slice(-6).toUpperCase()}
                    {order.rush && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        RUSH
                      </Badge>
                    )}
                  </Link>
                </TableCell>
              );
            case 'customer':
              return <TableCell key={column.id}>{getCompanyName(order.customer_id)}</TableCell>;
            case 'product':
              return <TableCell key={column.id}>{getProductName(order.product_id)}</TableCell>;
            case 'quantity':
              return <TableCell key={column.id}>{order.quantity}</TableCell>;
            case 'status':
              return (
                <TableCell key={column.id}>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </Badge>
                </TableCell>
              );
            case 'dueDate':
              return <TableCell key={column.id}>{new Date(order.due_date).toLocaleDateString()}</TableCell>;
            case 'contact':
              return <TableCell key={column.id}>{getContactName(order.contact_id)}</TableCell>;
            case 'total':
              return <TableCell key={column.id}>${(order.total_price || 0).toFixed(2)}</TableCell>;
            case 'notes':
              return <TableCell key={column.id}>{order.notes || '-'}</TableCell>;
            default:
              return <TableCell key={column.id}>-</TableCell>;
          }
        })}
        <TableCell>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/orders/${order.id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setHistoryOpen(true)}
              title="View Order History"
            >
              <History className="w-4 h-4" />
            </Button>
            {userRole !== 'customer' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEditOrder(order)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      
      <OrderHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        orderId={order.id}
        orderNumber={order.order_number || order.id.slice(-6).toUpperCase()}
      />
    </>
  );
};

export default OrderTableRow;