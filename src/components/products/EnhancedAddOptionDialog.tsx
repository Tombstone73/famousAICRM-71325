import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, X, DollarSign } from 'lucide-react';
import { useProductOptions } from '@/hooks/useProductOptions';
import { useToast } from '@/hooks/use-toast';

interface OptionValue {
  label: string;
  value: string;
  setupFee?: number;
  priceFormula?: string;
  unit?: string;
}

interface EnhancedAddOptionDialogProps {
  optionId?: string;
  onClose: () => void;
  onOptionAdded: () => void;
}

export const EnhancedAddOptionDialog: React.FC<EnhancedAddOptionDialogProps> = ({
  optionId,
  onClose,
  onOptionAdded
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'dropdown' as 'dropdown' | 'toggle' | 'multiselect' | 'numeric',
    inventory_tracking: false,
    price_impact_formula: ''
  });
  const [optionValues, setOptionValues] = useState<OptionValue[]>([]);
  const [newValue, setNewValue] = useState<OptionValue>({
    label: '',
    value: '',
    setupFee: 0,
    priceFormula: '',
    unit: 'each'
  });

  const { productOptions, addProductOption, updateProductOption } = useProductOptions();
  const { toast } = useToast();

  useEffect(() => {
    if (optionId) {
      const option = productOptions.find(o => o.id === optionId);
      if (option) {
        setFormData({
          name: option.name,
          type: option.type,
          inventory_tracking: option.inventory_tracking,
          price_impact_formula: option.price_impact_formula || ''
        });
        if (option.settings?.options) {
          setOptionValues(option.settings.options);
        }
      }
    }
  }, [optionId, productOptions]);

  const addOptionValue = () => {
    if (!newValue.label || !newValue.value) {
      toast({
        title: 'Error',
        description: 'Label and value are required',
        variant: 'destructive'
      });
      return;
    }

    setOptionValues(prev => [...prev, { ...newValue }]);
    setNewValue({
      label: '',
      value: '',
      setupFee: 0,
      priceFormula: '',
      unit: 'each'
    });
  };

  const removeOptionValue = (index: number) => {
    setOptionValues(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Option name is required',
        variant: 'destructive'
      });
      return;
    }

    if (formData.type === 'dropdown' && optionValues.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one option value is required for dropdown type',
        variant: 'destructive'
      });
      return;
    }

    try {
      const optionData = {
        ...formData,
        settings: {
          options: optionValues,
          allowCustom: false
        }
      };

      if (optionId) {
        await updateProductOption(optionId, optionData);
      } else {
        await addProductOption(optionData);
      }

      onOptionAdded();
    } catch (error) {
      console.error('Error saving option:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          {optionId ? 'Edit Option' : 'Add New Option'}
        </h2>
        <p className="text-sm text-gray-600">
          Configure product options with pricing and setup fees
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Option Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Banner Thickness"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Option Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="toggle">Toggle (Yes/No)</SelectItem>
                <SelectItem value="multiselect">Multi-select</SelectItem>
                <SelectItem value="numeric">Numeric Input</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="inventory_tracking"
            checked={formData.inventory_tracking}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inventory_tracking: checked as boolean }))}
          />
          <Label htmlFor="inventory_tracking">Enable inventory tracking</Label>
        </div>

        {formData.type === 'dropdown' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Option Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {optionValues.map((value, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{value.label}</Badge>
                      <span className="text-sm text-gray-600">({value.value})</span>
                    </div>
                    {value.setupFee && value.setupFee > 0 && (
                      <div className="text-xs text-green-600 mt-1">
                        Setup: ${value.setupFee}
                      </div>
                    )}
                    {value.priceFormula && (
                      <div className="text-xs text-blue-600 mt-1">
                        Formula: {value.priceFormula}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeOptionValue(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Label</Label>
                  <Input
                    value={newValue.label}
                    onChange={(e) => setNewValue(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., 13oz"
                  />
                </div>
                <div>
                  <Label>Value</Label>
                  <Input
                    value={newValue.value}
                    onChange={(e) => setNewValue(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="e.g., 13oz"
                  />
                </div>
                <div>
                  <Label>Setup Fee ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newValue.setupFee || ''}
                    onChange={(e) => setNewValue(prev => ({ ...prev, setupFee: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Select
                    value={newValue.unit || 'each'}
                    onValueChange={(value) => setNewValue(prev => ({ ...prev, unit: value || 'each' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="each">Each</SelectItem>
                      <SelectItem value="sqft">Square Feet</SelectItem>
                      <SelectItem value="linft">Linear Feet</SelectItem>
                      <SelectItem value="sqin">Square Inches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Price Formula</Label>
                <Input
                  value={newValue.priceFormula}
                  onChange={(e) => setNewValue(prev => ({ ...prev, priceFormula: e.target.value }))}
                  placeholder="e.g., base_price * 1.2 + setup_fee"
                />
              </div>
              <Button type="button" onClick={addOptionValue} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Value
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {optionId ? 'Update Option' : 'Add Option'}
          </Button>
        </div>
      </form>
    </div>
  );
};