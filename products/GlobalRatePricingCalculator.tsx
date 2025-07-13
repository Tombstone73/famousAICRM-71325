import React from 'react';
import { useOptionRates } from '@/hooks/useOptionRates';

interface PricingCalculation {
  rateName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description: string;
}

interface GlobalRatePricingCalculatorProps {
  calculations: PricingCalculation[];
  onCalculationsChange: (calculations: PricingCalculation[]) => void;
}

export const GlobalRatePricingCalculator: React.FC<GlobalRatePricingCalculatorProps> = ({
  calculations,
  onCalculationsChange
}) => {
  const { getRateByName } = useOptionRates();

  // Calculate grommet pricing based on dimensions and spacing
  const calculateGrommetPricing = (width: number, height: number, spacing: number = 24): PricingCalculation => {
    const grommetRate = getRateByName('grommet_rate');
    if (!grommetRate) {
      return {
        rateName: 'grommet_rate',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        description: 'Grommet rate not found'
      };
    }

    // Calculate perimeter and number of grommets needed
    const perimeter = (width + height) * 2;
    const baseGrommets = 4; // Corner grommets
    const additionalGrommets = Math.max(0, Math.ceil(perimeter / spacing) - baseGrommets);
    const totalGrommets = baseGrommets + additionalGrommets;

    return {
      rateName: 'grommet_rate',
      quantity: totalGrommets,
      unitPrice: grommetRate.base_rate,
      totalPrice: totalGrommets * grommetRate.base_rate,
      description: `${totalGrommets} grommets (${baseGrommets} corners + ${additionalGrommets} additional at ${spacing}" spacing)`
    };
  };

  // Calculate pole pocket pricing
  const calculatePolePocketPricing = (selectedSides: string[], dimensions: { width: number; height: number }): PricingCalculation[] => {
    const setupRate = getRateByName('pole_pocket_setup');
    const linearRate = getRateByName('pole_pocket_linear');
    
    const calculations: PricingCalculation[] = [];

    // Setup fee
    if (setupRate && selectedSides.length > 0) {
      calculations.push({
        rateName: 'pole_pocket_setup',
        quantity: 1,
        unitPrice: setupRate.base_rate,
        totalPrice: setupRate.base_rate,
        description: 'Pole pocket setup fee'
      });
    }

    // Linear footage charges
    if (linearRate) {
      let totalLinearFeet = 0;
      const sideDescriptions: string[] = [];

      selectedSides.forEach(side => {
        let linearFeet = 0;
        switch (side) {
          case 'top':
          case 'bottom':
            linearFeet = dimensions.width / 12; // Convert inches to feet
            sideDescriptions.push(`${side} (${linearFeet.toFixed(1)} ft)`);
            break;
          case 'left':
          case 'right':
            linearFeet = dimensions.height / 12; // Convert inches to feet
            sideDescriptions.push(`${side} (${linearFeet.toFixed(1)} ft)`);
            break;
        }
        totalLinearFeet += linearFeet;
      });

      if (totalLinearFeet > 0) {
        calculations.push({
          rateName: 'pole_pocket_linear',
          quantity: totalLinearFeet,
          unitPrice: linearRate.base_rate,
          totalPrice: totalLinearFeet * linearRate.base_rate,
          description: `Pole pocket linear: ${sideDescriptions.join(', ')}`
        });
      }
    }

    return calculations;
  };

  // Calculate hemming pricing
  const calculateHemmingPricing = (selectedSides: string[], dimensions: { width: number; height: number }): PricingCalculation => {
    const hemmingRate = getRateByName('hemming_rate');
    if (!hemmingRate) {
      return {
        rateName: 'hemming_rate',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        description: 'Hemming rate not found'
      };
    }

    let totalLinearFeet = 0;
    const sideDescriptions: string[] = [];

    selectedSides.forEach(side => {
      let linearFeet = 0;
      switch (side) {
        case 'top':
        case 'bottom':
          linearFeet = dimensions.width / 12;
          sideDescriptions.push(`${side} (${linearFeet.toFixed(1)} ft)`);
          break;
        case 'left':
        case 'right':
          linearFeet = dimensions.height / 12;
          sideDescriptions.push(`${side} (${linearFeet.toFixed(1)} ft)`);
          break;
      }
      totalLinearFeet += linearFeet;
    });

    return {
      rateName: 'hemming_rate',
      quantity: totalLinearFeet,
      unitPrice: hemmingRate.base_rate,
      totalPrice: totalLinearFeet * hemmingRate.base_rate,
      description: `Hemming: ${sideDescriptions.join(', ')}`
    };
  };

  // Calculate lamination pricing
  const calculateLaminationPricing = (width: number, height: number): PricingCalculation => {
    const laminationRate = getRateByName('lamination_rate');
    if (!laminationRate) {
      return {
        rateName: 'lamination_rate',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        description: 'Lamination rate not found'
      };
    }

    const squareFeet = (width * height) / 144; // Convert square inches to square feet
    
    return {
      rateName: 'lamination_rate',
      quantity: squareFeet,
      unitPrice: laminationRate.base_rate,
      totalPrice: squareFeet * laminationRate.base_rate,
      description: `Lamination: ${squareFeet.toFixed(2)} sq ft`
    };
  };

  // Export calculation functions for use in other components
  const calculationFunctions = {
    calculateGrommetPricing,
    calculatePolePocketPricing,
    calculateHemmingPricing,
    calculateLaminationPricing
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Pricing Calculations</h3>
      {calculations.length === 0 ? (
        <p className="text-gray-500 text-sm">No calculations to display</p>
      ) : (
        <div className="space-y-2">
          {calculations.map((calc, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{calc.description}</span>
                <div className="text-sm text-gray-600">
                  {calc.quantity.toFixed(2)} × ${calc.unitPrice.toFixed(2)}
                </div>
              </div>
              <div className="font-semibold">
                ${calc.totalPrice.toFixed(2)}
              </div>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between items-center font-bold">
            <span>Total Option Pricing:</span>
            <span>${calculations.reduce((sum, calc) => sum + calc.totalPrice, 0).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Export calculation functions for use in other components
export const useGlobalRateCalculations = () => {
  const { getRateByName } = useOptionRates();

  const calculateGrommetPricing = (width: number, height: number, spacing: number = 24): PricingCalculation => {
    const grommetRate = getRateByName('grommet_rate');
    if (!grommetRate) {
      return {
        rateName: 'grommet_rate',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        description: 'Grommet rate not found'
      };
    }

    const perimeter = (width + height) * 2;
    const baseGrommets = 4;
    const additionalGrommets = Math.max(0, Math.ceil(perimeter / spacing) - baseGrommets);
    const totalGrommets = baseGrommets + additionalGrommets;

    return {
      rateName: 'grommet_rate',
      quantity: totalGrommets,
      unitPrice: grommetRate.base_rate,
      totalPrice: totalGrommets * grommetRate.base_rate,
      description: `${totalGrommets} grommets (${baseGrommets} corners + ${additionalGrommets} additional at ${spacing}" spacing)`
    };
  };

  const calculatePolePocketPricing = (selectedSides: string[], dimensions: { width: number; height: number }): PricingCalculation[] => {
    const setupRate = getRateByName('pole_pocket_setup');
    const linearRate = getRateByName('pole_pocket_linear');
    
    const calculations: PricingCalculation[] = [];

    if (setupRate && selectedSides.length > 0) {
      calculations.push({
        rateName: 'pole_pocket_setup',
        quantity: 1,
        unitPrice: setupRate.base_rate,
        totalPrice: setupRate.base_rate,
        description: 'Pole pocket setup fee'
      });
    }

    if (linearRate) {
      let totalLinearFeet = 0;
      const sideDescriptions: string[] = [];

      selectedSides.forEach(side => {
        let linearFeet = 0;
        switch (side) {
          case 'top':
          case 'bottom':
            linearFeet = dimensions.width / 12;
            sideDescriptions.push(`${side} (${linearFeet.toFixed(1)} ft)`);
            break;
          case 'left':
          case 'right':
            linearFeet = dimensions.height / 12;
            sideDescriptions.push(`${side} (${linearFeet.toFixed(1)} ft)`);
            break;
        }
        totalLinearFeet += linearFeet;
      });

      if (totalLinearFeet > 0) {
        calculations.push({
          rateName: 'pole_pocket_linear',
          quantity: totalLinearFeet,
          unitPrice: linearRate.base_rate,
          totalPrice: totalLinearFeet * linearRate.base_rate,
          description: `Pole pocket linear: ${sideDescriptions.join(', ')}`
        });
      }
    }

    return calculations;
  };

  return {
    calculateGrommetPricing,
    calculatePolePocketPricing
  };
};

export type { PricingCalculation };