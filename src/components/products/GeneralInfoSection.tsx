import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ProductImageUpload } from './ProductImageUpload';
import { SKUGenerationSection } from './SKUGenerationSection';
import { MediaSelector } from './MediaSelector';
import { ProductFormData } from './ProductEntryForm';

interface GeneralInfoSectionProps {
  data: ProductFormData;
  onChange: (updates: Partial<ProductFormData>) => void;
}

const categories = [
  'Stickers',
  'Signs', 
  'Banners',
  'Posters',
  'Decals',
  'Labels',
  'Vehicle Graphics',
  'Window Graphics'
];

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={data.category} onValueChange={(value) => onChange({ category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <MediaSelector
            value={data.mediaTypeId}
            onValueChange={(value) => onChange({ mediaTypeId: value })}
            label="Media Type"
            placeholder="Select compatible media type..."
            required
          />
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Product description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="invoice-description">Invoice/Order Description</Label>
            <Textarea
              id="invoice-description"
              value={data.invoiceDescription || ''}
              onChange={(e) => onChange({ invoiceDescription: e.target.value })}
              placeholder="Description that will appear on orders and invoices"
              rows={2}
            />
          </div>

          <ProductImageUpload
            imageUrl={data.imageUrl}
            onImageChange={(url) => onChange({ imageUrl: url })}
            productId={data.id}
          />
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={data.isActive}
              onCheckedChange={(checked) => onChange({ isActive: checked })}
            />
            <Label htmlFor="active">Active Product</Label>
          </div>
        </CardContent>
      </Card>

      <SKUGenerationSection
        category={data.category}
        currentSKU={data.sku || ''}
        onSKUChange={(sku) => onChange({ sku })}
        manualOverride={data.manualSKUOverride || false}
        onManualOverrideChange={(override) => onChange({ manualSKUOverride: override })}
      />
    </div>
  );
};