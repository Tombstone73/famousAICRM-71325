import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calculator, AlertTriangle, CheckCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface FormulaTestSectionProps {
  selectedOptions: Record<string, any>;
  testVariables: Record<string, number>;
  onVariableChange: (variables: Record<string, number>) => void;
}

interface FormulaStep {
  step: string;
  calculation: string;
  result: number | string;
}

export const FormulaTestSection: React.FC<FormulaTestSectionProps> = ({
  selectedOptions,
  testVariables,
  onVariableChange
}) => {
  const [formula, setFormula] = useState('ceil(width / spacing) * 2 * rate');
  const [calculationSteps, setCalculationSteps] = useState<FormulaStep[]>([]);
  const [finalResult, setFinalResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(true);

  // Auto-generate variable inputs based on formula
  useEffect(() => {
    const variables = extractVariablesFromFormula(formula);
    const newTestVariables = { ...testVariables };
    
    variables.forEach(variable => {
      if (!(variable in newTestVariables)) {
        // Set default values for common variables
        switch (variable) {
          case 'width':
            newTestVariables[variable] = 36;
            break;
          case 'height':
            newTestVariables[variable] = 24;
            break;
          case 'spacing':
            newTestVariables[variable] = 12;
            break;
          case 'rate':
            newTestVariables[variable] = 0.5;
            break;
          case 'quantity':
            newTestVariables[variable] = 1;
            break;
          default:
            newTestVariables[variable] = 1;
        }
      }
    });
    
    onVariableChange(newTestVariables);
  }, [formula]);

  // Calculate formula with step-by-step debugging
  useEffect(() => {
    if (formula && Object.keys(testVariables).length > 0) {
      calculateFormulaWithSteps();
    }
  }, [formula, testVariables]);

  const extractVariablesFromFormula = (formulaStr: string): string[] => {
    const variablePattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
    const matches = formulaStr.match(variablePattern) || [];
    const mathFunctions = ['ceil', 'floor', 'round', 'abs', 'min', 'max', 'sqrt', 'pow'];
    return [...new Set(matches.filter(match => !mathFunctions.includes(match)))];
  };

  const calculateFormulaWithSteps = () => {
    try {
      setError(null);
      const steps: FormulaStep[] = [];
      let workingFormula = formula;

      // Step 1: Show variable substitution
      Object.entries(testVariables).forEach(([variable, value]) => {
        steps.push({
          step: `Substitute ${variable}`,
          calculation: `${variable} = ${value}`,
          result: value
        });
        workingFormula = workingFormula.replace(new RegExp(`\\b${variable}\\b`, 'g'), value.toString());
      });

      // Step 2: Show formula with values
      steps.push({
        step: 'Formula with values',
        calculation: workingFormula,
        result: 'Calculating...'
      });

      // Step 3: Evaluate mathematical functions step by step
      const mathSteps = evaluateStepByStep(workingFormula);
      steps.push(...mathSteps);

      // Final calculation
      const result = evaluateFormula(workingFormula);
      setFinalResult(result);
      setCalculationSteps(steps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid formula');
      setCalculationSteps([]);
      setFinalResult(null);
    }
  };

  const evaluateStepByStep = (formula: string): FormulaStep[] => {
    const steps: FormulaStep[] = [];
    let current = formula;

    // Handle ceil function
    if (current.includes('ceil(')) {
      const ceilMatch = current.match(/ceil\(([^)]+)\)/);
      if (ceilMatch) {
        const innerExpression = ceilMatch[1];
        const innerResult = evaluateFormula(innerExpression);
        const ceilResult = Math.ceil(innerResult);
        steps.push({
          step: 'Calculate ceil',
          calculation: `ceil(${innerExpression}) = ceil(${innerResult})`,
          result: ceilResult
        });
        current = current.replace(ceilMatch[0], ceilResult.toString());
      }
    }

    // Handle basic arithmetic
    if (current.includes('*') || current.includes('/') || current.includes('+') || current.includes('-')) {
      steps.push({
        step: 'Final calculation',
        calculation: current,
        result: evaluateFormula(current)
      });
    }

    return steps;
  };

  const evaluateFormula = (formula: string): number => {
    // Replace mathematical functions
    let processedFormula = formula
      .replace(/ceil\(/g, 'Math.ceil(')
      .replace(/floor\(/g, 'Math.floor(')
      .replace(/round\(/g, 'Math.round(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/min\(/g, 'Math.min(')
      .replace(/max\(/g, 'Math.max(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/pow\(/g, 'Math.pow(');

    // Evaluate safely
    return Function(`"use strict"; return (${processedFormula})`)();
  };

  const handleVariableChange = (variable: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onVariableChange({ ...testVariables, [variable]: numValue });
  };

  const copyGlobalFormula = () => {
    // This would copy from global formula library
    setFormula('ceil(width / spacing) * quantity * rate + setup_fee');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Formula Test & Debug
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Formula</Label>
            <div className="flex gap-2">
              <Textarea
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="Enter formula (e.g., ceil(width / spacing) * rate)"
                className="font-mono"
              />
              <Button variant="outline" onClick={copyGlobalFormula}>
                Copy Global
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(testVariables).map(([variable, value]) => (
              <div key={variable}>
                <Label className="capitalize">{variable}</Label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                  step="0.1"
                />
              </div>
            ))}
          </div>

          <Separator />

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {debugMode && calculationSteps.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Step-by-Step Calculation:</h4>
              {calculationSteps.map((step, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{step.calculation}</span>
                  <Badge variant="outline">{step.result}</Badge>
                </div>
              ))}
            </div>
          )}

          {finalResult !== null && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Final Result:</span>
                <Badge className="text-lg">${finalResult.toFixed(2)}</Badge>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};