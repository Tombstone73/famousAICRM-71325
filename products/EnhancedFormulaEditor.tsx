import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Play, AlertTriangle, CheckCircle } from 'lucide-react';
import { FormulaEngine } from '@/lib/formulaEngine';
import { FormulaVariable } from './VariableRegistry';

interface EnhancedFormulaEditorProps {
  formula: string;
  variables: FormulaVariable[];
  onChange: (formula: string) => void;
  onValidate?: (isValid: boolean, error?: string) => void;
  testContext?: Record<string, number>;
}

export const EnhancedFormulaEditor: React.FC<EnhancedFormulaEditorProps> = ({
  formula,
  variables,
  onChange,
  onValidate,
  testContext = {}
}) => {
  const [testValues, setTestValues] = useState({
    width: 12,
    height: 18,
    quantity: 100,
    base_rate: 0.15,
    ...testContext
  });
  const [testResult, setTestResult] = useState<number | null>(null);
  const [validation, setValidation] = useState<{ valid: boolean; error?: string }>({ valid: true });
  const [previewFormula, setPreviewFormula] = useState('');

  useEffect(() => {
    // Real-time validation
    const result = FormulaEngine.validateFormula(formula);
    setValidation(result);
    onValidate?.(result.valid, result.error);
  }, [formula, onValidate]);

  useEffect(() => {
    // Generate preview with actual values
    let preview = formula;
    variables.forEach(variable => {
      const value = testValues[variable.key] || variable.defaultValue || 0;
      preview = preview.replace(new RegExp(`\\b${variable.key}\\b`, 'g'), value.toString());
    });
    setPreviewFormula(preview);
  }, [formula, variables, testValues]);

  const handleTest = () => {
    const context = variables.reduce((acc, variable) => {
      acc[variable.key] = testValues[variable.key] || variable.defaultValue || 0;
      return acc;
    }, {} as Record<string, number>);
    
    const result = FormulaEngine.evaluateFormula(formula, context);
    setTestResult(result);
  };

  const insertVariable = (variable: FormulaVariable) => {
    const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || formula.length;
    const newFormula = formula.slice(0, cursorPos) + variable.key + formula.slice(cursorPos);
    onChange(newFormula);
  };

  const insertFunction = (func: string) => {
    const cursorPos = (document.activeElement as HTMLTextAreaElement)?.selectionStart || formula.length;
    const newFormula = formula.slice(0, cursorPos) + func + formula.slice(cursorPos);
    onChange(newFormula);
  };

  const mathFunctions = [
    { name: 'Math.ceil()', desc: 'Round up' },
    { name: 'Math.floor()', desc: 'Round down' },
    { name: 'Math.round()', desc: 'Round nearest' },
    { name: 'Math.max(a,b)', desc: 'Maximum value' },
    { name: 'Math.min(a,b)', desc: 'Minimum value' },
    { name: 'Math.pow(a,b)', desc: 'Power (a^b)' },
    { name: 'Math.sqrt()', desc: 'Square root' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Formula Builder
          {validation.valid ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="space-y-4">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div>
              <Label>Formula Expression</Label>
              <Textarea
                value={formula}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your pricing formula (e.g., width * height * rate)"
                rows={4}
                className={validation.valid ? '' : 'border-red-500'}
              />
            </div>
            
            {!validation.valid && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{validation.error}</AlertDescription>
              </Alert>
            )}
            
            {previewFormula && previewFormula !== formula && (
              <div>
                <Label>Preview with Test Values</Label>
                <div className="p-2 bg-muted rounded text-sm font-mono">
                  {previewFormula}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="variables" className="space-y-4">
            <div>
              <Label>Available Variables</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {variables.map((variable) => (
                  <Button
                    key={variable.id}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable)}
                    className="justify-start"
                  >
                    <Badge variant="secondary" className="mr-2">
                      {variable.key}
                    </Badge>
                    {variable.name}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="functions" className="space-y-4">
            <div>
              <Label>Math Functions</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {mathFunctions.map((func) => (
                  <Button
                    key={func.name}
                    variant="outline"
                    size="sm"
                    onClick={() => insertFunction(func.name)}
                    className="justify-between"
                  >
                    <code className="text-xs">{func.name}</code>
                    <span className="text-xs text-muted-foreground">{func.desc}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Common Operators</Label>
              <div className="flex gap-2 mt-2">
                {['+', '-', '*', '/', '(', ')', '**'].map((op) => (
                  <Button
                    key={op}
                    variant="outline"
                    size="sm"
                    onClick={() => insertFunction(op)}
                  >
                    {op}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div>
              <Label>Test Values</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {variables.slice(0, 6).map((variable) => (
                  <div key={variable.id}>
                    <Label className="text-xs">{variable.name} ({variable.key})</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={testValues[variable.key] || variable.defaultValue || 0}
                      onChange={(e) => setTestValues(prev => ({
                        ...prev,
                        [variable.key]: Number(e.target.value)
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={handleTest} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Test Formula
            </Button>
            
            {testResult !== null && (
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  <strong>Result:</strong> ${testResult.toFixed(2)}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};