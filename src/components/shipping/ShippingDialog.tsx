import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Truck, Loader2 } from 'lucide-react';
import ShippingForm from './ShippingForm';
import { ShippingAddress } from '@/types/shipping';
import { useToast } from '@/hooks/use-toast';

interface ShippingDialogProps {
  orderId: string;
  customerAddress?: Partial<ShippingAddress>;
  trigger?: React.ReactNode;
}

const ShippingDialog: React.FC<ShippingDialogProps> = ({ orderId, customerAddress, trigger }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateLabel = async (data: any) => {
    setLoading(true);
    try {
      // Simulate API call to UPS
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Shipping Label Created",
        description: `Label created for order ${orderId}. Tracking: 1Z999AA1234567890`,
      });
      
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shipping label. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Truck className="w-4 h-4 mr-2" />
            Ship
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Create Shipping Label - Order {orderId}
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Creating shipping label...</span>
          </div>
        ) : (
          <ShippingForm
            orderId={orderId}
            prefilledAddress={customerAddress}
            onCreateLabel={handleCreateLabel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShippingDialog;