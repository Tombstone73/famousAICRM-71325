import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSidebarPresets } from '@/hooks/useSidebarPresets';
import { Lock } from 'lucide-react';

interface PresetSelectorProps {
  className?: string;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ className }) => {
  const { presets, activePresetId, setActivePresetId } = useSidebarPresets();

  const handlePresetChange = (presetId: string) => {
    setActivePresetId(presetId);
  };

  return (
    <div className={className}>
      <Select value={activePresetId} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select preset" />
        </SelectTrigger>
        <SelectContent>
          {presets.map(preset => (
            <SelectItem key={preset.id} value={preset.id}>
              <div className="flex items-center gap-2">
                {preset.isDefault && <Lock className="w-3 h-3" />}
                {preset.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PresetSelector;