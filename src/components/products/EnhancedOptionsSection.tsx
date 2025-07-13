import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { ProductOptionManager } from './ProductOptionManager';
import { AddOptionDialog } from './AddOptionDialog';
import { useProductOptions } from '@/hooks/useProductOptions';
import { useMediaInventory } from '@/hooks/useMediaInventory';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EnhancedOptionsSectionProps {
  productId: string;
  data: any;
  onChange: (updates: any) => void;
}

export const EnhancedOptionsSection: React.FC<EnhancedOptionsSectionProps> = ({
  productId,
  data,
  onChange
}) => {
  const { productOptions, loading, addProductOption, updateProductOption, deleteProductOption, fetchProductOptions } = useProductOptions();
  const { mediaTypes } = useMediaInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);
  const [localOptions, setLocalOptions] = useState<any[]>([]);

  useEffect(() => {
    if (productId) {
      fetchProductOptions(productId);
    }
  }, [productId]);

  useEffect(() => {
    setLocalOptions(productOptions);
    // Update parent component with options
    onChange({ product_options: productOptions });
  }, [productOptions]);

  const handleAddOption = () => {
    setEditingOption(null);
    setIsDialogOpen(true);
  };

  const handleEditOption = (option: any) => {
    setEditingOption(option);
    setIsDialogOpen(true);
  };

  const handleSaveOption = async (optionData: any) => {
    try {
      const payload = {
        product_id: productId,
        name: optionData.name,
        description: optionData.description,
        price_modifier: optionData.price_modifier,
        required: optionData.required,
        conditional_media_type_id: optionData.conditional_media_type_id || null,
        is_default: optionData.is_default,
        option_type: 'addon',
        price: optionData.price_modifier,
        is_required: optionData.required,
        display_order: localOptions.length + 1,
        is_active: true
      };

      if (editingOption) {
        await updateProductOption(editingOption.id, payload);
      } else {
        await addProductOption(payload);
      }
    } catch (error) {
      console.error('Error saving option:', error);
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      await deleteProductOption(optionId);
    }
  };

  const getMediaTypeName = (mediaTypeId: string) => {
    const mediaType = mediaTypes.find(mt => mt.id === mediaTypeId);
    return mediaType?.name || 'Unknown Media';
  };

  const calculateTotalPriceModifier = () => {
    return localOptions
      .filter(option => option.is_default)
      .reduce((total, option) => total + (option.price_modifier || 0), 0);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading options...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Product Options</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Configure additional options and pricing modifiers for this product
            </p>
          </div>
          <Button onClick={handleAddOption}>
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </CardHeader>
        <CardContent>
          {localOptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No options configured yet</p>
              <p className="text-sm">Add options to customize this product with additional features</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Options Summary</p>
                    <p className="text-sm text-muted-foreground">
                      {localOptions.length} option{localOptions.length !== 1 ? 's' : ''} configured
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Default Price Modifier: +${calculateTotalPriceModifier().toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {localOptions.filter(o => o.required).length} required, {localOptions.filter(o => o.is_default).length} default
                    </p>
                  </div>
                </div>
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {localOptions.map((option) => (
                  <div key={option.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{option.name}</h4>
                          <div className="flex gap-1">
                            {option.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            {option.is_default && (
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                            {option.conditional_media_type_id && (
                              <Badge variant="outline" className="text-xs">
                                {getMediaTypeName(option.conditional_media_type_id)} only
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {option.description && (
                            <p>{option.description}</p>
                          )}
                          <p className="font-medium">
                            Price: {option.price_modifier >= 0 ? '+' : ''}${option.price_modifier?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEditOption(option)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteOption(option.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conditional Logic Alert */}
      {localOptions.some(option => option.conditional_media_type_id) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some options have conditional logic based on media type. These will only appear when the specified media is selected.
          </AlertDescription>
        </Alert>
      )}

      <AddOptionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveOption}
        editingOption={editingOption}
      />
    </div>
  );
};