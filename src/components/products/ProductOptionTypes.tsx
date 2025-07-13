import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface OptionValue {
  id: string;
  label: string;
  value: string;
  price_modifier?: number;
  formula?: string;
}

export interface ProductOptionConfig {
  id: string;
  name: string;
  type: 'dropdown' | 'radio' | 'toggle' | 'numeric';
  required: boolean;
  values?: OptionValue[];
  price_modifier?: number;
  formula?: string;
  default_value?: string;
}

interface ProductOptionRendererProps {
  option: ProductOptionConfig;
  value: any;
  onChange: (value: any) => void;
  showPricing?: boolean;
}

export const ProductOptionRenderer: React.FC<ProductOptionRendererProps> = ({
  option,
  value,
  onChange,
  showPricing = false
}) => {
  const renderPriceModifier = (modifier?: number, formula?: string) => {
    if (!showPricing) return null;
    
    if (formula) {
      return <Badge variant="outline" className="ml-2">Formula: {formula}</Badge>;
    }
    
    if (modifier && modifier !== 0) {
      const sign = modifier > 0 ? '+' : '';
      return <Badge variant="outline" className="ml-2">{sign}${modifier}</Badge>;
    }
    
    return null;
  };

  switch (option.type) {
    case 'dropdown':
      return (
        <div className="space-y-2">
          <Label className="flex items-center">
            {option.name}
            {option.required && <span className="text-red-500 ml-1">*</span>}
            {renderPriceModifier(option.price_modifier, option.formula)}
          </Label>
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${option.name}`} />
            </SelectTrigger>
            <SelectContent>
              {!option.required && (
                <SelectItem value="">None</SelectItem>
              )}
              {option.values?.map((optionValue) => (
                <SelectItem key={optionValue.id} value={optionValue.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{optionValue.label}</span>
                    {showPricing && renderPriceModifier(optionValue.price_modifier, optionValue.formula)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          <Label className="flex items-center">
            {option.name}
            {option.required && <span className="text-red-500 ml-1">*</span>}
            {renderPriceModifier(option.price_modifier, option.formula)}
          </Label>
          <RadioGroup value={value || ''} onValueChange={onChange}>
            {!option.required && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id={`${option.id}-none`} />
                <Label htmlFor={`${option.id}-none`}>None</Label>
              </div>
            )}
            {option.values?.map((optionValue) => (
              <div key={optionValue.id} className="flex items-center space-x-2">
                <RadioGroupItem value={optionValue.value} id={optionValue.id} />
                <Label htmlFor={optionValue.id} className="flex items-center">
                  {optionValue.label}
                  {showPricing && renderPriceModifier(optionValue.price_modifier, optionValue.formula)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case 'toggle':
      return (
        <div className="flex items-center justify-between">
          <Label className="flex items-center">
            {option.name}
            {option.required && <span className="text-red-500 ml-1">*</span>}
            {renderPriceModifier(option.price_modifier, option.formula)}
          </Label>
          <Switch
            checked={value || false}
            onCheckedChange={onChange}
          />
        </div>
      );

    case 'numeric':
      return (
        <div className="space-y-2">
          <Label className="flex items-center">
            {option.name}
            {option.required && <span className="text-red-500 ml-1">*</span>}
            {renderPriceModifier(option.price_modifier, option.formula)}
          </Label>
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
            placeholder={`Enter ${option.name}`}
          />
        </div>
      );

    default:
      return null;
  }
};
