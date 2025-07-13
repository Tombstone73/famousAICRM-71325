import React from 'react';
import { Button } from '@/components/ui/button';

interface PresetFormula {
  name: string;
  type: string;
  formula: string;
  description: string;
}

interface PresetFormulasProps {
  onPresetClick: (preset: PresetFormula) => void;
}

const PresetFormulas: React.FC<PresetFormulasProps> = ({ onPresetClick }) => {
  const presetFormulas: PresetFormula[] = [
    {
      name: 'Square Feet (Rounded Area)',
      type: 'square-feet',
      formula: 'ceil(width * height) * base_rate',
      description: 'Rounds the total square footage up to the next full foot'
    },
    {
      name: 'Square Feet (Rounded Dimensions)',
      type: 'square-feet',
      formula: 'ceil(width) * ceil(height) * base_rate',
      description: 'Rounds both width and height up before calculating total area'
    },
    {
      name: 'Square Feet (Exact)',
      type: 'square-feet',
      formula: 'width * height * base_rate',
      description: 'Uses exact area (no rounding)'
    },
    {
      name: 'Linear Feet',
      type: 'linear-feet',
      formula: 'width * base_rate',
      description: 'Used when height is fixed (e.g., banners sold per foot of width)'
    },
    {
      name: 'Flat Rate Per Unit',
      type: 'fixed',
      formula: 'quantity * base_rate',
      description: 'For items like shirts or mugs that dont depend on size'
    },
    {
      name: 'Volume-Based',
      type: 'square-feet',
      formula: 'width * height * quantity * base_rate',
      description: 'Useful for multi-up items or 3D calculations'
    },
    {
      name: 'Sheet Usage (48x96 logic)',
      type: 'sheet-size',
      formula: 'ceil(width / 48) * ceil(height / 96) * base_rate',
      description: 'Calculates the number of full 48x96 sheets required (rounded up)'
    }
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Preset Formulas</h4>
      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
        {presetFormulas.map((preset, index) => (
          <div key={index} className="border rounded p-3 hover:bg-gray-50 cursor-pointer" onClick={() => onPresetClick(preset)}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h5 className="font-medium text-sm">{preset.name}</h5>
                <p className="text-xs text-gray-600 mt-1">{preset.description}</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block">{preset.formula}</code>
              </div>
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onPresetClick(preset); }}>
                Use
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresetFormulas;