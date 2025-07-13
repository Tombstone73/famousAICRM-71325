import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Package, Settings } from 'lucide-react';
import { Product } from '@/types/products';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
  onManageOptions?: (productId: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onView,
  onManageOptions
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                {product.category && (
                  <Badge variant="secondary" className="mt-1">
                    {product.category}
                  </Badge>
                )}
              </div>
              {product.thumbnail_url ? (
                <img
                  src={product.thumbnail_url}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {product.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(product)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                onClick={() => onEdit(product)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              {onManageOptions && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onManageOptions(product.id)}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Options
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
