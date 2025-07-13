import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { ProductFormData } from './ProductEntryForm';

interface FormulaVariable {
  id: string;
  name: string;
  type: 'number' | 'dimension' | 'area' | 'custom';
  defaultValue?: number;
  description?: string;
}

interface PricingFormula {
  id: string;
  name: string;
  formula: string;
  order: number;
  isActive: boolean;
}

interface FormulaSectionProps {
  data: ProductFormData;
  onChange: (updates: Partial<ProductFormData>) => void;
}

const defaultVariables: FormulaVariable[] = [
  { id: 'width', name: 'Width', type: 'dimension', description: 'Product width in inches' },
  { id: 'height', name: 'Height', type: 'dimension', description: 'Product height in inches' },
  { id: 'area', name: 'Area', type: 'area', description: 'Width × Height in square inches' },
  { id: 'sqft', name: 'Square Feet', type: 'area', description: 'Area ÷ 144' }
];

export const FormulaSection: React.FC<FormulaSectionProps> = ({ data, onChange }) => {
  const [variables, setVariables] = useState<FormulaVariable[]>(data.formulaVariables || defaultVariables);
  const [formulas, setFormulas] = useState<PricingFormula[]>(data.pricingFormulas || []);
  const [newVariable, setNewVariable] = useState({ name: '', type: 'number' as const, defaultValue: 0 });
  const [newFormula, setNewFormula] = useState({ name: '', formula: '' });

  const addVariable = () => {
    if (!newVariable.name) return;
    const variable: FormulaVariable = {
      id: Date.now().toString(),
      ...newVariable
    };
    const updated = [...variables, variable];
    setVariables(updated);
    onChange({ formulaVariables: updated });
    setNewVariable({ name: '', type: 'number', defaultValue: 0 });
  };

  const removeVariable = (id: string) => {
    const updated = variables.filter(v => v.id !== id);
    setVariables(updated);
    onChange({ formulaVariables: updated });
  };

  const addFormula = () => {
    if (!newFormula.name || !newFormula.formula) return;
    const formula: PricingFormula = {
      id: Date.now().toString(),
      ...newFormula,
      order: formulas.length,
      isActive: true
    };
    const updated = [...formulas, formula];
    setFormulas(updated);
    onChange({ pricingFormulas: updated });
    setNewFormula({ name: '', formula: '' });
  };

  const removeFormula = (id: string) => {
    const updated = formulas.filter(f => f.id !== id);
    setFormulas(updated);
    onChange({ pricingFormulas: updated });
  };

  const moveFormula = (id: string, direction: 'up' | 'down') => {
    const index = formulas.findIndex(f => f.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formulas.length) return;
    
    const updated = [...formulas];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((f, i) => f.order = i);
    
    setFormulas(updated);
    onChange({ pricingFormulas: updated });
  };

  return (
    <div className="space-y-6">
      {/* Variables Section */}
      <Card>
        <CardHeader>
          <CardTitle>Formula Variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            {variables.map((variable) => (
              <div key={variable.id} className="flex items-center gap-2 p-2 border rounded">
                <Badge variant="outline">{variable.type}</Badge>
                <span className="font-medium">{variable.name}</span>
                <span className="text-sm text-muted-foreground flex-1">{variable.description}</span>
                {!defaultVariables.find(v => v.id === variable.id) && (
                  <Button size="sm" variant="ghost" onClick={() => removeVariable(variable.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Variable name"
              value={newVariable.name}
              onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
            />
            <Select value={newVariable.type} onValueChange={(value: any) => setNewVariable(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="dimension">Dimension</SelectItem>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addVariable}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulas Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Formulas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {formulas.map((formula, index) => (
              <div key={formula.id} className="border rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{index + 1}</Badge>
                  <span className="font-medium">{formula.name}</span>
                  <div className="flex gap-1 ml-auto">
                    <Button size="sm" variant="ghost" onClick={() => moveFormula(formula.id, 'up')} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => moveFormula(formula.id, 'down')} disabled={index === formulas.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeFormula(formula.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <code className="text-sm bg-muted p-2 rounded block">{formula.formula}</code>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="Formula name"
              value={newFormula.name}
              onChange={(e) => setNewFormula(prev => ({ ...prev, name: e.target.value }))}
            />
            <Textarea
              placeholder="Formula (e.g., width * height * 0.05)"
              value={newFormula.formula}
              onChange={(e) => setNewFormula(prev => ({ ...prev, formula: e.target.value }))}
            />
            <Button onClick={addFormula}>
              <Plus className="h-4 w-4 mr-2" />
              Add Formula
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};