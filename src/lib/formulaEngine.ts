// Formula engine with JavaScript math functions for pricing calculations

export interface FormulaContext {
  width?: number;
  height?: number;
  quantity?: number;
  base_rate?: number;
  setup_fee?: number;
  min_price?: number;
  max_price?: number;
}

export class FormulaEngine {
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

  static evaluateFormula(formula: string, context: FormulaContext): number {
    try {
      // Create safe evaluation context
      const safeContext = {
        ...context,
        Math: this.mathFunctions,
        // Aliases for convenience
        w: context.width || 0,
        h: context.height || 0,
        qty: context.quantity || 1,
        rate: context.base_rate || 0
      };

      // Replace common patterns for easier formula writing
      let processedFormula = formula
        .replace(/math\./gi, 'Math.')
        .replace(/ceil\(/gi, 'Math.ceil(')
        .replace(/floor\(/gi, 'Math.floor(')
        .replace(/round\(/gi, 'Math.round(');

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

  static validateFormula(formula: string): { valid: boolean; error?: string } {
    try {
      // Test with sample data
      this.evaluateFormula(formula, {
        width: 10,
        height: 10,
        quantity: 1,
        base_rate: 2.5
      });
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Invalid formula' 
      };
    }
  }
}