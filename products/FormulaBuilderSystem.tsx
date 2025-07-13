import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Save, Trash2, Calculator } from 'lucide-react';
import { VariableRegistry, FormulaVariable } from './VariableRegistry';
import { EnhancedFormulaEditor } from './EnhancedFormulaEditor';
import { FormulaEngine } from '@/lib/formulaEngine';

interface PricingFormula {
  id: string;
  name: string;
  formula: string;
  isActive: boolean;
  order: number;
  description?: string;
}

interface FormulaBuilderSystemProps {
  formulas: PricingFormula[];
  variables: FormulaVariable[];
  onFormulasChange: (formulas: PricingFormula[]) => void;
  onVariablesChange: (variables: FormulaVariable[]) => void;
  testContext?: Record<string, number>;
}

export const FormulaBuilderSystem: React.FC<FormulaBuilderSystemProps> = ({
  formulas,
  variables,
  onFormulasChange,
  onVariablesChange,
  testContext = {}
}) => {
  const [activeFormula, setActiveFormula] = useState<PricingFormula | null>(null);
  const [newFormulaName, setNewFormulaName] = useState('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [formulaValidation, setFormulaValidation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Calculate total price from all active formulas
    let total = 0;
    const context = variables.reduce((acc, variable) => {
      acc[variable.key] = testContext[variable.key] || variable.defaultValue || 0;
      return acc;
    }, {} as Record<string, number>);

    formulas.filter(f => f.isActive).forEach(formula => {
      const result = FormulaEngine.evaluateFormula(formula.formula, context);
      total += result;
    });
    
    setTotalPrice(total);
  }, [formulas, variables, testContext]);

  const createNewFormula = () => {
    if (!newFormulaName.trim()) return;
    
    const newFormula: PricingFormula = {
      id: Date.now().toString(),
      name: newFormulaName,
      formula: '',
      isActive: true,
      order: formulas.length,
      description: ''
    };
    
    onFormulasChange([...formulas, newFormula]);
    setActiveFormula(newFormula);
    setNewFormulaName('');
  };

  const updateFormula = (id: string, updates: Partial<PricingFormula>) => {
    const updated = formulas.map(f => f.id === id ? { ...f, ...updates } : f);
    onFormulasChange(updated);
    
    if (activeFormula?.id === id) {
      setActiveFormula({ ...activeFormula, ...updates });
    }
  };

  const deleteFormula = (id: string) => {
    const updated = formulas.filter(f => f.id !== id);
    onFormulasChange(updated);
    
    if (activeFormula?.id === id) {
      setActiveFormula(null);
    }
  };

  const handleFormulaValidation = (formulaId: string, isValid: boolean, error?: string) => {
    setFormulaValidation(prev => ({ ...prev, [formulaId]: isValid }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="formulas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="formulas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Formulas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Formula name (e.g., Base Price, Setup Fee)"
                  value={newFormulaName}
                  onChange={(e) => setNewFormulaName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createNewFormula()}
                />
                <Button onClick={createNewFormula}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Formula
                </Button>
              </div>
              
              <div className="space-y-2">
                {formulas.map((formula) => {
                  const isValid = formulaValidation[formula.id] !== false;
                  return (
                    <div key={formula.id} className="flex items-center gap-2 p-2 border rounded">
                      <Badge variant={formula.isActive ? "default" : "secondary"}>
                        {formula.order + 1}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{formula.name}</span>
                          {!isValid && <Badge variant="destructive">Invalid</Badge>}
                        </div>
                        {formula.formula && (
                          <code className="text-xs text-muted-foreground">{formula.formula}</code>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={activeFormula?.id === formula.id ? "default" : "outline"}
                          onClick={() => setActiveFormula(formula)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateFormula(formula.id, { isActive: !formula.isActive })}
                        >
                          {formula.isActive ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteFormula(formula.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {activeFormula && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={activeFormula.name}
                  onChange={(e) => updateFormula(activeFormula.id, { name: e.target.value })}
                  placeholder="Formula name"
                />
                <Button
                  onClick={() => setActiveFormula(null)}
                  variant="outline"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Done
                </Button>
              </div>
              
              <EnhancedFormulaEditor
                formula={activeFormula.formula}
                variables={variables}
                onChange={(formula) => updateFormula(activeFormula.id, { formula })}
                onValidate={(isValid, error) => handleFormulaValidation(activeFormula.id, isValid, error)}
                testContext={testContext}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="variables">
          <VariableRegistry
            variables={variables}
            onChange={onVariablesChange}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Pricing Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {variables.slice(0, 6).map((variable) => (
                  <div key={variable.id}>
                    <Label className="text-sm">{variable.name}</Label>
                    <div className="text-lg font-semibold">
                      {testContext[variable.key] || variable.defaultValue || 0}
                      {variable.unit && <span className="text-sm text-muted-foreground ml-1">{variable.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label>Formula Breakdown</Label>
                {formulas.filter(f => f.isActive).map((formula) => {
                  const context = variables.reduce((acc, variable) => {
                    acc[variable.key] = testContext[variable.key] || variable.defaultValue || 0;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  const result = FormulaEngine.evaluateFormula(formula.formula, context);
                  
                  return (
                    <div key={formula.id} className="flex justify-between items-center p-2 border rounded">
                      <span>{formula.name}</span>
                      <span className="font-semibold">${result.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-center">
                    <strong>Total Price:</strong>
                    <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};