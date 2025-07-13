import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign } from 'lucide-react';
import { ProductOptionRenderer, ProductOptionConfig } from '@/components/products/ProductOptionTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface SelectedOption {
  optionId: string;
  value: any;
  priceOverride?: number;
  customFormula?: string;
}

interface ProductOptionsSelectorProps {
  productId: string;
  options: ProductOptionConfig[];
  selectedOptions: SelectedOption[];
  onOptionsChange: (options: SelectedOption[]) => void;
  allowPriceOverride?: boolean;
  showPricing?: boolean;
}

export const ProductOptionsSelector: React.FC<ProductOptionsSelectorProps> = ({
  productId,
  options,
  selectedOptions,
  onOptionsChange,
  allowPriceOverride = false,
  showPricing = true
}) => {
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<SelectedOption | null>(null);
  const [totalPriceImpact, setTotalPriceImpact] = useState(0);

  useEffect(() => {
    calculateTotalPriceImpact();
  }, [selectedOptions, options]);

  const calculateTotalPriceImpact = () => {
    let total = 0;
    
    selectedOptions.forEach(selected => {
      const option = options.find(opt => opt.id === selected.optionId);
      if (!option) return;
      
      // Use price override if available
      if (selected.priceOverride !== undefined) {
        total += selected.priceOverride;
        return;
      }
      
      // Use custom formula if available
      if (selected.customFormula) {
        try {
          // Simple formula evaluation - in production, use a proper formula engine
          const result = evaluateFormula(selected.customFormula, selected.value);
          total += result;
        } catch (error) {
          console.error('Formula evaluation error:', error);
        }
        return;
      }
      
      // Use option-level pricing
      if (option.type === 'toggle' && selected.value) {
        total += option.price_modifier || 0;
      } else if (option.type === 'dropdown' || option.type === 'radio') {
        const selectedValue = option.values?.find(v => v.value === selected.value);
        if (selectedValue) {
          total += selectedValue.price_modifier || 0;
        }
      } else if (option.type === 'numeric' && selected.value) {
        total += (option.price_modifier || 0) * selected.value;
      }
    });
    
    setTotalPriceImpact(total);
  };

  const evaluateFormula = (formula: string, value: any): number => {
    // Simple formula evaluation - replace with proper formula engine
    try {
      const sanitizedFormula = formula.replace(/value/g, value?.toString() || '0');
      return eval(sanitizedFormula) || 0;
    } catch {
      return 0;
    }
  };

  const handleOptionChange = (optionId: string, value: any) => {
    const existingIndex = selectedOptions.findIndex(opt => opt.optionId === optionId);
    
    if (existingIndex >= 0) {
      const updated = [...selectedOptions];
      updated[existingIndex] = { ...updated[existingIndex], value };
      onOptionsChange(updated);
    } else {
      onOptionsChange([...selectedOptions, { optionId, value }]);
    }
  };

  const handlePriceOverride = (optionId: string) => {
    const selected = selectedOptions.find(opt => opt.optionId === optionId);
    if (selected) {
      setEditingOption(selected);
      setOverrideDialogOpen(true);
    }
  };

  const handleSaveOverride = (priceOverride?: number, customFormula?: string) => {
    if (!editingOption) return;
    
    const updated = selectedOptions.map(opt => 
      opt.optionId === editingOption.optionId 
        ? { ...opt, priceOverride, customFormula }
        : opt
    );
    
    onOptionsChange(updated);
    setOverrideDialogOpen(false);
    setEditingOption(null);
  };

  const getSelectedValue = (optionId: string) => {
    return selectedOptions.find(opt => opt.optionId === optionId)?.value;
  };

  const getOptionPriceDisplay = (option: ProductOptionConfig) => {
    const selected = selectedOptions.find(opt => opt.optionId === option.id);
    if (!selected || !showPricing) return null;
    
    if (selected.priceOverride !== undefined) {
      return (
        <Badge variant="secondary" className="ml-2">
          Override: ${selected.priceOverride}
        </Badge>
      );
    }
    
    if (selected.customFormula) {
      return (
        <Badge variant="outline" className="ml-2">
          Custom Formula
        </Badge>
      );
    }
    
    return null;
  };

  if (options.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            No options configured for this product.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Product Options
          {showPricing && (
            <Badge variant={totalPriceImpact >= 0 ? 'default' : 'destructive'}>
              {totalPriceImpact >= 0 ? '+' : ''}${totalPriceImpact.toFixed(2)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {options.map((option) => (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ProductOptionRenderer
                    option={option}
                    value={getSelectedValue(option.id)}
                    onChange={(value) => handleOptionChange(option.id, value)}
                    showPricing={showPricing}
                  />
                  {getOptionPriceDisplay(option)}
                </div>
                
                {allowPriceOverride && getSelectedValue(option.id) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriceOverride(option.id)}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Override
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <PriceOverrideDialog
        isOpen={overrideDialogOpen}
        onClose={() => {
          setOverrideDialogOpen(false);
          setEditingOption(null);
        }}
        option={editingOption}
        onSave={handleSaveOverride}
      />
    </Card>
  );
};

interface PriceOverrideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  option: SelectedOption | null;
  onSave: (priceOverride?: number, customFormula?: string) => void;
}

const PriceOverrideDialog: React.FC<PriceOverrideDialogProps> = ({
  isOpen,
  onClose,
  option,
  onSave
}) => {
  const [priceOverride, setPriceOverride] = useState<number | undefined>();
  const [customFormula, setCustomFormula] = useState('');
  const [overrideType, setOverrideType] = useState<'price' | 'formula'>('price');

  useEffect(() => {
    if (option) {
      setPriceOverride(option.priceOverride);
      setCustomFormula(option.customFormula || '');
      setOverrideType(option.customFormula ? 'formula' : 'price');
    }
  }, [option]);

  const handleSave = () => {
    if (overrideType === 'price') {
      onSave(priceOverride, undefined);
    } else {
      onSave(undefined, customFormula);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Price Override</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button
              variant={overrideType === 'price' ? 'default' : 'outline'}
              onClick={() => setOverrideType('price')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Fixed Price
            </Button>
            <Button
              variant={overrideType === 'formula' ? 'default' : 'outline'}
              onClick={() => setOverrideType('formula')}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Custom Formula
            </Button>
          </div>
          
          {overrideType === 'price' ? (
            <div>
              <Label htmlFor="price">Override Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={priceOverride || ''}
                onChange={(e) => setPriceOverride(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Enter price override"
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="formula">Custom Formula</Label>
              <Textarea
                id="formula"
                value={customFormula}
                onChange={(e) => setCustomFormula(e.target.value)}
                placeholder="Enter formula (use 'value' for option value)"
                rows={3}
              />
              <div className="text-sm text-gray-500 mt-1">
                Example: value * 2.5 + 10
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Override
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
