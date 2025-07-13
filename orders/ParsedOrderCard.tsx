import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Check, X } from 'lucide-react';
import { ParsedOrder } from '@/hooks/useParsedOrders';

interface ParsedOrderCardProps {
  order: ParsedOrder;
  onViewDetails: (order: ParsedOrder) => void;
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

const getConfidenceColor = (score: number) => {
  if (score >= 0.8) return 'text-green-600';
  if (score >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

export const ParsedOrderCard: React.FC<ParsedOrderCardProps> = ({
  order,
  onViewDetails,
  onApprove,
  onReject,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">
            {order.email_subject}
          </CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Customer</p>
            <p className="text-gray-900">{order.customer_name}</p>
            <p className="text-gray-600">{order.customer_email}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Due Date</p>
            <p className="text-gray-900">
              {new Date(order.due_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="font-medium text-gray-700 text-sm">Items ({order.parsed_items.length})</p>
          <div className="space-y-1">
            {order.parsed_items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} ({item.media_type})
                </span>
                <span className="text-gray-900">Qty: {item.quantity}</span>
              </div>
            ))}
            {order.parsed_items.length > 3 && (
              <p className="text-sm text-gray-500">
                +{order.parsed_items.length - 3} more items
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="space-y-1">
            <p className="text-lg font-semibold">
              ${order.estimated_total.toFixed(2)}
            </p>
            <p className={`text-sm ${getConfidenceColor(order.confidence_score)}`}>
              {Math.round(order.confidence_score * 100)}% confidence
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(order)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {order.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onApprove(order)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(order.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};