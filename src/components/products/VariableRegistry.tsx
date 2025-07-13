import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export interface FormulaVariable {
  id: string;
  name: string;
  key: string;
  type: 'product_field' | 'media_property' | 'option_value' | 'custom';
  fieldPath?: string;
  defaultValue?: number;
  description?: string;
  unit?: string;
}

interface VariableRegistryProps {
  variables: FormulaVariable[];
  onChange: (variables: FormulaVariable[]) => void;
}

const defaultVariables: FormulaVariable[] = [
  { id: 'width', name: 'Width', key: 'width', type: 'product_field', fieldPath: 'width', unit: 'in', description: 'Product width' },
  { id: 'height', name: 'Height', key: 'height', type: 'product_field', fieldPath: 'height', unit: 'in', description: 'Product height' },
  { id: 'area', name: 'Area', key: 'area', type: 'custom', unit: 'sq in', description: 'Width × Height' },
  { id: 'sqft', name: 'Square Feet', key: 'sqft', type: 'custom', unit: 'sq ft', description: 'Area ÷ 144' },
  { id: 'quantity', name: 'Quantity', key: 'qty', type: 'product_field', fieldPath: 'quantity', description: 'Order quantity' },
  { id: 'base_rate', name: 'Base Rate', key: 'rate', type: 'product_field', fieldPath: 'base_price', unit: '$', description: 'Base price per unit' }
];

export const VariableRegistry: React.FC<VariableRegistryProps> = ({ variables, onChange }) => {
  const [editingVariable, setEditingVariable] = useState<FormulaVariable | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const allVariables = [...defaultVariables, ...variables.filter(v => !defaultVariables.find(dv => dv.id === v.id))];

  const handleSaveVariable = (variable: FormulaVariable) => {
    const updated = variables.filter(v => v.id !== variable.id);
    updated.push(variable);
    onChange(updated);
    setEditingVariable(null);
    setIsDialogOpen(false);
  };

  const handleDeleteVariable = (id: string) => {
    const updated = variables.filter(v => v.id !== id);
    onChange(updated);
  };

  const createNewVariable = () => {
    const newVar: FormulaVariable = {
      id: Date.now().toString(),
      name: '',
      key: '',
      type: 'custom',
      description: ''
    };
    setEditingVariable(newVar);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Variable Registry
          <Button size="sm" onClick={createNewVariable}>
            <Plus className="h-4 w-4 mr-2" />
            Add Variable
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {allVariables.map((variable) => {
            const isDefault = defaultVariables.find(dv => dv.id === variable.id);
            return (
              <div key={variable.id} className="flex items-center gap-2 p-2 border rounded">
                <Badge variant={isDefault ? "secondary" : "outline"}>
                  {variable.type.replace('_', ' ')}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{variable.name}</span>
                    <code className="text-xs bg-muted px-1 rounded">{variable.key}</code>
                    {variable.unit && <span className="text-xs text-muted-foreground">({variable.unit})</span>}
                  </div>
                  {variable.description && (
                    <p className="text-sm text-muted-foreground">{variable.description}</p>
                  )}
                </div>
                {!isDefault && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => { setEditingVariable(variable); setIsDialogOpen(true); }}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteVariable(variable.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVariable?.id ? 'Edit Variable' : 'Add Variable'}</DialogTitle>
            </DialogHeader>
            {editingVariable && (
              <VariableEditor
                variable={editingVariable}
                onSave={handleSaveVariable}
                onCancel={() => setIsDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

interface VariableEditorProps {
  variable: FormulaVariable;
  onSave: (variable: FormulaVariable) => void;
  onCancel: () => void;
}

const VariableEditor: React.FC<VariableEditorProps> = ({ variable, onSave, onCancel }) => {
  const [formData, setFormData] = useState(variable);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.key) return;
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Variable display name"
        />
      </div>
      <div>
        <Label>Key</Label>
        <Input
          value={formData.key}
          onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
          placeholder="Variable key for formulas"
        />
      </div>
      <div>
        <Label>Type</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="product_field">Product Field</SelectItem>
            <SelectItem value="media_property">Media Property</SelectItem>
            <SelectItem value="option_value">Option Value</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Variable description"
        />
      </div>
      <div>
        <Label>Unit (optional)</Label>
        <Input
          value={formData.unit || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
          placeholder="e.g., in, sq ft, $"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};