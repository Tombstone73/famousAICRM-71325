import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useProductOptions } from '@/hooks/useProductOptions';
import { EnhancedAddOptionDialog } from './EnhancedAddOptionDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProductOptionsManagerProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
}

export const ProductOptionsManager: React.FC<ProductOptionsManagerProps> = ({
  selectedOptions,
  onOptionsChange
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<string | undefined>();
  const { productOptions, deleteProductOption, refetch } = useProductOptions();

  const handleOptionToggle = (optionId: string, checked: boolean) => {
    if (checked) {
      onOptionsChange([...selectedOptions, optionId]);
    } else {
      onOptionsChange(selectedOptions.filter(id => id !== optionId));
    }
  };

  const handleEdit = (optionId: string) => {
    setEditingOption(optionId);
    setShowAddDialog(true);
  };

  const handleDelete = async (optionId: string) => {
    if (confirm('Are you sure you want to delete this option?')) {
      await deleteProductOption(optionId);
      onOptionsChange(selectedOptions.filter(id => id !== optionId));
    }
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
    setEditingOption(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Available Options</Label>
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>

      {productOptions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No options available. Create your first option to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productOptions.map(option => (
            <Card key={option.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={option.id}
                      checked={selectedOptions.includes(option.id)}
                      onCheckedChange={(checked) => handleOptionToggle(option.id, checked as boolean)}
                    />
                    <div>
                      <Label htmlFor={option.id} className="font-medium cursor-pointer">
                        {option.name}
                      </Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {option.type}
                        </Badge>
                        {option.inventory_tracking && (
                          <Badge variant="secondary" className="text-xs">
                            Tracked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(option.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(option.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {option.settings && (
                  <div className="space-y-2">
                    {option.type === 'dropdown' && option.settings.options && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Options:</p>
                        <div className="flex flex-wrap gap-1">
                          {option.settings.options.slice(0, 3).map((opt: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {opt.label}
                            </Badge>
                          ))}
                          {option.settings.options.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{option.settings.options.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    {option.price_impact_formula && (
                      <div>
                        <p className="text-xs text-gray-500">Price Formula:</p>
                        <code className="text-xs bg-gray-100 px-1 rounded">
                          {option.price_impact_formula}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <EnhancedAddOptionDialog
            optionId={editingOption}
            onClose={handleDialogClose}
            onOptionAdded={() => {
              refetch();
              handleDialogClose();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};