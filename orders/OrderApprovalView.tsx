import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { ParsedOrderCard } from './ParsedOrderCard';
import { ParsedOrderDetailsDialog } from './ParsedOrderDetailsDialog';
import { useParsedOrders, ParsedOrder } from '@/hooks/useParsedOrders';

export const OrderApprovalView: React.FC = () => {
  const {
    parsedOrders,
    loading,
    approveParsedOrder,
    rejectParsedOrder,
  } = useParsedOrders();
  
  const [selectedOrder, setSelectedOrder] = useState<ParsedOrder | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (order: ParsedOrder) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleApprove = async (order: ParsedOrder) => {
    await approveParsedOrder(order);
    setDetailsOpen(false);
  };

  const handleReject = async (orderId: string) => {
    await rejectParsedOrder(orderId);
    setDetailsOpen(false);
  };

  const pendingOrders = parsedOrders.filter(order => order.status === 'pending');
  const approvedOrders = parsedOrders.filter(order => order.status === 'approved');
  const rejectedOrders = parsedOrders.filter(order => order.status === 'rejected');

  const renderOrderList = (orders: ParsedOrder[], emptyMessage: string) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <p className="text-gray-500">{emptyMessage}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <ParsedOrderCard
            key={order.id}
            order={order}
            onViewDetails={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Approval</h1>
          <p className="text-muted-foreground">
            Review and approve parsed email orders before adding them to the main orders table.
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-yellow-50">
            {pendingOrders.length} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {approvedOrders.length} Approved
          </Badge>
          <Badge variant="outline" className="bg-red-50">
            {rejectedOrders.length} Rejected
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending
            {pendingOrders.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            Approved
            {approvedOrders.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {approvedOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            Rejected
            {rejectedOrders.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {rejectedOrders.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {renderOrderList(pendingOrders, 'No pending orders to review')}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {renderOrderList(approvedOrders, 'No approved orders')}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {renderOrderList(rejectedOrders, 'No rejected orders')}
        </TabsContent>
      </Tabs>

      <ParsedOrderDetailsDialog
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};