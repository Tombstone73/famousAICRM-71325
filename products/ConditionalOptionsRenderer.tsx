import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OptionRate {
  id: string;
  option_type: string;
  pricing_type: 'flat_fee' | 'per_unit' | 'formula';
  base_price: number;
  formula?: string;
  unit_type?: string;
}

interface ConditionalOptionsRendererProps {
  selectedOptions: Record<string, any>;
  onOptionChange: (optionId: string, value: any) => void;
  rates: OptionRate[];
}

export const ConditionalOptionsRenderer: React.FC<ConditionalOptionsRendererProps> = ({
  selectedOptions,
  onOptionChange,
  rates
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Grommets Configuration
  const renderGrommetsOptions = () => {
    const grommetsEnabled = selectedOptions.grommets?.enabled || false;
    const grommetsRate = rates.find(r => r.option_type === 'grommets');
    
    return (
      <Collapsible>
        <CollapsibleTrigger 
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50 rounded-lg"
          onClick={() => toggleSection('grommets')}
        >
          <div className="flex items-center space-x-3">
            {expandedSections.grommets ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <Label className="text-base font-medium">Grommets</Label>
            <Switch
              checked={grommetsEnabled}
              onCheckedChange={(checked) => 
                onOptionChange('grommets', { ...selectedOptions.grommets, enabled: checked })
              }
            />
          </div>
          {grommetsRate && (
            <Badge variant="outline">
              {grommetsRate.pricing_type === 'flat_fee' ? `$${grommetsRate.base_price}` : 
               grommetsRate.pricing_type === 'per_unit' ? `$${grommetsRate.base_price}/unit` : 'Formula'}
            </Badge>
          )}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-4 pb-4">
          {grommetsEnabled && (
            <div className="space-y-4 mt-4 border-l-2 border-blue-200 pl-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Placement</Label>
                  <Select
                    value={selectedOptions.grommets?.placement || ''}
                    onValueChange={(value) => 
                      onOptionChange('grommets', { ...selectedOptions.grommets, placement: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select placement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corners">Corners Only</SelectItem>
                      <SelectItem value="sides">All Sides</SelectItem>
                      <SelectItem value="top-bottom">Top & Bottom</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Spacing (inches)</Label>
                  <Input
                    type="number"
                    value={selectedOptions.grommets?.spacing || 24}
                    onChange={(e) => 
                      onOptionChange('grommets', { 
                        ...selectedOptions.grommets, 
                        spacing: parseInt(e.target.value) || 24 
                      })
                    }
                    min="6"
                    max="48"
                  />
                </div>
              </div>
              
              {selectedOptions.grommets?.spacing < 24 && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Additional grommets required for spacing less than 24". 
                    Extra charge: ${((24 - selectedOptions.grommets.spacing) / 6 * (grommetsRate?.base_price || 0)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Pole Pockets Configuration
  const renderPolePocketsOptions = () => {
    const polePocketsEnabled = selectedOptions.pole_pockets?.enabled || false;
    const polePocketsRate = rates.find(r => r.option_type === 'pole_pockets');
    
    return (
      <Collapsible>
        <CollapsibleTrigger 
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50 rounded-lg"
          onClick={() => toggleSection('pole_pockets')}
        >
          <div className="flex items-center space-x-3">
            {expandedSections.pole_pockets ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <Label className="text-base font-medium">Pole Pockets</Label>
            <Switch
              checked={polePocketsEnabled}
              onCheckedChange={(checked) => 
                onOptionChange('pole_pockets', { ...selectedOptions.pole_pockets, enabled: checked })
              }
            />
          </div>
          {polePocketsRate && (
            <Badge variant="outline">
              Setup: ${polePocketsRate.base_price}
            </Badge>
          )}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-4 pb-4">
          {polePocketsEnabled && (
            <div className="space-y-4 mt-4 border-l-2 border-green-200 pl-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pocket Size</Label>
                  <Select
                    value={selectedOptions.pole_pockets?.size || ''}
                    onValueChange={(value) => 
                      onOptionChange('pole_pockets', { ...selectedOptions.pole_pockets, size: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-inch">1 inch</SelectItem>
                      <SelectItem value="2-inch">2 inch</SelectItem>
                      <SelectItem value="3-inch">3 inch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Sides</Label>
                  <Select
                    value={selectedOptions.pole_pockets?.sides || ''}
                    onValueChange={(value) => 
                      onOptionChange('pole_pockets', { ...selectedOptions.pole_pockets, sides: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sides" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top Only</SelectItem>
                      <SelectItem value="bottom">Bottom Only</SelectItem>
                      <SelectItem value="both">Top & Bottom</SelectItem>
                      <SelectItem value="left">Left Side</SelectItem>
                      <SelectItem value="right">Right Side</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Conditional Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {renderGrommetsOptions()}
          {renderPolePocketsOptions()}
        </CardContent>
      </Card>
    </div>
  );
};