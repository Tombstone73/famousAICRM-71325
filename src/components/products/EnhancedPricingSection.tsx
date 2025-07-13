import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, DollarSign, Settings, Plus, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedFormulaEngine, FormulaContext } from '@/lib/enhancedFormulaEngine';
import { FormulaPreviewCard } from './FormulaPreviewCard';
import { ProductFormData } from './ProductEntryForm';

interface PricingFormula {
  id: string;
  name: string;
  formula: string;
  isActive: boolean;
  order: number;
  description?: string;
}

interface FormulaVariable {
  id: string;
  name: string;
  key: string;
  type: 'product_field' | 'media_property' | 'option_value' | 'custom';
  fieldPath?: string;
  defaultValue?: number;
  description?: string;
  unit?: string;
}

interface EnhancedPricingSectionProps {
  data: ProductFormData;
  onChange: (updates: Partial<ProductFormData>) => void;
}

const defaultVariables: FormulaVariable[] = [
  { id: 'width', name: 'Width', key: 'width', type: 'product_field', fieldPath: 'width', unit: 'in', description: 'Product width' },
  { id: 'height', name: 'Height', key: 'height', type: 'product_field', fieldPath: 'height', unit: 'in', description: 'Product height' },
  { id: 'area', name: 'Area', key: 'area', type: 'custom', unit: 'sq in', description: 'Width × Height' },
  { id: 'sqft', name: 'Square Feet', key: 'sqft', type: 'custom', unit: 'sq ft', description: 'Area ÷ 144' },
  { id: 'quantity', name: 'Quantity', key: 'qty', type: 'product_field', fieldPath: 'quantity', description: 'Order quantity' },
  { id: 'base_rate', name: 'Base Rate', key: 'rate', type: 'product_field', fieldPath: 'base_price', unit: '$', description: 'Base price per unit' }
];

export const EnhancedPricingSection: React.FC<EnhancedPricingSectionProps> = ({ data, onChange }) => {
  const [pricingMode, setPricingMode] = useState<'simple' | 'formula'>(
    data.pricingFormulas && data.pricingFormulas.length > 0 ? 'formula' : 'simple'
  );
  const [testContext, setTestContext] = useState({
    width: data.width || 12,
    height: data.height || 18,
    quantity: 100,
    base_rate: data.base_price || 0.15
  });
  const [newFormulaName, setNewFormulaName] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [editingFormula, setEditingFormula] = useState<string | null>(null);

  const variables = [...defaultVariables, ...(data.formulaVariables || [])];
  const formulas = data.pricingFormulas || [];

  useEffect(() => {
    setTestContext({
      width: data.width || 12,
      height: data.height || 18,
      quantity: 100,
      base_rate: data.base_price || 0.15
    });
  }, [data.width, data.height, data.base_price]);

  const handleFormulasChange = (newFormulas: PricingFormula[]) => {
    onChange({ pricingFormulas: newFormulas });
  };

  const addFormula = () => {
    if (!newFormulaName.trim() || !newFormula.trim()) return;
    
    const formula: PricingFormula = {
      id: Date.now().toString(),
      name: newFormulaName,
      formula: newFormula,
      isActive: true,
      order: formulas.length
    };
    
    handleFormulasChange([...formulas, formula]);
    setNewFormulaName('');
    setNewFormula('');
  };

  const updateFormula = (id: string, updates: Partial<PricingFormula>) => {
    const updated = formulas.map(f => f.id === id ? { ...f, ...updates } : f);
    handleFormulasChange(updated);
  };

  const deleteFormula = (id: string) => {
    const updated = formulas.filter(f => f.id !== id);
    handleFormulasChange(updated);
  };

  const switchToFormulaMode = () => {
    setPricingMode('formula');
    if (data.base_price && formulas.length === 0) {
      const defaultFormula: PricingFormula = {
        id: Date.now().toString(),
        name: 'Base Price',
        formula: 'width * height * rate / 144',
        isActive: true,
        order: 0
      };
      handleFormulasChange([defaultFormula]);
    }
  };

  const insertVariable = (key: string) => {
    setNewFormula(prev => prev + key);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Configuration
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={pricingMode === 'simple' ? 'default' : 'outline'}
                onClick={() => setPricingMode('simple')}
              >
                Simple
              </Button>
              <Button
                size="sm"
                variant={pricingMode === 'formula' ? 'default' : 'outline'}
                onClick={switchToFormulaMode}
              >
                Formula
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={pricingMode} onValueChange={(value: any) => setPricingMode(value)}>
            <TabsContent value="simple" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Base Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.base_price || ''}
                    onChange={(e) => onChange({ base_price: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Setup Fee</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.setup_fee || ''}
                    onChange={(e) => onChange({ setup_fee: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Minimum Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.min_price || ''}
                    onChange={(e) => onChange({ min_price: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Maximum Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.max_price || ''}
                    onChange={(e) => onChange({ max_price: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-center">
                    <span>Simple pricing uses base price × area calculation</span>
                    <Button size="sm" variant="outline" onClick={switchToFormulaMode}>
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Formulas
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="formula" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Formula Builder</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Available Variables</Label>
                        <div className="flex flex-wrap gap-1">
                          {variables.map(variable => (
                            <Button
                              key={variable.id}
                              size="sm"
                              variant="outline"
                              onClick={() => insertVariable(variable.key)}
                            >
                              {variable.key}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Formula Name</Label>
                        <Input
                          value={newFormulaName}
                          onChange={(e) => setNewFormulaName(e.target.value)}
                          placeholder="e.g., Base Price, Setup Fee"
                        />
                      </div>
                      
                      <div>
                        <Label>Formula Expression</Label>
                        <Textarea
                          value={newFormula}
                          onChange={(e) => setNewFormula(e.target.value)}
                          placeholder="width * height * rate"
                          rows={3}
                        />
                      </div>
                      
                      <Button onClick={addFormula} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Formula
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Formulas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {formulas.map((formula, index) => (
                          <div key={formula.id} className="flex items-center gap-2 p-2 border rounded">
                            <Badge>{index + 1}</Badge>
                            <div className="flex-1">
                              <div className="font-medium">{formula.name}</div>
                              <code className="text-xs text-muted-foreground">{formula.formula}</code>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteFormula(formula.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <FormulaPreviewCard
                  formulas={formulas}
                  variables={variables}
                  context={testContext}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Width (in)</Label>
              <Input
                type="number"
                step="0.1"
                value={testContext.width}
                onChange={(e) => setTestContext(prev => ({ ...prev, width: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Height (in)</Label>
              <Input
                type="number"
                step="0.1"
                value={testContext.height}
                onChange={(e) => setTestContext(prev => ({ ...prev, height: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={testContext.quantity}
                onChange={(e) => setTestContext(prev => ({ ...prev, quantity: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Base Rate ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={testContext.base_rate}
                onChange={(e) => setTestContext(prev => ({ ...prev, base_rate: Number(e.target.value) }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};