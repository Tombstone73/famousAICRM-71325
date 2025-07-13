import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import OrderHistoryTimeline from './OrderHistoryTimeline';

interface OrderHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber?: string;
}

const OrderHistoryDialog: React.FC<OrderHistoryDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  orderNumber
}) => {
  const { history, loading } = useOrderHistory(orderId);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = [
      ['Date/Time', 'User', 'Event Type', 'Description'].join(','),
      ...history.map(event => [
        new Date(event.timestamp).toLocaleString(),
        event.user_name,
        event.event_type,
        `"${event.description.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${orderNumber || orderId}-history.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              Order History - {orderNumber ? `ORD-${orderNumber}` : `Order ${orderId.slice(-6)}`}
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4">
          <OrderHistoryTimeline events={history} loading={loading} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderHistoryDialog;