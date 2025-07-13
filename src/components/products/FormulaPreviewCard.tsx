import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { EnhancedFormulaEngine, FormulaContext } from '@/lib/enhancedFormulaEngine';
import { FormulaVariable } from './VariableRegistry';

interface PricingFormula {
  id: string;
  name: string;
  formula: string;
  isActive: boolean;
  order: number;
  description?: string;
}

interface FormulaPreviewCardProps {
  formulas: PricingFormula[];
  variables: FormulaVariable[];
  context: FormulaContext;
  className?: string;
}

export const FormulaPreviewCard: React.FC<FormulaPreviewCardProps> = ({
  formulas,
  variables,
  context,
  className = ''
}) => {
  const [calculations, setCalculations] = useState<{
    [key: string]: { result: number; preview: string; valid: boolean; error?: string }
  }>({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const newCalculations: typeof calculations = {};
    let total = 0;

    formulas.filter(f => f.isActive).forEach(formula => {
      try {
        const result = EnhancedFormulaEngine.evaluateFormula(formula.formula, context, variables);
        const preview = EnhancedFormulaEngine.getFormulaPreview(formula.formula, context, variables);
        const validation = EnhancedFormulaEngine.validateFormula(formula.formula, variables);
        
        newCalculations[formula.id] = {
          result,
          preview,
          valid: validation.valid,
          error: validation.error
        };
        
        if (validation.valid) {
          total += result;
        }
      } catch (error) {
        newCalculations[formula.id] = {
          result: 0,
          preview: formula.formula,
          valid: false,
          error: error instanceof Error ? error.message : 'Calculation error'
        };
      }
    });

    setCalculations(newCalculations);
    setTotalPrice(total);
  }, [formulas, variables, context]);

  const activeFormulas = formulas.filter(f => f.isActive);
  const hasErrors = Object.values(calculations).some(calc => !calc.valid);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Real-time Pricing Preview
          {hasErrors ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Context Summary */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>Width:</span>
            <span>{context.width || 0} in</span>
          </div>
          <div className="flex justify-between">
            <span>Height:</span>
            <span>{context.height || 0} in</span>
          </div>
          <div className="flex justify-between">
            <span>Area:</span>
            <span>{((context.width || 0) * (context.height || 0)).toFixed(1)} sq in</span>
          </div>
          <div className="flex justify-between">
            <span>Sq Ft:</span>
            <span>{(((context.width || 0) * (context.height || 0)) / 144).toFixed(2)} sq ft</span>
          </div>
        </div>

        {/* Formula Calculations */}
        <div className="space-y-2">
          {activeFormulas.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <p>No active formulas configured</p>
            </div>
          ) : (
            activeFormulas.map((formula, index) => {
              const calc = calculations[formula.id];
              if (!calc) return null;

              return (
                <div key={formula.id} className="border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{formula.name}</span>
                      {!calc.valid && <Badge variant="destructive">Error</Badge>}
                    </div>
                    <span className="font-semibold">
                      {calc.valid ? `$${calc.result.toFixed(2)}` : '$0.00'}
                    </span>
                  </div>
                  
                  {calc.preview !== formula.formula && (
                    <div className="text-xs">
                      <div className="text-muted-foreground">Formula: {formula.formula}</div>
                      <div className="font-mono bg-muted p-1 rounded mt-1">
                        Resolved: {calc.preview}
                      </div>
                    </div>
                  )}
                  
                  {!calc.valid && calc.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{calc.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Total Price */}
        {activeFormulas.length > 0 && (
          <Alert className={hasErrors ? 'border-red-200' : 'border-green-200'}>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              <div className="flex justify-between items-center">
                <strong>Total Calculated Price:</strong>
                <span className="text-xl font-bold">
                  ${totalPrice.toFixed(2)}
                  {hasErrors && <span className="text-red-500 text-sm ml-2">(with errors)</span>}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Variable Values */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Variable Values</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {variables.map(variable => {
              const resolvedContext = EnhancedFormulaEngine.resolveVariables(variables, context);
              const value = resolvedContext[variable.key];
              return (
                <div key={variable.id} className="flex justify-between">
                  <code>{variable.key}:</code>
                  <span>
                    {value !== undefined ? value.toFixed(2) : 'N/A'}
                    {variable.unit && <span className="text-muted-foreground ml-1">{variable.unit}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};