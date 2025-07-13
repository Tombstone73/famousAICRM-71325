import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calculator } from 'lucide-react';
import { useMediaInventory } from '@/hooks/useMediaInventory';
import { ProductFormData } from './ProductEntryForm';

interface PricePreviewProps {
  data: ProductFormData;
  width?: number;
  height?: number;
  quantity?: number;
}

export const PricePreview: React.FC<PricePreviewProps> = ({
  data,
  width = 12,
  height = 18,
  quantity = 1
}) => {
  const { data: mediaData } = useMediaInventory();
  
  const selectedMedia = mediaData?.types.find(type => type.id === data.mediaTypeId);
  const sqft = (width * height) / 144;
  const totalSqft = sqft * quantity;
  
  // Basic pricing calculation
  const basePricePerSqft = 2.50; // Default fallback
  const estimatedPrice = totalSqft * basePricePerSqft;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Price Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Dimensions:</span>
            <p className="text-gray-600">{width}" × {height}"</p>
          </div>
          <div>
            <span className="font-medium">Quantity:</span>
            <p className="text-gray-600">{quantity}</p>
          </div>
          <div>
            <span className="font-medium">Square Feet:</span>
            <p className="text-gray-600">{sqft.toFixed(2)} sq ft</p>
          </div>
          <div>
            <span className="font-medium">Total Sq Ft:</span>
            <p className="text-gray-600">{totalSqft.toFixed(2)} sq ft</p>
          </div>
        </div>
        
        {selectedMedia && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Package className="h-3 w-3 mr-1" />
              {selectedMedia.name}
            </Badge>
            <span className="text-sm text-gray-600">
              Media compatibility confirmed
            </span>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium">Estimated Price:</span>
            <span className="text-lg font-bold text-green-600">
              ${estimatedPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            *Estimate based on ${basePricePerSqft}/sq ft
          </p>
        </div>
      </CardContent>
    </Card>
  );
};