import React from 'react';
import { PricingModelsManagerFixed } from './PricingModelsManagerFixed';

const PricingView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Models</h1>
          <p className="text-gray-600 mt-2">
            Manage your pricing formulas and calculations
          </p>
        </div>
      </div>
      <PricingModelsManagerFixed />
    </div>
  );
};

export default PricingView;