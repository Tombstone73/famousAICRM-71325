import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Settings } from 'lucide-react';
import OrderEntryView from './OrderEntryView';
import OrderListView from './OrderListView';

interface OrdersViewProps {
  userRole?: 'customer' | 'employee' | 'admin';
  customerId?: string;
}

const OrdersView: React.FC<OrdersViewProps> = ({ userRole = 'admin', customerId }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex justify-between items-center p-6 pb-0 flex-shrink-0">
          <ScrollArea className="w-full max-w-md">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted/50 p-1 text-muted-foreground w-max">
              <TabsTrigger value="list" className="flex-shrink-0">Order List</TabsTrigger>
              <TabsTrigger value="entry" className="flex-shrink-0">New Order</TabsTrigger>
            </TabsList>
          </ScrollArea>
          
          {activeTab === 'list' && (
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setIsColumnManagerOpen(true)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage Columns
              </Button>
              <Button onClick={() => setActiveTab('entry')} className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0">
          <TabsContent value="list" className="mt-0 h-full">
            <OrderListView 
              userRole={userRole} 
              customerId={customerId}
              isColumnManagerOpen={isColumnManagerOpen}
              setIsColumnManagerOpen={setIsColumnManagerOpen}
            />
          </TabsContent>

          <TabsContent value="entry" className="mt-0 h-full">
            <OrderEntryView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export { OrdersView };
export default OrdersView;