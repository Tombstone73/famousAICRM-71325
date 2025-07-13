import React from 'react';
import OrderListWithColumns from './OrderListWithColumns';

interface OrderListViewProps {
  userRole?: 'customer' | 'employee' | 'admin';
  customerId?: string;
  isColumnManagerOpen?: boolean;
  setIsColumnManagerOpen?: (open: boolean) => void;
}

const OrderListView: React.FC<OrderListViewProps> = ({ 
  userRole = 'admin', 
  customerId,
  isColumnManagerOpen = false,
  setIsColumnManagerOpen
}) => {
  return (
    <OrderListWithColumns 
      userRole={userRole} 
      customerId={customerId}
      isColumnManagerOpen={isColumnManagerOpen}
      setIsColumnManagerOpen={setIsColumnManagerOpen}
    />
  );
};

export default OrderListView;