import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProductOptions } from '@/hooks/useProductOptions';
import { ProductOptionConfig, OptionValue } from './ProductOptionTypes';

interface ProductOptionManagerProps {
  productId: string;
  onOptionsChange?: (options: ProductOptionConfig[]) => void;
}

export const ProductOptionManager: React.FC<ProductOptionManagerProps> = ({
  productId,
  onOptionsChange
}) => {
  const [options, setOptions] = useState<ProductOptionConfig[]>([]);
  const [editingOption, setEditingOption] = useState<ProductOptionConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getProductOptionMappings, addProductOptionMapping, deleteProductOptionMapping } = useProductOptions();

  useEffect(() => {
    loadProductOptions();
  }, [productId]);

  const loadProductOptions = async () => {
    if (!productId) return;
    
    try {
      const mappings = await getProductOptionMappings(productId);
      const optionConfigs: ProductOptionConfig[] = mappings.map(mapping => ({
        id: mapping.id,
        name: mapping.product_options?.name || '',
        type: mapping.product_options?.type as any || 'dropdown',
        required: mapping.required,
        values: mapping.product_options?.settings?.values || [],
        price_modifier: mapping.product_options?.settings?.price_modifier,
        formula: mapping.pricing_adjustment_formula || mapping.product_options?.price_impact_formula,
        default_value: mapping.product_options?.settings?.default_value
      }));
      
      setOptions(optionConfigs);
      onOptionsChange?.(optionConfigs);
    } catch (error) {
      console.error('Error loading product options:', error);
    }
  };

  const handleAddOption = () => {
    setEditingOption({
      id: '',
      name: '',
      type: 'dropdown',
      required: false,
      values: [],
      price_modifier: 0
    });
    setIsDialogOpen(true);
  };

  const handleEditOption = (option: ProductOptionConfig) => {
    setEditingOption(option);
    setIsDialogOpen(true);
  };

  const handleSaveOption = async (option: ProductOptionConfig) => {
    try {
      if (option.id) {
        // Update existing option
        const updatedOptions = options.map(opt => 
          opt.id === option.id ? option : opt
        );
        setOptions(updatedOptions);
        onOptionsChange?.(updatedOptions);
      } else {
        // Add new option
        const newOption = { ...option, id: Date.now().toString() };
        const updatedOptions = [...options, newOption];
        setOptions(updatedOptions);
        onOptionsChange?.(updatedOptions);
      }
      
      setIsDialogOpen(false);
      setEditingOption(null);
    } catch (error) {
      console.error('Error saving option:', error);
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    try {
      await deleteProductOptionMapping(optionId);
      const updatedOptions = options.filter(opt => opt.id !== optionId);
      setOptions(updatedOptions);
      onOptionsChange?.(updatedOptions);
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Product Options
          <Button onClick={handleAddOption} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{option.name}</h4>
                  <Badge variant="outline">{option.type}</Badge>
                  {option.required && <Badge variant="destructive">Required</Badge>}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditOption(option)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteOption(option.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {option.values && option.values.length > 0 && (
                <div className="text-sm text-gray-600">
                  Values: {option.values.map(v => v.label).join(', ')}
                </div>
              )}
              
              {option.formula && (
                <div className="text-sm text-blue-600 mt-1">
                  Formula: {option.formula}
                </div>
              )}
            </div>
          ))}
          
          {options.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No options configured. Click "Add Option" to get started.
            </div>
          )}
        </div>
      </CardContent>
      
      <ProductOptionDialog
        option={editingOption}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingOption(null);
        }}
        onSave={handleSaveOption}
      />
    </Card>
  );
};

interface ProductOptionDialogProps {
  option: ProductOptionConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (option: ProductOptionConfig) => void;
}

const ProductOptionDialog: React.FC<ProductOptionDialogProps> = ({
  option,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ProductOptionConfig>({
    id: '',
    name: '',
    type: 'dropdown',
    required: false,
    values: [],
    price_modifier: 0
  });

  useEffect(() => {
    if (option) {
      setFormData(option);
    }
  }, [option]);

  const handleAddValue = () => {
    const newValue: OptionValue = {
      id: Date.now().toString(),
      label: '',
      value: '',
      price_modifier: 0
    };
    setFormData(prev => ({
      ...prev,
      values: [...(prev.values || []), newValue]
    }));
  };

  const handleUpdateValue = (index: number, updates: Partial<OptionValue>) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values?.map((value, i) => 
        i === index ? { ...value, ...updates } : value
      ) || []
    }));
  };

  const handleRemoveValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {option?.id ? 'Edit Option' : 'Add Option'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Option Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter option name"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Option Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                  <SelectItem value="radio">Radio Buttons</SelectItem>
                  <SelectItem value="toggle">Toggle Switch</SelectItem>
                  <SelectItem value="numeric">Numeric Input</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.required}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
            />
            <Label>Required</Label>
          </div>
          
          {(formData.type === 'dropdown' || formData.type === 'radio') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Option Values</Label>
                <Button onClick={handleAddValue} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.values?.map((value, index) => (
                  <div key={value.id} className="flex items-center space-x-2">
                    <Input
                      placeholder="Label"
                      value={value.label}
                      onChange={(e) => handleUpdateValue(index, { label: e.target.value })}
                    />
                    <Input
                      placeholder="Value"
                      value={value.value}
                      onChange={(e) => handleUpdateValue(index, { value: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Price +/-"
                      value={value.price_modifier || 0}
                      onChange={(e) => handleUpdateValue(index, { price_modifier: parseFloat(e.target.value) || 0 })}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveValue(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="formula">Pricing Formula (Optional)</Label>
            <Textarea
              id="formula"
              value={formData.formula || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, formula: e.target.value }))}
              placeholder="Enter custom pricing formula"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Option
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
