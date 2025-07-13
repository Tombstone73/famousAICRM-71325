import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProductFormData } from './ProductEntryForm';

interface ProductOption {
  id: string;
  name: string;
  pricingType: 'flat' | 'linear_foot' | 'square_foot' | 'each';
  price: number;
  formula?: string;
  setupFee?: number;
  description?: string;
}

interface OptionsSectionProps {
  data: ProductFormData;
  onChange: (updates: Partial<ProductFormData>) => void;
}

export const OptionsSection: React.FC<OptionsSectionProps> = ({ data, onChange }) => {
  const [options, setOptions] = useState<ProductOption[]>(data.productOptions || []);
  const [editingOption, setEditingOption] = useState<ProductOption | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    pricingType: 'flat' as const,
    price: 0,
    formula: '',
    setupFee: 0,
    description: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      pricingType: 'flat',
      price: 0,
      formula: '',
      setupFee: 0,
      description: ''
    });
    setEditingOption(null);
  };

  const openDialog = (option?: ProductOption) => {
    if (option) {
      setEditingOption(option);
      setFormData({
        name: option.name,
        pricingType: option.pricingType,
        price: option.price,
        formula: option.formula || '',
        setupFee: option.setupFee || 0,
        description: option.description || ''
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const saveOption = () => {
    if (!formData.name) return;

    const option: ProductOption = {
      id: editingOption?.id || Date.now().toString(),
      ...formData
    };

    let updated;
    if (editingOption) {
      updated = options.map(o => o.id === editingOption.id ? option : o);
    } else {
      updated = [...options, option];
    }

    setOptions(updated);
    onChange({ productOptions: updated });
    setIsDialogOpen(false);
    resetForm();
  };

  const removeOption = (id: string) => {
    const updated = options.filter(o => o.id !== id);
    setOptions(updated);
    onChange({ productOptions: updated });
  };

  const getPricingTypeLabel = (type: string) => {
    switch (type) {
      case 'flat': return 'Flat Fee';
      case 'linear_foot': return 'Per Linear Foot';
      case 'square_foot': return 'Per Square Foot';
      case 'each': return 'Per Each';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Options</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingOption ? 'Edit Option' : 'Add New Option'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="optionName">Option Name</Label>
                  <Input
                    id="optionName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Pole Pockets"
                  />
                </div>
                
                <div>
                  <Label htmlFor="pricingType">Pricing Type</Label>
                  <Select value={formData.pricingType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, pricingType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat Fee</SelectItem>
                      <SelectItem value="linear_foot">Per Linear Foot</SelectItem>
                      <SelectItem value="square_foot">Per Square Foot</SelectItem>
                      <SelectItem value="each">Per Each</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="setupFee">Setup Fee (Optional)</Label>
                    <Input
                      id="setupFee"
                      type="number"
                      step="0.01"
                      value={formData.setupFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, setupFee: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="formula">Custom Formula (Optional)</Label>
                  <Textarea
                    id="formula"
                    value={formData.formula}
                    onChange={(e) => setFormData(prev => ({ ...prev, formula: e.target.value }))}
                    placeholder="e.g., (width + height) * 2 * price"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details about this option"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={saveOption}>
                    {editingOption ? 'Update Option' : 'Add Option'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {options.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No options added yet. Click "Add Option" to create your first option.
            </p>
          ) : (
            <div className="space-y-3">
              {options.map((option) => (
                <div key={option.id} className="border rounded p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{option.name}</h4>
                        <Badge variant="outline">{getPricingTypeLabel(option.pricingType)}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Price: ${option.price.toFixed(2)}</p>
                        {option.setupFee && option.setupFee > 0 && (
                          <p>Setup Fee: ${option.setupFee.toFixed(2)}</p>
                        )}
                        {option.formula && (
                          <p>Formula: <code className="bg-muted px-1 rounded">{option.formula}</code></p>
                        )}
                        {option.description && (
                          <p>{option.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openDialog(option)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeOption(option.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};