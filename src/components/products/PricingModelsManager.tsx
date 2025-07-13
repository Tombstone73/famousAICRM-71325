import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Copy, Trash2 } from 'lucide-react';
import { usePricingModels } from '@/hooks/usePricingModels';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { FormulaTestSection } from './FormulaTestSection';
import { supabase } from '@/lib/supabase';

interface PricingModelForm {
  id?: string;
  name: string;
  formula: string;
  rounding_strategy: string;
  base_price: number;
  unit: string;
  sheet_width?: number;
  sheet_height?: number;
  waste_buffer?: number;
}

export const PricingModelsManager: React.FC = () => {
  const { pricingModels, loading, addPricingModel, refetch } = usePricingModels();
  const { products } = useProducts();
  const { toast } = useToast();
  
  const [editingModel, setEditingModel] = useState<PricingModelForm | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    setEditingModel({
      name: '',
      formula: 'width * height * base_price',
      rounding_strategy: 'none',
      base_price: 0,
      unit: 'sqft'
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (model: any) => {
    setEditingModel({
      id: model.id,
      name: model.name,
      formula: typeof model.formula === 'object' ? model.formula.expression : model.formula,
      rounding_strategy: model.rounding_strategy || 'none',
      base_price: model.base_price || 0,
      unit: model.unit || 'sqft',
      sheet_width: model.sheet_width,
      sheet_height: model.sheet_height,
      waste_buffer: model.waste_buffer
    });
    setIsDialogOpen(true);
  };

  const handleClone = (model: any) => {
    setEditingModel({
      name: `${model.name} (Copy)`,
      formula: typeof model.formula === 'object' ? model.formula.expression : model.formula,
      rounding_strategy: model.rounding_strategy || 'none',
      base_price: model.base_price || 0,
      unit: model.unit || 'sqft',
      sheet_width: model.sheet_width,
      sheet_height: model.sheet_height,
      waste_buffer: model.waste_buffer
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('pricing_models')
        .delete()
        .eq('id', modelId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Pricing model deleted successfully'
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting pricing model:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete pricing model',
        variant: 'destructive'
      });
    }
    setDeleteConfirm(null);
  };

  const handleSave = async () => {
    if (!editingModel?.name.trim() || !editingModel?.formula.trim()) {
      toast({ title: 'Error', description: 'Name and formula are required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingModel.id) {
        const { error } = await supabase
          .from('pricing_models')
          .update({
            name: editingModel.name,
            formula: editingModel.formula,
            rounding_strategy: editingModel.rounding_strategy,
            base_price: editingModel.base_price,
            unit: editingModel.unit,
            sheet_width: editingModel.sheet_width,
            sheet_height: editingModel.sheet_height,
            waste_buffer: editingModel.waste_buffer
          })
          .eq('id', editingModel.id);

        if (error) throw error;
      } else {
        const modelData = {
          name: editingModel.name,
          formula: editingModel.formula,
          rounding_strategy: editingModel.rounding_strategy,
          base_price: editingModel.base_price,
          unit: editingModel.unit,
          sheet_width: editingModel.sheet_width,
          sheet_height: editingModel.sheet_height,
          waste_buffer: editingModel.waste_buffer
        };

        await addPricingModel(modelData);
      }
      
      toast({
        title: 'Success',
        description: `Pricing model ${editingModel.id ? 'updated' : 'created'} successfully`
      });
      
      setIsDialogOpen(false);
      setEditingModel(null);
      refetch();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save pricing model', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const getProductsUsingModel = (modelId: string) => {
    return products.filter(p => p.pricing_model_id === modelId);
  };

  if (loading) {
    return <div>Loading pricing models...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Pricing Models</h2>
          <p className="text-gray-600">Manage pricing formulas and calculations</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing Model
        </Button>
      </div>

      <div className="grid gap-4">
        {pricingModels.map((model) => {
          const productsUsing = getProductsUsingModel(model.id);
          return (
            <Card key={model.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{model.unit || 'sqft'}</Badge>
                      <Badge variant="outline">{model.rounding_strategy || 'none'}</Badge>
                      {model.base_price > 0 && <Badge variant="outline">${model.base_price}</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(model)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleClone(model)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setDeleteConfirm(model.id)}
                      disabled={productsUsing.length > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                    {typeof model.formula === 'object' ? model.formula.expression : model.formula}
                  </div>
                  {productsUsing.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Used by {productsUsing.length} product(s):</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {productsUsing.slice(0, 3).map(p => (
                          <Badge key={p.id} variant="secondary" className="text-xs">{p.name}</Badge>
                        ))}
                        {productsUsing.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{productsUsing.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) { setIsDialogOpen(false); setEditingModel(null); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingModel?.id ? 'Edit' : 'Create'} Pricing Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={editingModel?.name || ''}
                  onChange={(e) => setEditingModel(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Enter model name"
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select
                  value={editingModel?.unit || 'sqft'}
                  onValueChange={(value) => setEditingModel(prev => prev ? { ...prev, unit: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">Square Feet</SelectItem>
                    <SelectItem value="sheet">Sheet</SelectItem>
                    <SelectItem value="linear_ft">Linear Feet</SelectItem>
                    <SelectItem value="flat">Flat Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Formula *</Label>
              <Textarea
                value={editingModel?.formula || ''}
                onChange={(e) => setEditingModel(prev => prev ? { ...prev, formula: e.target.value } : null)}
                placeholder="width * height * base_price"
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Base Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingModel?.base_price || ''}
                  onChange={(e) => setEditingModel(prev => prev ? { ...prev, base_price: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              <div>
                <Label>Rounding Strategy</Label>
                <Select
                  value={editingModel?.rounding_strategy || 'none'}
                  onValueChange={(value) => setEditingModel(prev => prev ? { ...prev, rounding_strategy: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="ceil_to_ft">Ceil to Feet</SelectItem>
                    <SelectItem value="area_round_ft">Area Round Feet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <FormulaTestSection 
              formula={editingModel?.formula}
              pricingModel={editingModel}
              className="border-t pt-4"
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); setEditingModel(null); }}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Model'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pricing Model</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this pricing model? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};