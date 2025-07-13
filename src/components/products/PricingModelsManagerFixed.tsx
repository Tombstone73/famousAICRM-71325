import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Copy, Trash2 } from 'lucide-react';
import { usePricingModels } from '@/hooks/usePricingModels';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface PricingModelForm {
  id?: string;
  name: string;
  formula: string;
  rounding_strategy: string;
  base_price: number;
  unit: string;
}

export const PricingModelsManagerFixed: React.FC = () => {
  const { pricingModels, loading, addPricingModel, refetch } = usePricingModels();
  const { products } = useProducts();
  const { toast } = useToast();
  
  const [editingModel, setEditingModel] = useState<PricingModelForm | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      unit: model.unit || 'sqft'
    });
    setIsDialogOpen(true);
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
            unit: editingModel.unit
          })
          .eq('id', editingModel.id);

        if (error) throw error;
      } else {
        await addPricingModel({
          name: editingModel.name,
          formula: editingModel.formula,
          rounding_strategy: editingModel.rounding_strategy,
          base_price: editingModel.base_price,
          unit: editingModel.unit
        });
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

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingModel(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading pricing models...</p>
        </div>
      </div>
    );
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

      {pricingModels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No pricing models found</h3>
              <p className="text-gray-500 mb-4">Create your first pricing model to get started.</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Pricing Model
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pricingModels.map((model) => (
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                  {typeof model.formula === 'object' ? model.formula.expression : model.formula}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingModel?.id ? 'Edit' : 'Create'} Pricing Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={editingModel?.name || ''}
                onChange={(e) => setEditingModel(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Enter model name"
              />
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
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Model'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};