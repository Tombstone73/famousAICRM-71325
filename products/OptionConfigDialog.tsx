import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OptionConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  option: any;
  dimensions?: { width: number; height: number };
  onConfigComplete: (config: any) => void;
}

const OptionConfigDialog: React.FC<OptionConfigDialogProps> = ({
  open,
  onOpenChange,
  option,
  dimensions,
  onConfigComplete
}) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [customInputs, setCustomInputs] = useState<Record<string, any>>({});

  const handleSubmit = () => {
    const selectedOptionValue = option.values?.find((v: any) => v.value === selectedValue);
    if (!selectedOptionValue) return;

    let calculatedPrice = selectedOptionValue.price;
    let calculation = '';

    // Calculate price based on pricing type and dimensions
    if (dimensions && selectedOptionValue.pricingType !== 'flat') {
      switch (selectedOptionValue.pricingType) {
        case 'linear_foot':
          if (option.name.toLowerCase().includes('pole pocket')) {
            // Special calculation for pole pockets
            let linearFeet = 0;
            if (selectedValue.includes('top_bottom')) {
              linearFeet = (dimensions.width * 2) / 12; // Convert inches to feet
              calculation = `Top and Bottom: ${dimensions.width}" × 2 = ${linearFeet.toFixed(2)} linear feet`;
            } else if (selectedValue.includes('all_sides')) {
              linearFeet = ((dimensions.width * 2) + (dimensions.height * 2)) / 12;
              calculation = `All Sides: (${dimensions.width}" + ${dimensions.height}") × 2 = ${linearFeet.toFixed(2)} linear feet`;
            } else if (selectedValue.includes('top')) {
              linearFeet = dimensions.width / 12;
              calculation = `Top: ${dimensions.width}" = ${linearFeet.toFixed(2)} linear feet`;
            } else if (selectedValue.includes('bottom')) {
              linearFeet = dimensions.width / 12;
              calculation = `Bottom: ${dimensions.width}" = ${linearFeet.toFixed(2)} linear feet`;
            } else if (selectedValue.includes('sides')) {
              linearFeet = (dimensions.height * 2) / 12;
              calculation = `Sides: ${dimensions.height}" × 2 = ${linearFeet.toFixed(2)} linear feet`;
            }
            calculatedPrice = selectedOptionValue.price * linearFeet;
          }
          break;
        case 'square_foot':
          const sqFt = (dimensions.width * dimensions.height) / 144;
          calculatedPrice = selectedOptionValue.price * sqFt;
          calculation = `${dimensions.width}" × ${dimensions.height}" = ${sqFt.toFixed(2)} sq ft`;
          break;
      }
    }

    const config = {
      optionId: option.id,
      optionName: option.name,
      selectedValue,
      selectedLabel: selectedOptionValue.label,
      basePrice: selectedOptionValue.price,
      calculatedPrice,
      setupFee: option.setupFee || 0,
      totalPrice: calculatedPrice + (option.setupFee || 0),
      calculation,
      customInputs,
      pricingType: selectedOptionValue.pricingType
    };

    onConfigComplete(config);
    onOpenChange(false);
  };

  const renderOptionValues = () => {
    if (!option.values) return null;

    if (option.optionType === 'radio') {
      return (
        <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
          {option.values.map((value: any) => (
            <div key={value.id} className="flex items-center space-x-2">
              <RadioGroupItem value={value.value} id={value.id} />
              <Label htmlFor={value.id} className="flex-1">
                <div className="flex justify-between items-center">
                  <span>{value.label}</span>
                  <span className="text-sm text-muted-foreground">
                    ${value.price} {value.pricingType !== 'flat' && `per ${value.pricingType.replace('_', ' ')}`}
                  </span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    return (
      <Select value={selectedValue} onValueChange={setSelectedValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {option.values.map((value: any) => (
            <SelectItem key={value.id} value={value.value}>
              <div className="flex justify-between items-center w-full">
                <span>{value.label}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ${value.price} {value.pricingType !== 'flat' && `per ${value.pricingType.replace('_', ' ')}`}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const renderCustomInputs = () => {
    if (!selectedValue || !option.name.toLowerCase().includes('pole pocket')) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Pocket Depth (inches)</Label>
            <Input
              type="number"
              value={customInputs.pocketDepth || ''}
              onChange={(e) => setCustomInputs(prev => ({ ...prev, pocketDepth: Number(e.target.value) }))}
              placeholder="e.g., 3"
              step="0.25"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Special Instructions</Label>
            <Textarea
              value={customInputs.instructions || ''}
              onChange={(e) => setCustomInputs(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Any special requirements..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const selectedOptionValue = option.values?.find((v: any) => v.value === selectedValue);
  const showPricePreview = selectedValue && dimensions && selectedOptionValue;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure {option.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {option.description && (
            <p className="text-sm text-muted-foreground">{option.description}</p>
          )}

          <div className="space-y-2">
            <Label>Select Option</Label>
            {renderOptionValues()}
          </div>

          {renderCustomInputs()}

          {showPricePreview && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Price Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedOptionValue.pricingType !== 'flat' && dimensions && (
                  <div className="text-sm">
                    <div className="text-muted-foreground">Calculation:</div>
                    <div>Base price: ${selectedOptionValue.price} per {selectedOptionValue.pricingType.replace('_', ' ')}</div>
                  </div>
                )}
                {option.setupFee > 0 && (
                  <div className="text-sm">Setup fee: ${option.setupFee}</div>
                )}
                <div className="font-medium border-t pt-2">
                  Total: ${((selectedOptionValue.price || 0) + (option.setupFee || 0)).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedValue}>
              Add Option
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptionConfigDialog;