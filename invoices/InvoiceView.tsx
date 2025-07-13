import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Download, Eye, History } from 'lucide-react';
import { Invoice } from '@/hooks/useInvoices';
import InvoiceHistoryDialog from './InvoiceHistoryDialog';

interface InvoiceViewProps {
  invoice: Invoice;
  onStatusChange: (id: string, status: Invoice['status']) => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice, onStatusChange }) => {
  const [showHistory, setShowHistory] = useState(false);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'paid': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusChange = (newStatus: Invoice['status']) => {
    onStatusChange(invoice.id, newStatus);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{invoice.invoice_number}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Created: {formatDate(invoice.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(true)}
              >
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Invoice Date</p>
              <p className="text-sm text-muted-foreground">{formatDate(invoice.invoice_date)}</p>
            </div>
            {invoice.due_date && (
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">{formatDate(invoice.due_date)}</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Subtotal:</span>
              <span className="text-sm">${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between text-red-600">
                <span className="text-sm">
                  Discount ({invoice.discount_type === 'percentage' ? '%' : '$'}):
                </span>
                <span className="text-sm">-${invoice.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm">Tax:</span>
              <span className="text-sm">${invoice.tax_amount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${invoice.total_amount.toFixed(2)}</span>
            </div>
          </div>

          {invoice.notes && (
            <div>
              <p className="text-sm font-medium mb-1">Notes</p>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {invoice.status === 'draft' && (
              <Button size="sm" onClick={() => handleStatusChange('sent')}>
                <Mail className="w-4 h-4 mr-2" />
                Send
              </Button>
            )}
            {invoice.status === 'sent' && (
              <Button size="sm" variant="outline" onClick={() => handleStatusChange('paid')}>
                Mark Paid
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <InvoiceHistoryDialog
        open={showHistory}
        onOpenChange={setShowHistory}
        invoiceId={invoice.id}
        invoiceNumber={invoice.invoice_number}
      />
    </>
  );
};

export default InvoiceView;