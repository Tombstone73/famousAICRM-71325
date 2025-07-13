import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGlobalRateCalculations } from './GlobalRatePricingCalculator';

interface ConditionalOptionProps {
  optionName: string;
  value: any;
  onChange: (value: any) => void;
  productDimensions?: { width: number; height: number };
  showPricing?: boolean;
}

// Grommet placement configuration
interface GrommetConfig {
  enabled: boolean;
  placement: string[];
  spacing: number;
  additionalGrommets: number;
  totalCost: number;
}

// Pole pocket configuration
interface PolePocketConfig {
  enabled: boolean;
  pocketSize: string;
  sides: string[];
  setupFee: number;
  linearFootageCost: number;
  totalCost: number;
}

export const ConditionalOptionRenderer: React.FC<ConditionalOptionProps> = ({
  optionName,
  value,
  onChange,
  productDimensions = { width: 48, height: 24 },
  showPricing = true
}) => {
  // Handle Grommets option with conditional logic
  if (optionName === 'Grommets') {
    return (
      <GrommetOption
        value={value}
        onChange={onChange}
        productDimensions={productDimensions}
        showPricing={showPricing}
      />
    );
  }

  // Handle Pole Pockets option with conditional logic
  if (optionName === 'Pole Pockets') {
    return (
      <PolePocketOption
        value={value}
        onChange={onChange}
        productDimensions={productDimensions}
        showPricing={showPricing}
      />
    );
  }

  return null;
};

// Grommet Option Component
const GrommetOption: React.FC<ConditionalOptionProps> = ({
  value,
  onChange,
  productDimensions,
  showPricing
}) => {
  const { calculateGrommetPricing } = useGlobalRateCalculations();
  const [config, setConfig] = useState<GrommetConfig>({
    enabled: true,
    placement: ['corners'],
    spacing: 24,
    additionalGrommets: 0,
    totalCost: 0
  });

  useEffect(() => {
    if (value) {
      setConfig(value);
    }
  }, [value]);

  const handleConfigChange = (updates: Partial<GrommetConfig>) => {
    const newConfig = { ...config, ...updates };
    
    if (newConfig.enabled) {
      // Use global rate calculation
      const pricingCalc = calculateGrommetPricing(
        productDimensions.width,
        productDimensions.height,
        newConfig.spacing
      );
      newConfig.totalCost = pricingCalc.totalPrice;
      newConfig.additionalGrommets = pricingCalc.quantity - 4; // Subtract base 4 corner grommets
    } else {
      newConfig.totalCost = 0;
      newConfig.additionalGrommets = 0;
    }
    
    setConfig(newConfig);
    onChange(newConfig);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => handleConfigChange({ enabled })}
            />
            <Label>Grommets</Label>
          </div>
          {showPricing && config.enabled && (
            <Badge variant="outline">
              +${config.totalCost.toFixed(2)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      {config.enabled && (
        <CardContent className="space-y-4">
          <div>
            <Label>Grommet Placement</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['corners', 'top', 'bottom', 'left', 'right'].map((side) => (
                <div key={side} className="flex items-center space-x-2">
                  <Checkbox
                    checked={config.placement.includes(side)}
                    onCheckedChange={(checked) => {
                      const newPlacement = checked
                        ? [...config.placement, side]
                        : config.placement.filter(p => p !== side);
                      handleConfigChange({ placement: newPlacement });
                    }}
                  />
                  <Label className="capitalize">{side}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label>Spacing Between Grommets (inches)</Label>
            <Input
              type="number"
              value={config.spacing}
              onChange={(e) => handleConfigChange({ spacing: parseFloat(e.target.value) || 24 })}
              min="6"
              max="48"
              step="1"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Standard spacing is 24". Closer spacing incurs additional charges.
            </p>
          </div>
          
          {showPricing && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total Grommets:</span>
                <span>{config.additionalGrommets + 4}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Additional Grommets:</span>
                <span>{config.additionalGrommets}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total Cost:</span>
                <span>${config.totalCost.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                *Pricing based on global grommet rate
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// Pole Pocket Option Component
const PolePocketOption: React.FC<ConditionalOptionProps> = ({
  value,
  onChange,
  productDimensions,
  showPricing
}) => {
  const { calculatePolePocketPricing } = useGlobalRateCalculations();
  const [config, setPocketConfig] = useState<PolePocketConfig>({
    enabled: false,
    pocketSize: '2-inch',
    sides: [],
    setupFee: 0,
    linearFootageCost: 0,
    totalCost: 0
  });

  useEffect(() => {
    if (value) {
      setPocketConfig(value);
    }
  }, [value]);

  const handlePocketConfigChange = (updates: Partial<PolePocketConfig>) => {
    const newConfig = { ...config, ...updates };
    
    if (newConfig.enabled && newConfig.sides.length > 0) {
      // Use global rate calculation
      const pricingCalcs = calculatePolePocketPricing(newConfig.sides, productDimensions);
      
      newConfig.setupFee = pricingCalcs.find(calc => calc.rateName === 'pole_pocket_setup')?.totalPrice || 0;
      newConfig.linearFootageCost = pricingCalcs.find(calc => calc.rateName === 'pole_pocket_linear')?.totalPrice || 0;
      newConfig.totalCost = newConfig.setupFee + newConfig.linearFootageCost;
    } else {
      newConfig.setupFee = 0;
      newConfig.linearFootageCost = 0;
      newConfig.totalCost = 0;
    }
    
    setPocketConfig(newConfig);
    onChange(newConfig);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => handlePocketConfigChange({ enabled })}
            />
            <Label>Pole Pockets</Label>
          </div>
          {showPricing && config.enabled && (
            <Badge variant="outline">
              +${config.totalCost.toFixed(2)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      {config.enabled && (
        <CardContent className="space-y-4">
          <div>
            <Label>Pocket Size</Label>
            <Select
              value={config.pocketSize}
              onValueChange={(pocketSize) => handlePocketConfigChange({ pocketSize })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-inch">2 inch</SelectItem>
                <SelectItem value="3-inch">3 inch</SelectItem>
                <SelectItem value="4-inch">4 inch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Select Sides for Pole Pockets</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['top', 'bottom', 'left', 'right'].map((side) => (
                <div key={side} className="flex items-center space-x-2">
                  <Checkbox
                    checked={config.sides.includes(side)}
                    onCheckedChange={(checked) => {
                      const newSides = checked
                        ? [...config.sides, side]
                        : config.sides.filter(s => s !== side);
                      handlePocketConfigChange({ sides: newSides });
                    }}
                  />
                  <Label className="capitalize">{side}</Label>
                </div>
              ))}
            </div>
          </div>
          
          {showPricing && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Setup Fee:</span>
                <span>${config.setupFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Linear Footage Cost:</span>
                <span>${config.linearFootageCost.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total Cost:</span>
                <span>${config.totalCost.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                *Pricing based on global pole pocket rates
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};