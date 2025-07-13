import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, DollarSign } from 'lucide-react';

interface ConflictItem {
  productId: string;
  productName: string;
  conflictType: 'custom_override' | 'outdated_pricing';
  currentPrice: number;
  newPrice: number;
  affectedOptions: string[];
}

interface PricingConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflictData: {
    updates: any;
    conflicts: ConflictItem[];
  } | null;
  onResolve: (resolutions: Record<string, boolean>) => void;
}

export const PricingConflictDialog: React.FC<PricingConflictDialogProps> = ({
  open,
  onOpenChange,
  conflictData,
  onResolve
}) => {
  const [resolutions, setResolutions] = useState<Record<string, boolean>>({});

  const handleResolutionChange = (productId: string, apply: boolean) => {
    setResolutions(prev => ({ ...prev, [productId]: apply }));
  };

  const handleResolveAll = () => {
    onResolve(resolutions);
    setResolutions({});
  };

  const selectAll = () => {
    const allSelected = conflictData?.conflicts.reduce((acc, conflict) => {
      acc[conflict.productId] = true;
      return acc;
    }, {} as Record<string, boolean>) || {};
    setResolutions(allSelected);
  };

  const deselectAll = () => {
    setResolutions({});
  };

  if (!conflictData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Pricing Conflicts Detected
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              The following products have pricing conflicts. Choose which products should receive the global pricing update.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {conflictData.conflicts.length} conflicts found
            </div>
            <div className="space-x-2">
              <Button size="sm" variant="outline" onClick={selectAll}>
                Select All
              </Button>
              <Button size="sm" variant="outline" onClick={deselectAll}>
                Deselect All
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {conflictData.conflicts.map((conflict) => (
              <div key={conflict.productId} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={resolutions[conflict.productId] || false}
                      onCheckedChange={(checked) => 
                        handleResolutionChange(conflict.productId, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{conflict.productName}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Affected options: {conflict.affectedOptions.join(', ')}
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-sm">
                          Current: <Badge variant="outline">${conflict.currentPrice.toFixed(2)}</Badge>
                        </div>
                        <div className="text-sm">
                          New: <Badge variant="default">${conflict.newPrice.toFixed(2)}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={conflict.conflictType === 'custom_override' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {conflict.conflictType === 'custom_override' ? 'Custom Override' : 'Outdated Pricing'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolveAll}>
              Apply Selected Updates
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};