import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';

interface ProductInfoSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const MEDIA_TYPES = [
  'Vinyl',
  'Paper',
  'Canvas',
  'Fabric',
  'Aluminum',
  'Coroplast',
  'Foam Board',
  'Acrylic',
  'Magnetic',
  'Static Cling'
];

const CATEGORIES = [
  { value: 'small-format', label: 'Small Format' },
  { value: 'flatbed', label: 'Flatbed' },
  { value: 'roll', label: 'Roll' },
  { value: 'other', label: 'Other' }
];

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({ formData, setFormData }) => {
  const generateSKU = () => {
    const prefix = formData.category.toUpperCase().slice(0, 3);
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    setFormData({ ...formData, sku: `${prefix}-${random}` });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="mediaType" className="text-sm font-medium">
              Media Type
            </Label>
            <Select
              value={formData.mediaType}
              onValueChange={(value) => setFormData({ ...formData, mediaType: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                {MEDIA_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Product Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter detailed product description"
            rows={3}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sku" className="text-sm font-medium">
              SKU / Product Code
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Enter SKU or auto-generate"
              />
              <Button type="button" variant="outline" size="sm" onClick={generateSKU}>
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive" className="text-sm font-medium">
            Active Status
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};