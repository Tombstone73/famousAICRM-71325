import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { ProductFormData } from './ProductEntryForm';

interface InventorySectionProps {
  data: ProductFormData;
  onChange: (updates: Partial<ProductFormData>) => void;
}

export const InventorySection: React.FC<InventorySectionProps> = ({ data, onChange }) => {
  const isLowStock = data.inventoryEnabled && 
    data.currentStock !== undefined && 
    data.reorderPoint !== undefined && 
    data.currentStock <= data.reorderPoint;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="inventory-enabled"
            checked={data.inventoryEnabled || false}
            onCheckedChange={(checked) => onChange({ inventoryEnabled: checked })}
          />
          <Label htmlFor="inventory-enabled">Enable Inventory Tracking</Label>
        </div>

        {data.inventoryEnabled && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current-stock">Current Stock Level</Label>
                <Input
                  id="current-stock"
                  type="number"
                  min="0"
                  value={data.currentStock || ''}
                  onChange={(e) => onChange({ currentStock: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label htmlFor="reorder-point">Reorder Point</Label>
                <Input
                  id="reorder-point"
                  type="number"
                  min="0"
                  value={data.reorderPoint || ''}
                  onChange={(e) => onChange({ reorderPoint: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            {isLowStock && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Stock level is at or below reorder point. Consider restocking this product.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};