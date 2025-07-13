import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Product } from '@/types/products';

interface InventoryValidationProps {
  product: Product;
  requestedQuantity: number;
  onOverride?: () => void;
  allowOverride?: boolean;
}

export const InventoryValidation: React.FC<InventoryValidationProps> = ({
  product,
  requestedQuantity,
  onOverride,
  allowOverride = true
}) => {
  if (!product.inventory_enabled) {
    return null;
  }

  const currentStock = product.current_stock || 0;
  const wouldBeNegative = currentStock < requestedQuantity;
  const isOutOfStock = currentStock === 0;

  if (isOutOfStock) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex items-center justify-between">
            <span>This product is out of stock (0 available)</span>
            {allowOverride && onOverride && (
              <Button
                size="sm"
                variant="outline"
                onClick={onOverride}
                className="ml-2"
              >
                Override
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (wouldBeNegative) {
    return (
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="flex items-center justify-between">
            <span>
              Insufficient stock: {currentStock} available, {requestedQuantity} requested
            </span>
            {allowOverride && onOverride && (
              <Button
                size="sm"
                variant="outline"
                onClick={onOverride}
                className="ml-2"
              >
                Override
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        Stock available: {currentStock} units
      </AlertDescription>
    </Alert>
  );
};