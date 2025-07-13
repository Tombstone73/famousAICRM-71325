import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConditionalOptionsRenderer } from './ConditionalOptionsRenderer';
import { FormulaTestSection } from './FormulaTestSection';
import { PricingPreview } from './PricingPreview';
import { useProducts } from '@/hooks/useProducts';
import { useOptionRates } from '@/hooks/useOptionRates';

interface ModularProductConfigurationProps {
  productId?: string;
  onConfigurationChange?: (config: any) => void;
}

export const ModularProductConfiguration: React.FC<ModularProductConfigurationProps> = ({
  productId,
  onConfigurationChange
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [testVariables, setTestVariables] = useState<Record<string, number>>({});
  const { getProduct } = useProducts();
  const { rates } = useOptionRates();

  // Handle option selection changes
  const handleOptionChange = (optionId: string, value: any) => {
    const newOptions = { ...selectedOptions, [optionId]: value };
    setSelectedOptions(newOptions);
    onConfigurationChange?.(newOptions);
  };

  // Calculate total pricing based on selected options
  const calculateTotalPrice = () => {
    let total = 0;
    Object.entries(selectedOptions).forEach(([optionId, value]) => {
      const rate = rates.find(r => r.option_type === optionId);
      if (rate && value) {
        switch (rate.pricing_type) {
          case 'flat_fee':
            total += rate.base_price;
            break;
          case 'per_unit':
            total += rate.base_price * (value.quantity || 1);
            break;
          case 'formula':
            // Formula calculation would go here
            break;
        }
      }
    });
    return total;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="options" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="test">Test Formula</TabsTrigger>
              <TabsTrigger value="preview">Pricing Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="options" className="space-y-4">
              <ConditionalOptionsRenderer
                selectedOptions={selectedOptions}
                onOptionChange={handleOptionChange}
                rates={rates}
              />
            </TabsContent>
            
            <TabsContent value="test" className="space-y-4">
              <FormulaTestSection
                selectedOptions={selectedOptions}
                testVariables={testVariables}
                onVariableChange={setTestVariables}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <PricingPreview
                selectedOptions={selectedOptions}
                rates={rates}
                totalPrice={calculateTotalPrice()}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};