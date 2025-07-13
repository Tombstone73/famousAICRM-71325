import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormulaEngine } from '@/lib/formulaEngine';

interface FormulaEditorProps {
  formula: string;
  onChange: (formula: string) => void;
  onTest?: (result: number) => void;
}

const FormulaEditor: React.FC<FormulaEditorProps> = ({ formula, onChange, onTest }) => {
  const [testValues, setTestValues] = useState({
    width: 10,
    height: 10,
    quantity: 1,
    base_rate: 2.5
  });
  const [testResult, setTestResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleTest = () => {
    const result = FormulaEngine.evaluateFormula(formula, testValues);
    setTestResult(result);
    onTest?.(result);
    
    const validation = FormulaEngine.validateFormula(formula);
    setError(validation.error || '');
  };

  const insertFunction = (func: string) => {
    onChange(formula + func);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formula Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Formula (JavaScript)</Label>
          <Textarea
            value={formula}
            onChange={(e) => onChange(e.target.value)}
            placeholder="width * height * base_rate"
            rows={3}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => insertFunction('Math.ceil()')}>ceil()</Button>
          <Button size="sm" variant="outline" onClick={() => insertFunction('Math.floor()')}>floor()</Button>
          <Button size="sm" variant="outline" onClick={() => insertFunction('Math.round()')}>round()</Button>
          <Button size="sm" variant="outline" onClick={() => insertFunction('Math.max()')}>max()</Button>
          <Button size="sm" variant="outline" onClick={() => insertFunction('Math.min()')}>min()</Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div>
            <Label>Width</Label>
            <input
              type="number"
              value={testValues.width}
              onChange={(e) => setTestValues({...testValues, width: Number(e.target.value)})}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <div>
            <Label>Height</Label>
            <input
              type="number"
              value={testValues.height}
              onChange={(e) => setTestValues({...testValues, height: Number(e.target.value)})}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <div>
            <Label>Quantity</Label>
            <input
              type="number"
              value={testValues.quantity}
              onChange={(e) => setTestValues({...testValues, quantity: Number(e.target.value)})}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <div>
            <Label>Base Rate</Label>
            <input
              type="number"
              step="0.01"
              value={testValues.base_rate}
              onChange={(e) => setTestValues({...testValues, base_rate: Number(e.target.value)})}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
        </div>

        <Button onClick={handleTest}>Test Formula</Button>
        
        {testResult !== null && (
          <Alert>
            <AlertDescription>
              Result: ${testResult.toFixed(2)}
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FormulaEditor;