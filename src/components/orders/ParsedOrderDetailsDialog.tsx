import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X } from 'lucide-react';
import { ParsedOrder } from '@/hooks/useParsedOrders';

interface ParsedOrderDetailsDialogProps {
  order: ParsedOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (order: ParsedOrder) => void;
  onReject: (orderId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ParsedOrderDetailsDialog: React.FC<ParsedOrderDetailsDialogProps> = ({
  order,
  open,
  onOpenChange,
  onApprove,
  onReject,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-semibold">
              {order.email_subject}
            </DialogTitle>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                <div className="space-y-1">
                  <p><span className="font-medium">Name:</span> {order.customer_name}</p>
                  <p><span className="font-medium">Email:</span> {order.customer_email}</p>
                  <p><span className="font-medium">Due Date:</span> {new Date(order.due_date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
                <div className="space-y-1">
                  <p><span className="font-medium">Total Items:</span> {order.parsed_items.length}</p>
                  <p><span className="font-medium">Estimated Total:</span> ${order.estimated_total.toFixed(2)}</p>
                  <p><span className="font-medium">Confidence Score:</span> {Math.round(order.confidence_score * 100)}%</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Parsed Items */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Parsed Items</h3>
              <div className="space-y-3">
                {order.parsed_items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="font-medium text-gray-700">Product</p>
                        <p className="text-gray-900">{item.name}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Media Type</p>
                        <p className="text-gray-900">{item.media_type}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Quantity</p>
                        <p className="text-gray-900">{item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Raw Email */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Raw Email Content</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {order.email_body}
                </pre>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        {/* Actions */}
        {order.status === 'pending' && (
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onReject(order.id)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => onApprove(order)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};