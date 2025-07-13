import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { useSKUSettings } from '@/hooks/useSKUSettings';

interface SKUGenerationSectionProps {
  category: string;
  currentSKU: string;
  onSKUChange: (sku: string) => void;
  manualOverride: boolean;
  onManualOverrideChange: (override: boolean) => void;
}

export const SKUGenerationSection: React.FC<SKUGenerationSectionProps> = ({
  category,
  currentSKU,
  onSKUChange,
  manualOverride,
  onManualOverrideChange
}) => {
  const { generateSKU, checkSKUExists } = useSKUSettings();
  const [previewSKU, setPreviewSKU] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [skuExists, setSKUExists] = useState(false);

  const handleGenerateSKU = async () => {
    if (!category) return;
    
    try {
      setIsGenerating(true);
      const newSKU = await generateSKU(category);
      setPreviewSKU(newSKU);
      if (!manualOverride) {
        onSKUChange(newSKU);
      }
    } catch (error) {
      console.error('Error generating SKU:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseSKU = () => {
    onSKUChange(previewSKU);
    setPreviewSKU('');
  };

  const checkCurrentSKU = async (sku: string) => {
    if (!sku) {
      setSKUExists(false);
      return;
    }
    
    try {
      const exists = await checkSKUExists(sku);
      setSKUExists(exists);
    } catch (error) {
      console.error('Error checking SKU:', error);
    }
  };

  useEffect(() => {
    if (currentSKU) {
      checkCurrentSKU(currentSKU);
    }
  }, [currentSKU]);

  useEffect(() => {
    if (category && !manualOverride && !currentSKU) {
      handleGenerateSKU();
    }
  }, [category, manualOverride]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>SKU Generation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="manual-override"
            checked={manualOverride}
            onCheckedChange={onManualOverrideChange}
          />
          <Label htmlFor="manual-override">Manual SKU Override</Label>
        </div>

        {manualOverride ? (
          <div className="space-y-2">
            <Label htmlFor="manual-sku">Manual SKU</Label>
            <div className="flex space-x-2">
              <Input
                id="manual-sku"
                value={currentSKU}
                onChange={(e) => onSKUChange(e.target.value)}
                placeholder="Enter custom SKU"
                className={skuExists ? 'border-red-500' : ''}
              />
              {skuExists && (
                <Badge variant="destructive">Already exists</Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Auto-Generated SKU</Label>
            <div className="flex space-x-2">
              <Input
                value={currentSKU}
                readOnly
                placeholder="SKU will be generated automatically"
                className="bg-gray-50"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateSKU}
                disabled={!category || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {previewSKU && previewSKU !== currentSKU && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Preview: {previewSKU}</p>
                <p className="text-xs text-gray-600">Generated for {category}</p>
              </div>
              <Button size="sm" onClick={handleUseSKU}>
                Use This SKU
              </Button>
            </div>
          </div>
        )}

        {!category && (
          <p className="text-sm text-gray-500">
            Select a category to enable SKU generation
          </p>
        )}
      </CardContent>
    </Card>
  );
};