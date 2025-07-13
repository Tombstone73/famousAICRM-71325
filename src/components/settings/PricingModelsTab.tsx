import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { usePricingModels } from '@/hooks/usePricingModels';
import { useToast } from '@/hooks/use-toast';
import PresetFormulas from './PresetFormulas';

interface PricingModelForm {
  name: string;
  type: string;
  formula: string;
  minPrice: number;
  maxPrice: number;
  setupFee: number;
}

const PricingModelsTab: React.FC = () => {
  const { pricingModels, loading, addPricingModel, refetch } = usePricingModels();
  const { toast } = useToast();
  const [editingModel, setEditingModel] = useState<PricingModelForm | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testValues, setTestValues] = useState({ width: 10, height: 10, quantity: 1, base_rate: 2.5 });
  const [testResult, setTestResult] = useState<number | null>(null);

  const typeLabels = {
    'square-feet': 'Square Feet',
    'linear-feet': 'Linear Feet', 
    'fixed': 'Fixed Rate',
    'square-inches': 'Square Inches',
    'sheet-size': 'Sheet Size'
  };

  const handleCreateModel = () => {
    setEditingModel({
      name: '',
      type: 'square-feet',
      formula: 'width * height * base_rate',
      minPrice: 0,
      maxPrice: 0,
      setupFee: 0
    });
    setIsDialogOpen(true);
  };

  const handlePresetClick = (preset: any) => {
    if (editingModel) {
      setEditingModel({ 
        ...editingModel, 
        name: preset.name,
        formula: preset.formula, 
        type: preset.type 
      });
    }
  };

  const testFormula = () => {
    if (!editingModel?.formula) return;
    
    try {
      const { width, height, quantity, base_rate } = testValues;
      const context = { width, height, quantity, base_rate, ceil: Math.ceil };
      
      const result = new Function(...Object.keys(context), `return ${editingModel.formula}`)(...Object.values(context));
      
      setTestResult(Number(result.toFixed(2)));
    } catch (error) {
      console.error('Formula test error:', error);
      toast({
        title: 'Formula Error',
        description: 'Invalid formula syntax',
        variant: 'destructive'
      });
    }
  };

  const isFormValid = () => {
    return editingModel?.name.trim() && editingModel?.formula.trim() && editingModel?.type;
  };

  const handleSaveModel = async () => {
    if (!isFormValid()) {
      toast({
        title: 'Error',
        description: 'Name, type, and formula are required',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const modelData = {
        name: editingModel!.name,
        type: editingModel!.type,
        formula: {
          expression: editingModel!.formula
        },
        min_price: editingModel!.minPrice || null,
        max_price: editingModel!.maxPrice || null,
        setup_fee: editingModel!.setupFee || null
      };
      
      await addPricingModel(modelData);
      setIsDialogOpen(false);
      setEditingModel(null);
      setTestResult(null);
    } catch (error) {
      console.error('Failed to save pricing model:', error);
    } finally {
      setSaving(false);
    }
  };

  const getFormulaDisplay = (formula: any) => {
    if (typeof formula === 'object' && formula?.expression) {
      return formula.expression;
    }
    return formula || 'No formula';
  };

  if (loading) {
    return <div>Loading pricing models...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Models</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Saved Models ({pricingModels.length})</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateModel} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Pricing Model
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Pricing Model</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modelName">Model Name *</Label>
                    <Input
                      id="modelName"
                      value={editingModel?.name || ''}
                      onChange={(e) => setEditingModel(prev => prev ? { ...prev, name: e.target.value } : null)}
                      placeholder="Enter model name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricingType">Pricing Type *</Label>
                    <Select value={editingModel?.type} onValueChange={(value) => setEditingModel(prev => prev ? { ...prev, type: value } : null)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square-feet">Square Feet</SelectItem>
                        <SelectItem value="linear-feet">Linear Feet</SelectItem>
                        <SelectItem value="fixed">Fixed Rate</SelectItem>
                        <SelectItem value="square-inches">Square Inches</SelectItem>
                        <SelectItem value="sheet-size">Sheet Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <PresetFormulas onPresetClick={handlePresetClick} />

                <div className="space-y-4">
                  <h4 className="font-medium">Formula Editor</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="modelFormula">Formula (JavaScript) *</Label>
                    <Textarea
                      id="modelFormula"
                      value={editingModel?.formula || ''}
                      onChange={(e) => setEditingModel(prev => prev ? { ...prev, formula: e.target.value } : null)}
                      placeholder="width * height * base_rate"
                      className="font-mono h-20"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Width</Label>
                      <Input
                        type="number"
                        value={testValues.width}
                        onChange={(e) => setTestValues(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input
                        type="number"
                        value={testValues.height}
                        onChange={(e) => setTestValues(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={testValues.quantity}
                        onChange={(e) => setTestValues(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Base Rate</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={testValues.base_rate}
                        onChange={(e) => setTestValues(prev => ({ ...prev, base_rate: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={testFormula} className="w-full">
                    Test Formula
                  </Button>
                  
                  {testResult !== null && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border">
                      <p className="font-medium">Result: ${testResult}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPrice">Min Price ($)</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      step="0.01"
                      value={editingModel?.minPrice || ''}
                      onChange={(e) => setEditingModel(prev => prev ? { ...prev, minPrice: parseFloat(e.target.value) || 0 } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Max Price ($)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      step="0.01"
                      value={editingModel?.maxPrice || ''}
                      onChange={(e) => setEditingModel(prev => prev ? { ...prev, maxPrice: parseFloat(e.target.value) || 0 } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setupFee">Setup Fee ($)</Label>
                    <Input
                      id="setupFee"
                      type="number"
                      step="0.01"
                      value={editingModel?.setupFee || ''}
                      onChange={(e) => setEditingModel(prev => prev ? { ...prev, setupFee: parseFloat(e.target.value) || 0 } : null)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveModel}
                  disabled={saving || !isFormValid()}
                >
                  {saving ? 'Saving...' : 'Add Pricing Model'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {pricingModels.map((model) => (
            <div key={model.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{model.name}</h4>
                  <p className="text-sm text-gray-600">{typeLabels[model.type] || model.type}</p>
                  <p className="text-sm font-mono mt-1">{getFormulaDisplay(model.formula)}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(model.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {pricingModels.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pricing models created yet. Click "Add Pricing Model" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingModelsTab;