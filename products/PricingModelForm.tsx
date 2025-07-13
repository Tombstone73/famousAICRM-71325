import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingModel, PRICING_TYPES } from '@/types/products';
import FormulaEditor from './FormulaEditor';

interface PricingModelFormProps {
  onSubmit: (data: Omit<PricingModel, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const PricingModelForm: React.FC<PricingModelFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'square-feet' as const,
    formula: 'Math.ceil(width * height * base_rate)',
    min_price: 0,
    max_price: 0,
    setup_fee: 0,
    width_enabled: true,
    height_enabled: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      const formula = {
        base_rate: 2.50,
        width_enabled: formData.width_enabled,
        height_enabled: formData.height_enabled,
        calculation: formData.formula
      };
      
      await onSubmit({
        ...formData,
        formula: JSON.stringify(formula)
      });
    } finally {
      setLoading(false);
    }
  };

  const presetFormulas = [
    { name: 'Square Feet', formula: 'Math.ceil(width * height * base_rate)' },
    { name: 'Linear Feet', formula: 'Math.ceil(width * base_rate)' },
    { name: 'Flat Rate', formula: 'base_rate' },
    { name: 'Volume Based', formula: 'Math.ceil(width * height * 0.5 * base_rate)' },
    { name: 'Tiered Pricing', formula: 'width * height > 100 ? Math.ceil(width * height * base_rate * 0.8) : Math.ceil(width * height * base_rate)' }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add Pricing Model with Custom Formula</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Model Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter pricing model name"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Pricing Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing type" />
                </SelectTrigger>
                <SelectContent>
                  {PRICING_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Size Options</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.width_enabled}
                  onChange={(e) => setFormData({ ...formData, width_enabled: e.target.checked })}
                />
                Enable Width Input
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.height_enabled}
                  onChange={(e) => setFormData({ ...formData, height_enabled: e.target.checked })}
                />
                Enable Height Input
              </label>
            </div>
          </div>

          <div>
            <Label>Preset Formulas</Label>
            <div className="flex gap-2 flex-wrap mt-2">
              {presetFormulas.map((preset) => (
                <Button
                  key={preset.name}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setFormData({ ...formData, formula: preset.formula })}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <FormulaEditor
            formula={formData.formula}
            onChange={(formula) => setFormData({ ...formData, formula })}
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="min_price">Min Price ($)</Label>
              <Input
                id="min_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.min_price}
                onChange={(e) => setFormData({ ...formData, min_price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="max_price">Max Price ($)</Label>
              <Input
                id="max_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.max_price}
                onChange={(e) => setFormData({ ...formData, max_price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="setup_fee">Setup Fee ($)</Label>
              <Input
                id="setup_fee"
                type="number"
                step="0.01"
                min="0"
                value={formData.setup_fee}
                onChange={(e) => setFormData({ ...formData, setup_fee: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? 'Saving...' : 'Add Pricing Model'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PricingModelForm;