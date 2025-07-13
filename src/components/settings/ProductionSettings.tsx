import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Save } from 'lucide-react';

interface ProductionSettings {
  printTimePerSqFt: number;
  finishingTimePerSqFt: number;
  setupTimeRoll: number;
  setupTimeFlatbed: number;
}

const ProductionSettings: React.FC = () => {
  const [settings, setSettings] = useState<ProductionSettings>({
    printTimePerSqFt: 2,
    finishingTimePerSqFt: 1,
    setupTimeRoll: 30,
    setupTimeFlatbed: 45
  });

  const handleSave = () => {
    console.log('Saving production settings:', settings);
  };

  const updateSetting = (key: keyof ProductionSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Production Time Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="printTime">Print Time per Sq Ft (minutes)</Label>
            <Input
              id="printTime"
              type="number"
              value={settings.printTimePerSqFt}
              onChange={(e) => updateSetting('printTimePerSqFt', Number(e.target.value))}
              min="0"
              step="0.1"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">Time required to print one square foot</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finishingTime">Finishing Time per Sq Ft (minutes)</Label>
            <Input
              id="finishingTime"
              type="number"
              value={settings.finishingTimePerSqFt}
              onChange={(e) => updateSetting('finishingTimePerSqFt', Number(e.target.value))}
              min="0"
              step="0.1"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">Time required for finishing work per square foot</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="setupRoll">Roll Printer Setup Time (minutes)</Label>
            <Input
              id="setupRoll"
              type="number"
              value={settings.setupTimeRoll}
              onChange={(e) => updateSetting('setupTimeRoll', Number(e.target.value))}
              min="0"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">Setup time for roll printing jobs</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="setupFlatbed">Flatbed Printer Setup Time (minutes)</Label>
            <Input
              id="setupFlatbed"
              type="number"
              value={settings.setupTimeFlatbed}
              onChange={(e) => updateSetting('setupTimeFlatbed', Number(e.target.value))}
              min="0"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">Setup time for flatbed printing jobs</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionSettings;