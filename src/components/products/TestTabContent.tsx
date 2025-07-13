import React from 'react';
import { FormulaTestSection } from './FormulaTestSection';

interface TestTabContentProps {
  formula?: string;
  pricingModel?: any;
}

export const TestTabContent: React.FC<TestTabContentProps> = ({
  formula,
  pricingModel
}) => {
  return (
    <div className="space-y-4">
      <FormulaTestSection 
        formula={formula}
        pricingModel={pricingModel}
      />
    </div>
  );
};