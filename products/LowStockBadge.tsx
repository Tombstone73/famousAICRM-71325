import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { Product } from '@/types/products';

interface LowStockBadgeProps {
  product: Product;
  className?: string;
}

export const LowStockBadge: React.FC<LowStockBadgeProps> = ({ product, className }) => {
  if (!product.inventory_enabled) return null;
  
  const isLowStock = product.current_stock !== undefined && 
    product.reorder_point !== undefined && 
    product.current_stock <= product.reorder_point;
  
  const isOutOfStock = product.current_stock === 0;
  
  if (isOutOfStock) {
    return (
      <Badge variant="destructive" className={className}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        Out of Stock
      </Badge>
    );
  }
  
  if (isLowStock) {
    return (
      <Badge variant="outline" className={`border-orange-500 text-orange-700 ${className}`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        Low Stock
      </Badge>
    );
  }
  
  return null;
};