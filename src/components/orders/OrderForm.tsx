import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { Upload, X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCompanies } from '@/hooks/useCompanies';
import { useContacts } from '@/hooks/useContacts';
import { ProductOptionsSelector } from './ProductOptionsSelector';
import { Product } from '@/types/products';
import { ProductOptionConfig } from '@/components/products/ProductOptionTypes';

interface ProductOption {
  id: string;
  name: string;
  value: string;
  price?: number;
}

interface OrderFormProps {
  onSubmit: (order: any) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, onCancel }) => {
  const { products } = useProducts();
  const { companies } = useCompanies();
  const { contacts } = useContacts();
  
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    product: '',
    quantity: '',
    dueDate: '',
    rush: false,
    instructions: '',
    files: [] as File[]
  });

  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [customDimensions, setCustomDimensions] = useState({ width: 0, height: 0 });

  const selectedProduct = products.find(p => p.id === formData.product) || null;

  // Mock product options for demonstration
  const mockProductOptions: ProductOptionConfig[] = [
    {
      id: '1',
      name: 'Finish',
      type: 'dropdown',
      required: true,
      values: [
        { id: '1', label: 'Matte', value: 'matte', price_modifier: 0 },
        { id: '2', label: 'Gloss', value: 'gloss', price_modifier: 5 },
        { id: '3', label: 'Satin', value: 'satin', price_modifier: 3 }
      ]
    },
    {
      id: '2',
      name: 'Lamination',
      type: 'toggle',
      required: false,
      price_modifier: 15
    },
    {
      id: '3',
      name: 'Size',
      type: 'radio',
      required: true,
      values: [
        { id: '4', label: 'Small (8x10)', value: 'small', price_modifier: 0 },
        { id: '5', label: 'Medium (11x17)', value: 'medium', price_modifier: 10 },
        { id: '6', label: 'Large (18x24)', value: 'large', price_modifier: 25 }
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      selectedOptions,
      customDimensions: selectedProduct && (selectedProduct.min_width || selectedProduct.min_height) ? customDimensions : undefined
    };
    onSubmit(orderData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files!)]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleProductChange = (productId: string) => {
    setFormData(prev => ({ ...prev, product: productId }));
    setSelectedOptions([]);
    const product = products.find(p => p.id === productId);
    if (product) {
      setCustomDimensions({
        width: product.default_width || 0,
        height: product.default_height || 0
      });
    }
  };

  // Convert data to combobox options
  const companyOptions: ComboboxOption[] = companies.map(company => ({
    value: company.id,
    label: company.name
  }));

  const contactOptions: ComboboxOption[] = contacts.map(contact => ({
    value: contact.id,
    label: `${contact.first_name} ${contact.last_name}`
  }));

  const productOptions_: ComboboxOption[] = products.map(product => ({
    value: product.id,
    label: product.name
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Combobox
                  options={companyOptions}
                  value={formData.company}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
                  placeholder="Select company..."
                  searchPlaceholder="Search companies..."
                  emptyText="No company found."
                />
              </div>
              <div className="space-y-2">
                <Label>Contact</Label>
                <Combobox
                  options={contactOptions}
                  value={formData.contact}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, contact: value }))}
                  placeholder="Select contact..."
                  searchPlaceholder="Search contacts..."
                  emptyText="No contact found."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product</Label>
                <Combobox
                  options={productOptions_}
                  value={formData.product}
                  onValueChange={handleProductChange}
                  placeholder="Select product..."
                  searchPlaceholder="Search products..."
                  emptyText="No product found."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rush"
                checked={formData.rush}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rush: checked as boolean }))}
              />
              <Label htmlFor="rush">Rush Order (+50% fee)</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Any special requirements or notes..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Artwork Files</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload your artwork files</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.ai,.eps"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  Choose Files
                </Button>
              </div>
              {formData.files.length > 0 && (
                <div className="space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600">
                Submit Order
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Product Options Section */}
      {selectedProduct && (
        <ProductOptionsSelector
          productId={selectedProduct.id}
          options={mockProductOptions}
          selectedOptions={selectedOptions}
          onOptionsChange={setSelectedOptions}
          allowPriceOverride={true}
          showPricing={true}
        />
      )}
    </div>
  );
};

export default OrderForm;
