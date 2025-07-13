import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Palette, Save } from 'lucide-react';

const DesignSettings: React.FC = () => {
  const [enableDesignModule, setEnableDesignModule] = useState(false);

  const handleSave = () => {
    console.log('Saving design settings:', { enableDesignModule });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Design Workflow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            This tab is reserved for Design Workflow settings. Placeholder for future development.
          </p>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-design"
              checked={enableDesignModule}
              onCheckedChange={setEnableDesignModule}
            />
            <Label htmlFor="enable-design">Enable Design Module (coming soon)</Label>
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

export default DesignSettings;