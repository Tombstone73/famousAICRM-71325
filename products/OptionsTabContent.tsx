import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useProductOptions } from '@/hooks/useProductOptions';

interface OptionsTabContentProps {
  selectedOptions: string[];
  onOptionToggle: (optionId: string, checked: boolean) => void;
  onAddOption: () => void;
}

export const OptionsTabContent: React.FC<OptionsTabContentProps> = ({
  selectedOptions,
  onOptionToggle,
  onAddOption
}) => {
  const { productOptions } = useProductOptions();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Product Options</Label>
        <Button
          type="button"
          variant="outline"
          onClick={onAddOption}
        >
          Add Option
        </Button>
      </div>
      
      <div className="space-y-2">
        {productOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`option-${option.id}`}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={(checked) => onOptionToggle(option.id, checked as boolean)}
            />
            <Label htmlFor={`option-${option.id}`} className="text-sm">
              {option.name} ({option.option_type})
            </Label>
          </div>
        ))}
      </div>

      {selectedOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selected Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {selectedOptions.map((optionId) => {
                const option = productOptions.find(o => o.id === optionId);
                return option ? (
                  <div key={optionId} className="text-sm">
                    • {option.name} ({option.option_type})
                  </div>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};