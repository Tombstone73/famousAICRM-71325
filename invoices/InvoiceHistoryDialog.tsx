import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Printer, Download } from 'lucide-react';
import { useInvoiceHistory } from '@/hooks/useInvoiceHistory';
import InvoiceHistoryTimeline from './InvoiceHistoryTimeline';

interface InvoiceHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceNumber: string;
}

const InvoiceHistoryDialog: React.FC<InvoiceHistoryDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber
}) => {
  const { history, loading, error } = useInvoiceHistory(invoiceId);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'User', 'Event Type', 'Description'].join(','),
      ...history.map(event => [
        new Date(event.timestamp).toLocaleString(),
        event.user_name,
        event.event_type,
        `"${event.description.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceNumber}-history.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice History - {invoiceNumber}</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>
        <Separator />
        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-sm text-gray-500">Loading history...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading history: {error}</p>
            </div>
          ) : (
            <InvoiceHistoryTimeline events={history} />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceHistoryDialog;