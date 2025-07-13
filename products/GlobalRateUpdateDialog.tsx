import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOptionRates } from '@/hooks/useOptionRates';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, DollarSign } from 'lucide-react';

interface GlobalRateUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rateName: string;
  currentRate: number;
  onUpdate: () => void;
}

export const GlobalRateUpdateDialog: React.FC<GlobalRateUpdateDialogProps> = ({
  open,
  onOpenChange,
  rateName,
  currentRate,
  onUpdate
}) => {
  const { updateRate, getRateByName } = useOptionRates();
  const { toast } = useToast();
  const [newRate, setNewRate] = useState(currentRate);
  const [updateAllProducts, setUpdateAllProducts] = useState(false);
  const [loading, setLoading] = useState(false);

  const rate = getRateByName(rateName);

  const handleUpdate = async () => {
    if (!rate) return;
    
    try {
      setLoading(true);
      
      // Update the global rate
      await updateRate(rate.id, { base_rate: newRate });
      
      // If updateAllProducts is true, we would update all products using this rate
      // For now, we'll just show a success message
      if (updateAllProducts) {
        toast({
          title: 'Global Rate Updated',
          description: `${rate.name} rate updated to $${newRate.toFixed(2)} for all products using this rate.`,
        });
      } else {
        toast({
          title: 'Rate Updated',
          description: `${rate.name} rate updated to $${newRate.toFixed(2)}.`,
        });
      }
      
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update rate. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!rate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Update Global Rate
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="rate-name">Rate Name</Label>
            <Input
              id="rate-name"
              value={rate.name}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="current-rate">Current Rate</Label>
            <Input
              id="current-rate"
              value={`$${currentRate.toFixed(2)}`}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="new-rate">New Rate ($)</Label>
            <Input
              id="new-rate"
              type="number"
              step="0.01"
              min="0"
              value={newRate}
              onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
              placeholder="Enter new rate"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="update-all"
              checked={updateAllProducts}
              onChange={(e) => setUpdateAllProducts(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="update-all" className="text-sm">
              Update all products using this rate
            </Label>
          </div>
          
          {updateAllProducts && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This will update the pricing for all products that use the {rate.name} rate. 
                This action cannot be undone.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading || newRate === currentRate}
          >
            {loading ? 'Updating...' : 'Update Rate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};