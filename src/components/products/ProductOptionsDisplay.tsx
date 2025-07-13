import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface ProductOption {
  id: string;
  name: string;
  description?: string;
  price_modifier: number;
  required: boolean;
  is_default: boolean;
  conditional_media_type_id?: string;
}

interface ProductOptionsDisplayProps {
  options: ProductOption[];
  selectedOptions?: string[];
  onOptionToggle?: (optionId: string, selected: boolean) => void;
  selectedMediaTypeId?: string;
  readonly?: boolean;
  showPricing?: boolean;
}

export const ProductOptionsDisplay: React.FC<ProductOptionsDisplayProps> = ({
  options,
  selectedOptions = [],
  onOptionToggle,
  selectedMediaTypeId,
  readonly = false,
  showPricing = true
}) => {
  // Filter options based on conditional logic
  const availableOptions = options.filter(option => {
    if (!option.conditional_media_type_id) return true;
    return option.conditional_media_type_id === selectedMediaTypeId;
  });

  const requiredOptions = availableOptions.filter(opt => opt.required);
  const optionalOptions = availableOptions.filter(opt => !opt.required);

  const handleOptionClick = (option: ProductOption) => {
    if (readonly || option.required) return;
    
    const isSelected = selectedOptions.includes(option.id);
    onOptionToggle?.(option.id, !isSelected);
  };

  const isOptionSelected = (option: ProductOption) => {
    return selectedOptions.includes(option.id) || option.required || option.is_default;
  };

  const getOptionIcon = (option: ProductOption) => {
    if (option.required) {
      return <CheckCircle className="h-4 w-4 text-red-500" />;
    }
    
    const selected = isOptionSelected(option);
    return selected ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  if (availableOptions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No options available for this configuration</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Required Options */}
      {requiredOptions.length > 0 && (
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            Required Options
            <Badge variant="destructive" className="text-xs">Required</Badge>
          </h4>
          <div className="space-y-2">
            {requiredOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200"
              >
                <div className="flex items-center gap-3">
                  {getOptionIcon(option)}
                  <div>
                    <div className="font-medium">{option.name}</div>
                    {option.description && (
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    )}
                  </div>
                </div>
                {showPricing && (
                  <div className="text-sm font-medium">
                    {option.price_modifier >= 0 ? '+' : ''}${option.price_modifier.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {requiredOptions.length > 0 && optionalOptions.length > 0 && (
        <Separator />
      )}

      {/* Optional Options */}
      {optionalOptions.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Optional Add-ons</h4>
          <div className="space-y-2">
            {optionalOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                  readonly ? 'cursor-default' : 'cursor-pointer hover:bg-muted/50'
                } ${
                  isOptionSelected(option) ? 'bg-green-50 border-green-200' : 'bg-background'
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <div className="flex items-center gap-3">
                  {getOptionIcon(option)}
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {option.name}
                      {option.is_default && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    {option.description && (
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    )}
                  </div>
                </div>
                {showPricing && (
                  <div className="text-sm font-medium">
                    {option.price_modifier >= 0 ? '+' : ''}${option.price_modifier.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {showPricing && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Options Total:</span>
              <span className="font-mono">
                +${availableOptions
                  .filter(opt => isOptionSelected(opt))
                  .reduce((sum, opt) => sum + opt.price_modifier, 0)
                  .toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};