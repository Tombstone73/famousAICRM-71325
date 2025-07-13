import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Zap } from 'lucide-react';
import { ProductOptionManager } from './ProductOptionManager';
import { EnhancedProductOptionsManager } from './EnhancedProductOptionsManager';
import { EnhancedProductOptionsSelector } from '@/components/orders/EnhancedProductOptionsSelector';
import { ProductOptionConfig } from './ProductOptionTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ProductOptionsTabProps {
  productId: string;
  readOnly?: boolean;
  productDimensions?: { width: number; height: number };
}

export const ProductOptionsTab: React.FC<ProductOptionsTabProps> = ({
  productId,
  readOnly = false,
  productDimensions = { width: 48, height: 24 }
}) => {
  const [options, setOptions] = useState<ProductOptionConfig[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('enhanced');

  const handleOptionsChange = (newOptions: ProductOptionConfig[]) => {
    setOptions(newOptions);
  };

  const handleSelectedOptionsChange = (selected: any[]) => {
    setSelectedOptions(selected);
  };

  const getOptionsSummary = () => {
    const total = options.length;
    const required = options.filter(opt => opt.required).length;
    const conditional = options.filter(opt => 
      ['Grommets', 'Pole Pockets', 'Hemming', 'Lamination'].includes(opt.name)
    ).length;
    return { total, required, conditional };
  };

  const summary = getOptionsSummary();

  if (readOnly) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Product Options
            <div className="flex space-x-2">
              <Badge variant="outline">{summary.total} Total</Badge>
              {summary.conditional > 0 && (
                <Badge variant="secondary">{summary.conditional} Conditional</Badge>
              )}
              {summary.required > 0 && (
                <Badge variant="destructive">{summary.required} Required</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {options.length > 0 ? (
              <EnhancedProductOptionsSelector
                productId={productId}
                options={options}
                selectedOptions={selectedOptions}
                onOptionsChange={handleSelectedOptionsChange}
                productDimensions={productDimensions}
                showPricing={true}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No options configured for this product.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enhanced" className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Enhanced Options
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Standard Options
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="enhanced">
          <ScrollArea className="h-[600px] pr-4">
            <EnhancedProductOptionsManager
              productId={productId}
              onOptionsChange={handleOptionsChange}
              productDimensions={productDimensions}
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="manage">
          <ScrollArea className="h-[600px] pr-4">
            <ProductOptionManager
              productId={productId}
              onOptionsChange={handleOptionsChange}
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Options Preview
                <div className="flex space-x-2">
                  <Badge variant="outline">{summary.total} Total</Badge>
                  {summary.conditional > 0 && (
                    <Badge variant="secondary">{summary.conditional} Conditional</Badge>
                  )}
                  {summary.required > 0 && (
                    <Badge variant="destructive">{summary.required} Required</Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {options.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Product Dimensions</h4>
                      <p className="text-sm text-gray-600">
                        Width: {productDimensions.width}" × Height: {productDimensions.height}"
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        These dimensions are used for calculating conditional option pricing.
                      </p>
                    </div>
                    
                    <EnhancedProductOptionsSelector
                      productId={productId}
                      options={options}
                      selectedOptions={selectedOptions}
                      onOptionsChange={handleSelectedOptionsChange}
                      productDimensions={productDimensions}
                      showPricing={true}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No options to preview. Add options in the "Enhanced Options" or "Standard Options" tabs.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};