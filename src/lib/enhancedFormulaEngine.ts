// Enhanced formula engine with variable resolution and validation

export interface FormulaContext {
  width?: number;
  height?: number;
  quantity?: number;
  base_rate?: number;
  setup_fee?: number;
  min_price?: number;
  max_price?: number;
  area?: number;
  sqft?: number;
  [key: string]: number | undefined;
}

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

export class EnhancedFormulaEngine {
  // Safe math functions available in formulas
  private static mathFunctions = {
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    abs: Math.abs,
    min: Math.min,
    max: Math.max,
    pow: Math.pow,
    sqrt: Math.sqrt
  };

  static resolveVariables(variables: FormulaVariable[], context: FormulaContext): FormulaContext {
    const resolved: FormulaContext = { ...context };

    // Calculate derived variables
    if (resolved.width && resolved.height) {
      resolved.area = resolved.width * resolved.height;
      resolved.sqft = resolved.area / 144;
    }

    // Apply variable mappings
    variables.forEach(variable => {
      if (variable.type === 'custom') {
        switch (variable.key) {
          case 'area':
            resolved[variable.key] = resolved.area || 0;
            break;
          case 'sqft':
            resolved[variable.key] = resolved.sqft || 0;
            break;
          default:
            resolved[variable.key] = variable.defaultValue || 0;
        }
      } else if (variable.fieldPath && resolved[variable.fieldPath] !== undefined) {
        resolved[variable.key] = resolved[variable.fieldPath];
      } else {
        resolved[variable.key] = variable.defaultValue || 0;
      }
    });

    return resolved;
  }

  static evaluateFormula(
    formula: string, 
    context: FormulaContext, 
    variables: FormulaVariable[] = []
  ): number {
    try {
      // Resolve all variables first
      const resolvedContext = this.resolveVariables(variables, context);
      
      // Create safe evaluation context
      const safeContext = {
        ...resolvedContext,
        Math: this.mathFunctions,
        // Common aliases
        w: resolvedContext.width || 0,
        h: resolvedContext.height || 0,
        qty: resolvedContext.quantity || 1,
        rate: resolvedContext.base_rate || 0
      };

      // Replace common patterns for easier formula writing
      let processedFormula = formula
        .replace(/math\./gi, 'Math.')
        .replace(/ceil\(/gi, 'Math.ceil(')
        .replace(/floor\(/gi, 'Math.floor(')
        .replace(/round\(/gi, 'Math.round(')
        .replace(/max\(/gi, 'Math.max(')
        .replace(/min\(/gi, 'Math.min(')
        .replace(/pow\(/gi, 'Math.pow(')
        .replace(/sqrt\(/gi, 'Math.sqrt(');

      // Create function with safe context
      const func = new Function(
        ...Object.keys(safeContext),
        `return ${processedFormula}`
      );

      const result = func(...Object.values(safeContext));
      
      // Ensure result is a valid number
      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('Formula must return a valid number');
      }

      return Math.max(0, result); // Ensure non-negative
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return 0;
    }
  }

  static validateFormula(
    formula: string, 
    variables: FormulaVariable[] = []
  ): { valid: boolean; error?: string } {
    try {
      // Test with sample data
      const testContext: FormulaContext = {
        width: 10,
        height: 10,
        quantity: 1,
        base_rate: 2.5,
        setup_fee: 25,
        min_price: 10,
        max_price: 1000
      };
      
      this.evaluateFormula(formula, testContext, variables);
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Invalid formula' 
      };
    }
  }

  static getFormulaPreview(
    formula: string, 
    context: FormulaContext, 
    variables: FormulaVariable[] = []
  ): string {
    try {
      const resolvedContext = this.resolveVariables(variables, context);
      let preview = formula;
      
      // Replace variables with their values
      Object.entries(resolvedContext).forEach(([key, value]) => {
        if (value !== undefined) {
          preview = preview.replace(
            new RegExp(`\\b${key}\\b`, 'g'), 
            value.toString()
          );
        }
      });
      
      return preview;
    } catch (error) {
      return formula;
    }
  }

  static extractVariables(formula: string): string[] {
    // Extract variable names from formula
    const variablePattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
    const matches = formula.match(variablePattern) || [];
    
    // Filter out Math functions and common keywords
    const reserved = ['Math', 'ceil', 'floor', 'round', 'max', 'min', 'pow', 'sqrt', 'abs'];
    return [...new Set(matches.filter(match => !reserved.includes(match)))];
  }
}